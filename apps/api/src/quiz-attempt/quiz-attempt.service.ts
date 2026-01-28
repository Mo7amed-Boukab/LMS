import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Quiz } from 'src/quiz/schema/quiz.schema';
import { QuizAttempt } from './schema/quiz-attempt.schema';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { ProgressModuleService } from 'src/progress-module/progress-module.service';

@Injectable()
export class QuizAttemptService {
  constructor(
    @InjectModel(QuizAttempt.name) private quizAttemptModel: Model<QuizAttempt>,
    @InjectModel(Quiz.name) private quizModel: Model<Quiz>,
    private progressService: ProgressModuleService,
  ) {}

  // start quiz (retourner les questions)
  async startQuiz(studentId: string, quizId: string) {
    const quiz = await this.quizModel.findById(quizId);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // Vérifier l'accès au module
    const hasAccess = await this.progressService.canAccessModule(
      studentId,
      quiz.moduleId.toString(),
    );

    if (!hasAccess) {
      throw new ForbiddenException(
        'You must complete the previous module to access this quiz',
      );
    }

    //Retourner les questions SANS les réponses correctes
    const questionsForStudent = quiz.questions.map((q) => ({
      _id: q._id,
      text: q.text,
      type: q.type,
      options: q.options.map((opt) => ({
        _id: opt._id,
        text: opt.text,
      })),
    }));

    return {
      quizId: quiz._id,
      title: quiz.title,
      passingScore: quiz.passingScore,
      totalQuestions: quiz.questions.length,
      questions: questionsForStudent,
    };
  }

  // soumettre le quiz complet (avec toutes les réponses)
  async submitQuiz(
    studentId: string,
    quizId: string,
    submitQuizDto: SubmitQuizDto,
  ) {
    // Récupérer le quiz avec .lean() pour performance
    const quiz = await this.quizModel.findById(quizId).lean();
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // Vérifier le nombre de réponses
    if (submitQuizDto.answers.length !== quiz.questions.length) {
      throw new BadRequestException(
        `All questions must be answered. Expected ${quiz.questions.length}, got ${submitQuizDto.answers.length}`,
      );
    }

    const questionsMap = new Map(
      quiz.questions.map((q) => [q._id.toString(), q]),
    );

    const answersMap = new Map(
      submitQuizDto.answers.map((a) => [a.questionId, a.selectedOptionId]),
    );

    // Corriger les réponses
    const correctedAnswers = submitQuizDto.answers.map((answer) => {
      const question = questionsMap.get(answer.questionId);

      if (!question) {
        throw new NotFoundException(`Question ${answer.questionId} not found`);
      }

      const selectedOption = question.options.find(
        (opt) => opt._id.toString() === answer.selectedOptionId,
      );

      if (!selectedOption) {
        throw new NotFoundException(
          `Option ${answer.selectedOptionId} not found`,
        );
      }

      return {
        questionId: new Types.ObjectId(answer.questionId),
        selectedOptionId: new Types.ObjectId(answer.selectedOptionId),
        isCorrect: selectedOption.isCorrect,
      };
    });

    // Calculer le score
    const correctCount = correctedAnswers.filter((a) => a.isCorrect).length;
    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // Créer la tentative
    const attempt = await this.quizAttemptModel.create({
      quizId: new Types.ObjectId(quizId),
      studentId: new Types.ObjectId(studentId),
      answers: correctedAnswers,
      score,
      passed,
    });

    // Si réussi : Débloquer le module suivant
    if (passed) {
      await this.progressService.completeModule(
        studentId,
        quiz.moduleId.toString(),
      );
    }

    return {
      attemptId: attempt._id,
      score,
      passed,
      correctAnswers: correctCount,
      totalQuestions: quiz.questions.length,
      passingScore: quiz.passingScore,
      message: passed
        ? 'Congratulations! Quiz passed. Next module unlocked.'
        : `You need at least ${quiz.passingScore}% to pass. Try again!`,
    };
  }

  //résultats détaillés
  async getAttemptResults(attemptId: string, studentId: string) {
    const attempt = await this.quizAttemptModel.findOne({
      _id: new Types.ObjectId(attemptId),
      studentId: new Types.ObjectId(studentId),
    });

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }

    const quiz = await this.quizModel.findById(attempt.quizId).lean();
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const questionsMap = new Map(
      quiz.questions.map((q) => [q._id.toString(), q]),
    );

    const details = attempt.answers.map((ans) => {
      const question = questionsMap.get(ans.questionId.toString());
      const correctOption = question?.options.find((opt) => opt.isCorrect);
      const studentOption = question?.options.find(
        (opt) => opt._id.toString() === ans.selectedOptionId.toString(),
      );

      return {
        questionText: question?.text,
        yourAnswer: studentOption?.text,
        correctAnswer: correctOption?.text,
        isCorrect: ans.isCorrect,
      };
    });

    return {
      attemptId: attempt._id,
      quizTitle: quiz.title,
      score: attempt.score,
      passed: attempt.passed,
      correctAnswers: attempt.answers.filter((a) => a.isCorrect).length,
      totalQuestions: quiz.questions.length,
      takenAt: attempt.createdAt,
      details,
    };
  }

  // historique des tentatives
  async getAttemptHistory(studentId: string, quizId: string) {
    const attempts = await this.quizAttemptModel
      .find({
        studentId: new Types.ObjectId(studentId),
        quizId: new Types.ObjectId(quizId),
      })
      .select('score passed createdAt')
      .sort({ createdAt: -1 })
      .lean();

    const quiz = await this.quizModel
      .findById(quizId)
      .select('title passingScore')
      .lean();

    return {
      quizTitle: quiz?.title,
      passingScore: quiz?.passingScore,
      totalAttempts: attempts.length,
      bestScore:
        attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : 0,
      attempts: attempts.map((att, idx) => ({
        attemptNumber: attempts.length - idx,
        score: att.score,
        passed: att.passed,
        takenAt: att.createdAt,
      })),
    };
  }

  // Stats pour formateur
  async getQuizStatistics(quizId: string) {
    const attempts = await this.quizAttemptModel
      .find({
        quizId: new Types.ObjectId(quizId),
      })
      .lean();

    const quiz = await this.quizModel
      .findById(quizId)
      .select('title passingScore');

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const totalAttempts = attempts.length;
    const uniqueStudents = new Set(attempts.map((a) => a.studentId.toString()))
      .size;
    const passedAttempts = attempts.filter((a) => a.passed).length;
    const averageScore =
      totalAttempts > 0
        ? (
            attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts
          ).toFixed(2)
        : 0;

    return {
      quizTitle: quiz.title,
      passingScore: quiz.passingScore,
      statistics: {
        totalAttempts,
        uniqueStudents,
        passedAttempts,
        passRate:
          totalAttempts > 0
            ? ((passedAttempts / totalAttempts) * 100).toFixed(2)
            : 0,
        averageScore,
      },
    };
  }
}

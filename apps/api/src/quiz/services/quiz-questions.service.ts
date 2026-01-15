import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question, Quiz } from '../schema/quiz.schema';
import { Model, Types } from 'mongoose';
import { CreateQuestionDto } from '../dto/create-quiz.dto';
import { UpdateQuestionDto } from '../dto/update-quiz.dto';
import { ObjectIdService } from 'src/common/services/objectId.service';
import { QuizService } from './quiz.service';

@Injectable()
export class QuizQuestionsService {
  constructor(
    @InjectModel('Quiz') private readonly quizModel: Model<Quiz>,
    private readonly objectIdService: ObjectIdService,
    private readonly quizService: QuizService,
  ) {}

  async addQuestion(quizId: string, createQuestionDto: CreateQuestionDto) {
    this.objectIdService.validateObjectId(quizId);

    const quiz = await this.quizService.findQuizById(quizId);
    if (!quiz) throw new NotFoundException('Quiz introuvable');

    const questionExists = quiz.questions.some(
      (q) =>
        q.text.trim().toLowerCase() ===
        createQuestionDto.text.trim().toLowerCase(),
    );

    if (questionExists) {
      throw new BadRequestException('Cette question existe déjà dans le quiz.');
    }

    const newQuestion: Question = {
      _id: new Types.ObjectId(),
      text: createQuestionDto.text,
      type: createQuestionDto.type,
      options: [],
      // createQuestionDto.options.map((opt) => ({
      //   _id: new Types.ObjectId(),
      //   text: opt.text,
      //   isCorrect: opt.isCorrect,
      // })),
    };
    quiz.questions.push(newQuestion);

    await quiz.save();

    return {
      message: 'Question ajoutée avec succès',
      question: newQuestion,
    };
  }

  async getQuestionsFromQuiz(quizId: string): Promise<Question[]> {
    const quiz = await this.quizModel
      .findById(quizId)
      .select('questions')
      .exec();

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${quizId} not found`);
    }

    return quiz.questions;
  }

  async findOneQuestion(quizId: string, questionId: string) {
    this.objectIdService.validateObjectId(quizId);
    this.objectIdService.validateObjectId(questionId);

    const quiz = await this.quizService.findQuizById(quizId);

    const question = quiz.questions.find(
      (q: Question) => q._id.toString() === questionId,
    );

    if (!question) {
      throw new NotFoundException(
        `Question avec l'ID ${questionId} non trouvée`,
      );
    }

    return {
      _id: question._id,
      text: question.text,
      type: question.type,
      options: question.options.map((opt) => ({
        _id: opt._id,
        text: opt.text,
        isCorrect: opt.isCorrect,
      })),
    };
  }

  async updateQuestion(
    quizId: string,
    questionId: string,
    updateQuestionDto: UpdateQuestionDto,
  ) {
    this.objectIdService.validateObjectId(quizId);
    this.objectIdService.validateObjectId(questionId);

    const quiz = await this.quizService.findQuizById(quizId);

    const questionIndex = quiz.questions.findIndex(
      (q) => q._id.toString() === questionId,
    );

    if (questionIndex === -1) {
      throw new NotFoundException(
        `Question avec l'ID ${questionId} non trouvée`,
      );
    }

    Object.assign(quiz.questions[questionIndex], updateQuestionDto);

    await quiz.save();

    return {
      message: 'Question mise à jour avec succès',
      question: quiz.questions[questionIndex],
    };
  }

  async removeQuestion(quizId: string, questionId: string) {
    this.objectIdService.validateObjectId(quizId);
    this.objectIdService.validateObjectId(questionId);

    const quiz = await this.quizService.findQuizById(quizId);

    const questionIndex = quiz.questions.findIndex(
      (q) => q._id.toString() === questionId,
    );

    if (questionIndex === -1) {
      throw new NotFoundException(
        `Question avec l'ID ${questionId} non trouvée`,
      );
    }

    quiz.questions.splice(questionIndex, 1);

    await quiz.save();

    return {
      message: 'Question supprimée avec succès',
    };
  }
}

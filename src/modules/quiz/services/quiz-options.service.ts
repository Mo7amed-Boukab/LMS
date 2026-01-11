import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { Model, Types } from 'mongoose';
import { CreateOptionDto } from '../dto/create-quiz.dto';
import { QuizQuestionsService } from './quiz-questions.service';
import { InjectModel } from '@nestjs/mongoose';
import { Option, Question, Quiz } from '../entities/quiz.entity';
import { UpdateOptionDto } from '../dto/update-quiz.dto';

@Injectable()
export class QuizOptionsService {
  constructor(
    @InjectModel('Quiz') private readonly quizModel: Model<Quiz>,
    private readonly quizService: QuizService,
    private readonly quizQuestionsService: QuizQuestionsService,
  ) {}

  async addOption(
    quizId: string,
    questionId: string,
    createOptionDto: CreateOptionDto,
  ) {
    this.quizService.validateObjectId(quizId);
    this.quizService.validateObjectId(questionId);

    const quiz = await this.quizService.findQuizById(quizId);
    const question = await this.quizQuestionsService.findOneQuestion(
      quizId,
      questionId,
    );

    const newOption: Option = {
      _id: new Types.ObjectId(),
      ...createOptionDto,
    };

    question.options.push(newOption);

    await quiz.save();

    const addedOption = question.options[question.options.length - 1];

    return {
      message: 'Option ajoutée avec succès',
      option: {
        _id: addedOption._id,
        text: addedOption.text,
      },
    };
  }

  async findAllOptions(quizId: string, questionId: string) {
    this.quizService.validateObjectId(quizId);
    this.quizService.validateObjectId(questionId);

    const question = await this.quizQuestionsService.findOneQuestion(
      quizId,
      questionId,
    );

    // Retourner les options sans isCorrect
    return question.options.map((opt) => ({
      _id: opt._id,
      text: opt.text,
    }));
  }

  async findOneOption(quizId: string, questionId: string, optionId: string) {
    this.quizService.validateObjectId(quizId);
    this.quizService.validateObjectId(questionId);
    this.quizService.validateObjectId(optionId);

    const question = await this.quizQuestionsService.findOneQuestion(
      quizId,
      questionId,
    );
    const option = this.findOptionInQuestion(question, optionId);

    return {
      _id: option._id,
      text: option.text,
    };
  }

  async updateOption(
    quizId: string,
    questionId: string,
    optionId: string,
    updateOptionDto: UpdateOptionDto,
  ) {
    this.quizService.validateObjectId(quizId);
    this.quizService.validateObjectId(questionId);
    this.quizService.validateObjectId(optionId);

    const quiz = await this.quizService.findQuizById(quizId);
    const question = await this.quizQuestionsService.findOneQuestion(
      quizId,
      questionId,
    );
    const optionIndex = question.options.findIndex(
      (opt) => opt._id.toString() === optionId,
    );

    if (optionIndex === -1) {
      throw new NotFoundException(`Option avec l'ID ${optionId} non trouvée`);
    }

    Object.assign(question.options[optionIndex], updateOptionDto);

    await quiz.save();

    const updatedOption = question.options[optionIndex];

    return {
      message: 'Option mise à jour avec succès',
      option: {
        _id: updatedOption._id,
        text: updatedOption.text,
      },
    };
  }

  async removeOption(quizId: string, questionId: string, optionId: string) {
    this.quizService.validateObjectId(quizId);
    this.quizService.validateObjectId(questionId);
    this.quizService.validateObjectId(optionId);

    const quiz = await this.quizService.findQuizById(quizId);
    const question = await this.quizQuestionsService.findOneQuestion(
      quizId,
      questionId,
    );

    const optionIndex = question.options.findIndex(
      (opt) => opt._id.toString() === optionId,
    );

    if (optionIndex === -1) {
      throw new NotFoundException(`Option avec l'ID ${optionId} non trouvée`);
    }

    // Vérifier qu'il reste au moins 2 options après suppression
    if (question.options.length <= 2) {
      throw new BadRequestException(
        'Une question doit avoir au moins 2 options',
      );
    }

    // Supprimer l'option
    question.options.splice(optionIndex, 1);

    await quiz.save();

    return {
      message: 'Option supprimée avec succès',
    };
  }

  findOptionInQuestion(question: Question, optionId: string) {
    const option = question.options.find(
      (opt) => opt._id.toString() === optionId,
    );

    if (!option) {
      throw new NotFoundException(`Option avec l'ID ${optionId} non trouvée`);
    }

    return option;
  }

  async toggleCorrectOption(
    quizId: string,
    questionId: string,
    optionId: string,
  ) {
    this.quizService.validateObjectId(quizId);
    this.quizService.validateObjectId(questionId);
    this.quizService.validateObjectId(optionId);

    const quiz = await this.quizModel
      .findById(quizId)
      .select('+questions.options.isCorrect')
      .exec();

    if (!quiz) {
      throw new NotFoundException(`Quiz avec l'ID ${quizId} non trouvé`);
    }

    const question = await this.quizQuestionsService.findOneQuestion(
      quizId,
      questionId,
    );
    const option = this.findOptionInQuestion(question, optionId);

    // Toggle isCorrect
    option.isCorrect = !option.isCorrect;

    await quiz.save();

    return {
      message: `Option ${option.isCorrect ? 'marquée' : 'démarquée'} comme correcte`,
      isCorrect: option.isCorrect,
    };
  }
}

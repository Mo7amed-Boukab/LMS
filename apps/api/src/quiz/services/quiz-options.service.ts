import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { CreateOptionDto } from '../dto/create-quiz.dto';
import { QuizQuestionsService } from './quiz-questions.service';
import { InjectModel } from '@nestjs/mongoose';
import { Option, Question, Quiz } from '../schema/quiz.schema';
import { UpdateOptionDto } from '../dto/update-quiz.dto';
import { ObjectIdService } from 'src/common/services/objectId.service';

@Injectable()
export class QuizOptionsService {
  constructor(
    @InjectModel('Quiz') private readonly quizModel: Model<Quiz>,
    private readonly objectIdService: ObjectIdService,
    private readonly quizQuestionsService: QuizQuestionsService,
  ) {}

  async addOption(
    quizId: string,
    questionId: string,
    createOptionDto: CreateOptionDto,
  ) {
    this.objectIdService.validateObjectId(quizId);
    this.objectIdService.validateObjectId(questionId);

    const newOption: Option = {
      _id: new Types.ObjectId(),
      ...createOptionDto,
    };

    const result = await this.quizModel.updateOne(
      {
        _id: quizId,
        'questions._id': questionId,
      },
      {
        $push: {
          'questions.$.options': newOption,
        },
      },
    );
    if (result.modifiedCount === 0) {
      throw new NotFoundException('Quiz ou Question introuvable');
    }

    return {
      message: 'Option ajoutée avec succès',
      newOption,
    };
  }

  async findAllOptions(quizId: string, questionId: string) {
    this.objectIdService.validateObjectId(quizId);
    this.objectIdService.validateObjectId(questionId);

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
    this.objectIdService.validateObjectId(quizId);
    this.objectIdService.validateObjectId(questionId);
    this.objectIdService.validateObjectId(optionId);

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
    this.objectIdService.validateObjectId(quizId);
    this.objectIdService.validateObjectId(questionId);
    this.objectIdService.validateObjectId(optionId);

    const result = await this.quizModel.updateOne(
      {
        _id: quizId,
      },
      {
        $set: {
          'questions.$[q].options.$[o].text': updateOptionDto.text,
        },
      },
      {
        arrayFilters: [{ 'q._id': questionId }, { 'o._id': optionId }],
      },
    );

    if (result.modifiedCount === 0) {
      throw new NotFoundException('Quiz, question ou option introuvable');
    }

    return {
      message: 'Option mise à jour avec succès',
      option: {
        _id: optionId,
        text: updateOptionDto.text,
      },
    };
  }

  async removeOption(quizId: string, questionId: string, optionId: string) {
    this.objectIdService.validateObjectId(quizId);
    this.objectIdService.validateObjectId(questionId);
    this.objectIdService.validateObjectId(optionId);

    // Vérifier le nombre d'options AVANT suppression
    const quiz = await this.quizModel.findOne(
      {
        _id: quizId,
        'questions._id': questionId,
      },
      {
        'questions.$': 1,
      },
    );

    if (!quiz || quiz.questions.length === 0) {
      throw new NotFoundException('Question introuvable');
    }

    const question = quiz.questions[0];

    if (question.options.length <= 2) {
      throw new BadRequestException(
        'Une question doit avoir au moins 2 options',
      );
    }

    const result = await this.quizModel.updateOne(
      {
        _id: quizId,
      },
      {
        $pull: {
          'questions.$[q].options': { _id: optionId },
        },
      },
      {
        arrayFilters: [{ 'q._id': questionId }],
      },
    );

    if (result.modifiedCount === 0) {
      throw new NotFoundException('Option introuvable');
    }

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
    this.objectIdService.validateObjectId(quizId);
    this.objectIdService.validateObjectId(questionId);
    this.objectIdService.validateObjectId(optionId);

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

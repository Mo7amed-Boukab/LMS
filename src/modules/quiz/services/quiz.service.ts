import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuizDto } from '../dto/create-quiz.dto';
import { UpdateQuizDto } from '../dto/update-quiz.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Quiz } from '../entities/quiz.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class QuizService {
  constructor(@InjectModel('Quiz') private readonly quizModel: Model<Quiz>) {}

  async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    try {
      const { title, moduleId } = createQuizDto;

      const existingQuiz = await this.quizModel.findOne({ title, moduleId });

      if (existingQuiz) {
        throw new ConflictException('Ce quiz existe déjà pour ce module');
      }

      const quiz = new this.quizModel(createQuizDto);
      return quiz.save();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      } else {
        throw new InternalServerErrorException('Une erreur est survenue');
      }
    }
  }

  async findAll(): Promise<Quiz[]> {
    return this.quizModel.find().exec();
  }

  async findQuizById(id: string): Promise<Quiz> {
    const quiz = await this.quizModel.findById(id).exec();
    if (!quiz) throw new NotFoundException('quiz not found');
    return quiz;
  }

  async update(id: string, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    const quiz = await this.quizModel.findByIdAndUpdate(id, updateQuizDto, {
      new: true,
    });
    if (!quiz) throw new NotFoundException('quiz not found');
    return quiz;
  }

  async remove(id: string): Promise<void> {
    const result = await this.quizModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('quiz not found');
  }

  validateObjectId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`ID invalide: ${id}`);
    }
  }
}

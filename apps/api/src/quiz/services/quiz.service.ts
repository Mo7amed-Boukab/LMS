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
import { Quiz } from '../schema/quiz.schema';
import { Model } from 'mongoose';
import { QuizStatus } from '../../common/enums/quiz-status.enum';
// import {
//   CourseModule,
//   CourseModuleDocument,
// } from 'src/modules/course-modules/schemas/course-module.schema';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel('Quiz') private readonly quizModel: Model<Quiz>,
    // @InjectModel(CourseModule.name)
    // private moduleModel: Model<CourseModuleDocument>,
  ) {}

  async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    try {
      const { title, moduleId } = createQuizDto;

      const existingQuiz = await this.quizModel.findOne({ title, moduleId });

      if (existingQuiz) {
        throw new ConflictException('This quiz already exists for this module');
      }

      const quiz = new this.quizModel(createQuizDto);
      return quiz.save();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      } else {
        throw new InternalServerErrorException('An error occurred');
      }
    }
  }

  async findAll(): Promise<Quiz[]> {
    return this.quizModel.find().exec();
  }

  async findQuizById(id: string): Promise<Quiz> {
    const quiz = await this.quizModel.findById(id).exec();
    if (!quiz) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  async update(id: string, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    const quiz = await this.quizModel.findByIdAndUpdate(id, updateQuizDto, {
      new: true,
    });
    if (!quiz) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  async remove(id: string): Promise<void> {
    const result = await this.quizModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Quiz not found');
  }

  async publishQuiz(quizId: string) {
    const quiz = await this.quizModel.findById(quizId);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // quiz must contain at least 4 questions
    if (!quiz.questions || quiz.questions.length < 4) {
      throw new BadRequestException(
        'The quiz must contain at least 4 questions',
      );
    }

    // each question must have options
    quiz.questions.forEach((question, index) => {
      if (!question.options || question.options.length < 2) {
        throw new BadRequestException(
          `Question ${index + 1} must contain at least 2 options`,
        );
      }

      // at least one correct answer
      const hasCorrect = question.options.some((opt) => opt.isCorrect);
      if (!hasCorrect) {
        throw new BadRequestException(
          `Question ${index + 1} must have at least one correct answer`,
        );
      }
    });

    quiz.status = QuizStatus.PUBLISHED;
    await quiz.save();

    return {
      message: 'Quiz published successfully',
      quizId: quiz._id,
    };
  }
}

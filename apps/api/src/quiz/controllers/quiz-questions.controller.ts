import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateQuestionDto } from '../dto/create-quiz.dto';
import { QuizQuestionsService } from '../services/quiz-questions.service';
import { UpdateQuestionDto } from '../dto/update-quiz.dto';

@Controller('quizzes/:quizId/questions')
export class QuizQuestionsController {
  constructor(private readonly quizQuestionsService: QuizQuestionsService) {}

  @Post()
  async addQuestion(
    @Param('quizId') quizId: string,
    @Body() createQuestionDto: CreateQuestionDto,
  ) {
    return this.quizQuestionsService.addQuestion(quizId, createQuestionDto);
  }

  @Get()
  async findAllQuestions(@Param('quizId') quizId: string) {
    return this.quizQuestionsService.getQuestionsFromQuiz(quizId);
  }

  @Get(':questionId')
  async findOneQuestion(
    @Param('quizId') quizId: string,
    @Param('questionId') questionId: string,
  ) {
    return this.quizQuestionsService.findOneQuestion(quizId, questionId);
  }

  @Patch(':questionId')
  async updateQuestion(
    @Param('quizId') quizId: string,
    @Param('questionId') questionId: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.quizQuestionsService.updateQuestion(
      quizId,
      questionId,
      updateQuestionDto,
    );
  }

  @Delete(':questionId')
  async removeQuestion(
    @Param('quizId') quizId: string,
    @Param('questionId') questionId: string,
  ) {
    return this.quizQuestionsService.removeQuestion(quizId, questionId);
  }
}

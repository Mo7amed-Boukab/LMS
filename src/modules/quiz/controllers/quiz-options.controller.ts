import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { QuizOptionsService } from '../services/quiz-options.service';
import { CreateOptionDto } from '../dto/create-quiz.dto';
import { UpdateOptionDto } from '../dto/update-quiz.dto';

@Controller('quizzes/:quizId/questions/:questionId/options')
export class QuizOptionsController {
  constructor(private readonly quizOptionsService: QuizOptionsService) {}

  @Post()
  async addOption(
    @Param('quizId') quizId: string,
    @Param('questionId') questionId: string,
    @Body() createOptionDto: CreateOptionDto,
  ) {
    return this.quizOptionsService.addOption(
      quizId,
      questionId,
      createOptionDto,
    );
  }

  @Get()
  async findAllOptions(
    @Param('quizId') quizId: string,
    @Param('questionId') questionId: string,
  ) {
    return this.quizOptionsService.findAllOptions(quizId, questionId);
  }

  @Get(':optionId')
  async findOneOption(
    @Param('quizId') quizId: string,
    @Param('questionId') questionId: string,
    @Param('optionId') optionId: string,
  ) {
    return this.quizOptionsService.findOneOption(quizId, questionId, optionId);
  }

  @Put(':optionId')
  async updateOption(
    @Param('quizId') quizId: string,
    @Param('questionId') questionId: string,
    @Param('optionId') optionId: string,
    @Body() updateOptionDto: UpdateOptionDto,
  ) {
    return this.quizOptionsService.updateOption(
      quizId,
      questionId,
      optionId,
      updateOptionDto,
    );
  }

  @Delete(':optionId')
  async removeOption(
    @Param('quizId') quizId: string,
    @Param('questionId') questionId: string,
    @Param('optionId') optionId: string,
  ) {
    return this.quizOptionsService.removeOption(quizId, questionId, optionId);
  }

  @Patch(':optionId/toggle-correct')
  async toggleCorrectOption(
    @Param('quizId') quizId: string,
    @Param('questionId') questionId: string,
    @Param('optionId') optionId: string,
  ) {
    return this.quizOptionsService.toggleCorrectOption(
      quizId,
      questionId,
      optionId,
    );
  }
}

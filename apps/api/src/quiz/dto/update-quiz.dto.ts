import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizDto } from './create-quiz.dto';
import { IsMongoId, IsOptional } from 'class-validator';
import { CreateOptionDto } from './create-quiz.dto';
import { CreateQuestionDto } from './create-quiz.dto';

export class UpdateOptionDto extends PartialType(CreateOptionDto) {
  @IsOptional()
  @IsMongoId()
  _id?: string;
}

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {
  @IsOptional()
  @IsMongoId()
  _id?: string;
}

export class UpdateQuizDto extends PartialType(CreateQuizDto) {}

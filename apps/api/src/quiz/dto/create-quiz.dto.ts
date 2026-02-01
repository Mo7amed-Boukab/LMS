import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  // ArrayMinSize,
  // IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { QuestionType } from 'src/common/enums/question-type.enum';

export class CreateOptionDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsBoolean()
  @IsNotEmpty()
  isCorrect: boolean;
}

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(QuestionType)
  type: QuestionType;

  @IsArray()
  @ArrayMinSize(2, { message: 'Une question doit avoir au moins 2 options' })
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];
}

export class CreateQuizDto {
  @IsString()
  title: string;

  @IsNumber()
  passingScore: number;

  @IsOptional()
  @IsNumber()
  timeLimit?: number;

  @IsOptional()
  @IsBoolean()
  shuffleQuestions?: boolean;

  @IsOptional()
  @IsBoolean()
  showResultsImmediately?: boolean;

  @IsMongoId()
  moduleId: string;
}

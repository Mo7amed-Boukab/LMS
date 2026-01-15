import {
  // ArrayMinSize,
  // IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  // ValidateNested,
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

  // @IsArray()
  // @ArrayMinSize(2)
  // @ValidateNested({ each: true })
  // @Type(() => CreateOptionDto)
  // options: CreateOptionDto[];
}

export class CreateQuizDto {
  @IsString()
  title: string;

  @IsNumber()
  passingScore: number;

  // @IsArray()
  // @ArrayMinSize(1)
  // @ValidateNested({ each: true })
  // @Type(() => CreateQuestionDto)
  // questions: CreateQuestionDto[];

  @IsMongoId()
  moduleId: string;
}

import { IsArray, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuizDto, CreateQuestionDto } from './create-quiz.dto';

export class CreateCompleteQuizDto extends CreateQuizDto {
  @IsArray()
  @ArrayMinSize(4, { message: 'Le quiz doit contenir au moins 4 questions' })
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}

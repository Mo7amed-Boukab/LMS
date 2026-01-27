import { IsMongoId, IsNotEmpty } from 'class-validator';

export class AnswerDto {
  @IsNotEmpty()
  @IsMongoId()
  questionId: string;

  @IsNotEmpty()
  @IsMongoId()
  selectedOptionId: string;
}

import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  IsBoolean,
  IsMongoId,
} from 'class-validator';
import { LessonContentType } from '../schemas/course-lesson.schema';

export class CreateCourseLessonDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsMongoId()
  @IsNotEmpty()
  moduleId: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  order?: number;

  @IsEnum(LessonContentType)
  @IsNotEmpty()
  type: LessonContentType;

  @IsString()
  @IsNotEmpty()
  contentUrl: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isPreview?: boolean;

  @IsOptional()
  metadata?: Record<string, any>;
}

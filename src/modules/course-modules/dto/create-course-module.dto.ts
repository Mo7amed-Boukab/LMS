import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MaxLength, Min, IsBoolean, IsMongoId } from 'class-validator';
import { ModuleContentType } from '../schemas/course-module.schema';

export class CreateCourseModuleDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    title: string;

    @IsString()
    @IsOptional()
    @MaxLength(1000)
    description?: string;

    @IsMongoId()
    @IsNotEmpty()
    courseId: string;

    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    order: number;

    @IsEnum(ModuleContentType)
    @IsNotEmpty()
    type: ModuleContentType;

    @IsString()
    @IsNotEmpty()
    contentUrl: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsOptional()
    metadata?: Record<string, any>;
}

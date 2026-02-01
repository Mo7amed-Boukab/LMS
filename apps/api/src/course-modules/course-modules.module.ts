import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from 'src/courses/schemas/course.schema';
import { QuizModule } from 'src/quiz/quiz.module';
import { CourseModulesController } from './course-modules.controller';
import { CourseModulesService } from './course-modules.service';
import {
  Module as CourseModuleEntity,
  CourseModuleSchema,
} from './schemas/course-module.schema';

@Module({
  imports: [
    QuizModule,
    MongooseModule.forFeature([
      {
        name: CourseModuleEntity.name,
        schema: CourseModuleSchema,
      },
      {
        name: Course.name,
        schema: CourseSchema,
      },
    ]),
  ],
  controllers: [CourseModulesController],
  providers: [CourseModulesService],
  exports: [CourseModulesService, MongooseModule],
})
export class CourseModulesModule {}

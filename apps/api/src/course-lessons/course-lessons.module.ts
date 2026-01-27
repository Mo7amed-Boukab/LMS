import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseLessonsService } from './course-lessons.service';
import { CourseLessonsController } from './course-lessons.controller';
import {
  CourseLesson,
  CourseLessonSchema,
} from './schemas/course-lesson.schema';
import {
  Module as CourseModuleEntity,
  CourseModuleSchema as CourseModuleSchemaDefinition,
} from '../course-modules/schemas/course-module.schema';
import { Course, CourseSchema } from '../courses/schemas/course.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CourseLesson.name, schema: CourseLessonSchema },
      { name: CourseModuleEntity.name, schema: CourseModuleSchemaDefinition },
      { name: Course.name, schema: CourseSchema },
    ]),
  ],
  controllers: [CourseLessonsController],
  providers: [CourseLessonsService],
  exports: [CourseLessonsService],
})
export class CourseLessonsModule {}

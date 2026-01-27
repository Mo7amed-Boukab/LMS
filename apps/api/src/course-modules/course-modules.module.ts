import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseModulesController } from './course-modules.controller';
import { CourseModulesService } from './course-modules.service';
import {
  Module as CourseModuleEntity,
  CourseModuleSchema,
} from './schemas/course-module.schema';
import { Course, CourseSchema } from 'src/courses/schemas/course.schema';

@Module({
  imports: [
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
  exports: [CourseModulesService],
})
export class CourseModulesModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseModulesController } from './course-modules.controller';
import { CourseModulesService } from './course-modules.service';
import {CourseModule, CourseModuleSchema} from './schemas/course-module.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CourseModule.name,
        schema: CourseModuleSchema,
      },
    ]),
  ],
  controllers: [CourseModulesController],
  providers: [CourseModulesService],
  exports: [CourseModulesService],
})
export class CourseModulesModule {}

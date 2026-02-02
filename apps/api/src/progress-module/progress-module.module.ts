import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgressModuleController } from './progress-module.controller';
import { ProgressModuleService } from './progress-module.service';
import { ProgressSchema } from './schema/progress-module.schema';
// import { CoursesModule } from 'src/courses/courses.module';
import { CourseLessonSchema } from 'src/course-lessons/schemas/course-lesson.schema';
import { CourseModulesModule } from 'src/course-modules/course-modules.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Progress', schema: ProgressSchema },
      { name: 'CourseLesson', schema: CourseLessonSchema },
    ]),
    // CoursesModule,
    CourseModulesModule,
  ],
  controllers: [ProgressModuleController],
  providers: [ProgressModuleService],
  exports: [ProgressModuleService],
})
export class ProgressModuleModule {}

import { Module } from '@nestjs/common';
import { ProgressModuleService } from './progress-module.service';
import { ProgressModuleController } from './progress-module.controller';
import { ProgressSchema } from './schema/progress-module.schema';
import { MongooseModule } from '@nestjs/mongoose';
// import { CoursesModule } from 'src/courses/courses.module';
import { CourseModulesModule } from 'src/course-modules/course-modules.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Progress', schema: ProgressSchema }]),
    // CoursesModule,
    CourseModulesModule,
  ],
  controllers: [ProgressModuleController],
  providers: [ProgressModuleService],
  exports: [ProgressModuleService],
})
export class ProgressModuleModule {}

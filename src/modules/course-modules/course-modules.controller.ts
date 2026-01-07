import { Controller, Get, Param } from '@nestjs/common';
import { CourseModulesService } from './course-modules.service';
import { CourseModule } from './schemas/course-module.schema';

@Controller('course-modules')
export class CourseModulesController {
  constructor(private readonly courseModulesService: CourseModulesService) { }

  @Get('course/:courseId')
  async getCourseModules(
    @Param('courseId') courseId: string,
  ): Promise<CourseModule[]> {
    return this.courseModulesService.getModulesByCourse(courseId);
  }
}

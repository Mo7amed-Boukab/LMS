import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CourseModulesService } from './course-modules.service';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';
import { CourseModule } from './schemas/course-module.schema';

@Controller('course-modules')
export class CourseModulesController {
  constructor(private readonly courseModulesService: CourseModulesService) { }

  @Post()
  create(@Body() createDto: CreateCourseModuleDto) {
    return this.courseModulesService.create(createDto);
  }

  @Get('course/:courseId')
  async getCourseModules(
    @Param('courseId') courseId: string,
  ): Promise<CourseModule[]> {
    return this.courseModulesService.getModulesByCourse(courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseModulesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateCourseModuleDto) {
    return this.courseModulesService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseModulesService.remove(id);
  }
}

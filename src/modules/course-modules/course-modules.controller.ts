import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { CourseModulesService } from './course-modules.service';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';
import { CourseModule } from './schemas/course-module.schema';

@Controller('course-modules')
export class CourseModulesController {
  constructor(private readonly courseModulesService: CourseModulesService) { }

  @Post()
  create(@Body() createDto: CreateCourseModuleDto, @Req() req: any) {
    return this.courseModulesService.create(createDto, req.user?._id);
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
  update(@Param('id') id: string, @Body() updateDto: UpdateCourseModuleDto, @Req() req: any) {
    return this.courseModulesService.update(id, updateDto, req.user?._id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.courseModulesService.remove(id, req.user?._id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';

import { CourseModulesService } from './course-modules.service';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';
import { CourseModule } from './schemas/course-module.schema';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('course-modules')
@UseGuards(JwtAuthGuard)
export class CourseModulesController {
  constructor(
    private readonly courseModulesService: CourseModulesService,
  ) { }

  /* -------------------------------------------------------------------------- */
  /*                               CREATE MODULE                                  */
  /* -------------------------------------------------------------------------- */
  @Post()
  create(@Body() createDto: CreateCourseModuleDto, @Req() req: any): Promise<CourseModule> {
    return this.courseModulesService.create(createDto, req.user._id);
  }

  /* -------------------------------------------------------------------------- */
  /*                          GET MODULES BY COURSE                                */
  /* -------------------------------------------------------------------------- */
  @Get('course/:courseId')
  getCourseModules(@Param('courseId') courseId: string): Promise<CourseModule[]> {
    return this.courseModulesService.getModulesByCourse(courseId);
  }

  /* -------------------------------------------------------------------------- */
  /*                               GET ONE MODULE                                  */
  /* -------------------------------------------------------------------------- */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<CourseModule> {
    return this.courseModulesService.findOne(id);
  }

  /* -------------------------------------------------------------------------- */
  /*                               UPDATE MODULE                                   */
  /* -------------------------------------------------------------------------- */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateCourseModuleDto, @Req() req: any): Promise<CourseModule> {
    return this.courseModulesService.update(id, updateDto, req.user._id);
  }

  /* -------------------------------------------------------------------------- */
  /*                             REORDER MODULES                                  */
  /* -------------------------------------------------------------------------- */
  @Patch('course/:courseId/reorder')
  async reorder(@Param('courseId') courseId: string, @Body() moduleIds: string[]): Promise<{ message: string }> {
    await this.courseModulesService.reorderModules(courseId, moduleIds);
    return { message: 'Modules reordered successfully' };
  }

  /* -------------------------------------------------------------------------- */
  /*                               DELETE MODULE                                   */
  /* -------------------------------------------------------------------------- */
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any): Promise<{ message: string }> {
    await this.courseModulesService.remove(id, req.user._id);
    return { message: 'Module deleted successfully' };
  }
}

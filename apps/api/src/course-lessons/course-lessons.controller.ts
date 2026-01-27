import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CourseLessonsService } from './course-lessons.service';
import { CreateCourseLessonDto } from './dto/create-course-lesson.dto';
import { UpdateCourseLessonDto } from './dto/update-course-lesson.dto';
import { CourseLesson } from './schemas/course-lesson.schema';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/common/interfaces/request-with-user.interface';

@Controller('course-lessons')
@UseGuards(JwtAuthGuard)
export class CourseLessonsController {
  constructor(private readonly courseLessonsService: CourseLessonsService) {}

  /* -------------------------------------------------------------------------- */
  /*                               CREATE LESSON                                  */
  /* -------------------------------------------------------------------------- */
  @Post()
  create(
    @Body() createDto: CreateCourseLessonDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<CourseLesson> {
    return this.courseLessonsService.create(createDto, req.user.userId);
  }

  /* -------------------------------------------------------------------------- */
  /*                          GET LESSONS BY MODULE                                */
  /* -------------------------------------------------------------------------- */
  @Get('module/:moduleId')
  getLessonsByModule(
    @Param('moduleId') moduleId: string,
  ): Promise<CourseLesson[]> {
    return this.courseLessonsService.getLessonsByModule(moduleId);
  }

  /* -------------------------------------------------------------------------- */
  /*                               GET ONE LESSON                                  */
  /* -------------------------------------------------------------------------- */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<CourseLesson> {
    return this.courseLessonsService.findOne(id);
  }

  /* -------------------------------------------------------------------------- */
  /*                               UPDATE LESSON                                   */
  /* -------------------------------------------------------------------------- */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCourseLessonDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<CourseLesson> {
    return this.courseLessonsService.update(id, updateDto, req.user.userId);
  }

  /* -------------------------------------------------------------------------- */
  /*                             REORDER LESSONS                                  */
  /* -------------------------------------------------------------------------- */
  @Patch('module/:moduleId/reorder')
  async reorder(
    @Param('moduleId') moduleId: string,
    @Body() lessonIds: string[],
  ): Promise<{ message: string }> {
    await this.courseLessonsService.reorderLessons(moduleId, lessonIds);
    return { message: 'Lessons reordered successfully' };
  }

  /* -------------------------------------------------------------------------- */
  /*                               DELETE LESSON                                   */
  /* -------------------------------------------------------------------------- */
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ message: string }> {
    await this.courseLessonsService.remove(id, req.user.userId);
    return { message: 'Lesson deleted successfully' };
  }
}

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

@Controller('course-lessons')
@UseGuards(JwtAuthGuard)
export class CourseLessonsController {
    constructor(private readonly courseLessonsService: CourseLessonsService) { }

    /* -------------------------------------------------------------------------- */
    /*                               CREATE LESSON                                  */
    /* -------------------------------------------------------------------------- */
    @Post()
    create(
        @Body() createDto: CreateCourseLessonDto,
        @Req() req: any,
    ): Promise<CourseLesson> {
        return this.courseLessonsService.create(createDto, req.user._id);
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
        @Req() req: any,
    ): Promise<CourseLesson> {
        return this.courseLessonsService.update(id, updateDto, req.user._id);
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
        @Req() req: any,
    ): Promise<{ message: string }> {
        await this.courseLessonsService.remove(id, req.user._id);
        return { message: 'Lesson deleted successfully' };
    }
}

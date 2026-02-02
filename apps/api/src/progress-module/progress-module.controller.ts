import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ProgressModuleService } from './progress-module.service';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressModuleController {
  constructor(private readonly progressModuleService: ProgressModuleService) {}

  @Get(':courseId')
  async getCourseProgress(
    @CurrentUser() user: any,
    @Param('courseId') courseId: string,
  ) {
    return this.progressModuleService.getCourseProgress(user.userId, courseId);
  }

  @Post(':lessonId/toggle')
  async toggleLessonCompletion(
    @CurrentUser() user: any,
    @Param('lessonId') lessonId: string,
  ) {
    return this.progressModuleService.toggleLessonCompletion(
      user.userId,
      lessonId,
    );
  }
}

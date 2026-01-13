import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import type { AuthenticatedRequest } from 'src/common/interfaces/request-with-user.interface';

@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Formateur)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  create(
    @Body() createCourseDto: CreateCourseDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.coursesService.create(createCourseDto, req.user.userId);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.coursesService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.coursesService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.coursesService.update(id, updateCourseDto, req.user.userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    await this.coursesService.remove(id, req.user.userId);
    return { message: 'Course deleted successfully' };
  }
}

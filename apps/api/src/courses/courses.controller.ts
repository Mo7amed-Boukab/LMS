import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import type { AuthenticatedRequest } from 'src/common/interfaces/request-with-user.interface';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // Public endpoints (no authentication required)
  @Get('public')
  findAllPublic(
    @Query('category') category?: string,
    @Query('level') level?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.coursesService.findAllPublic({
      category,
      level,
      search,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('public/categories')
  getCategoriesWithCounts() {
    return this.coursesService.getCategoriesWithCounts();
  }

  @Get('public/:id')
  findOnePublic(@Param('id') id: string) {
    return this.coursesService.findOnePublic(id);
  }

  // Protected endpoints (instructor only)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Formateur)
  create(
    @Body() createCourseDto: CreateCourseDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.coursesService.create(createCourseDto, req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Formateur)
  findAll(@Req() req: AuthenticatedRequest) {
    return this.coursesService.findAll(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Formateur)
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.coursesService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Formateur)
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.coursesService.update(id, updateCourseDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Formateur)
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    await this.coursesService.remove(id, req.user.userId);
    return { message: 'Course deleted successfully' };
  }
}

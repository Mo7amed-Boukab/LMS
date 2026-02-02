import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { CourseLessonsModule } from './course-lessons/course-lessons.module';
import { CourseModulesModule } from './course-modules/course-modules.module';
import { CoursesModule } from './courses/courses.module';
import { DatabaseModule } from './database/database.module';
import { EnrollmentModule } from './enrollments/enrollment.module';
import { ProgressModuleModule } from './progress-module/progress-module.module';
import { QuizAttempModule } from './quiz-attempt/quiz-attempt.module';
import { QuizModule } from './quiz/quiz.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    //ConfigModule
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    //Connexion MongoDB
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    DatabaseModule,
    AuthModule,
    QuizModule,
    CoursesModule,
    CourseModulesModule,
    CourseLessonsModule,
    UploadsModule,
    CommonModule,
    QuizAttempModule,
    ProgressModuleModule,
    EnrollmentModule,
  ],
})
export class AppModule {}

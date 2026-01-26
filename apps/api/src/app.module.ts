import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { QuizModule } from './quiz/quiz.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { CoursesModule } from './courses/courses.module';
import { CourseModulesModule } from './course-modules/course-modules.module';
import { CourseLessonsModule } from './course-lessons/course-lessons.module';
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
  ],
})
export class AppModule { }

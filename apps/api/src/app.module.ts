import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { QuizModule } from './quiz/quiz.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CourseModule } from './course-modules/schemas/course-module.schema';
import { CommonModule } from './common/common.module';
import { QuizAttempModule } from './quiz-attempt/quiz-attempt.module';

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
    CourseModule,
    CommonModule,
    QuizAttempModule,
  ],
})
export class AppModule {}

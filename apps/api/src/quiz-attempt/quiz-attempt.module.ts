import { Module } from '@nestjs/common';
import { QuizAttemptController } from './quiz-attempt.controller';
import { QuizAttemptService } from './quiz-attempt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizAttemptSchema } from './schema/quiz-attempt.schema';
import { QuizModule } from 'src/quiz/quiz.module';
import { ProgressModuleModule } from 'src/progress-module/progress-module.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'QuizAttempt', schema: QuizAttemptSchema },
    ]),
    QuizModule,
    ProgressModuleModule,
  ],
  controllers: [QuizAttemptController],
  providers: [QuizAttemptService],
})
export class QuizAttempModule {}

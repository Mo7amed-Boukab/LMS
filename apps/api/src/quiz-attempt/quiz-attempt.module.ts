import { Module } from '@nestjs/common';
import { QuizAttemptController } from './quiz-attempt.controller';
import { QuizAttemptService } from './quiz-attempt.service';

@Module({
  controllers: [QuizAttemptController],
  providers: [QuizAttemptService],
})
export class QuizAttempModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizAttemptController } from './quiz-attempt.controller';
import { QuizAttemptService } from './quiz-attempt.service';
import {
  QuizAttempt,
  QuizAttemptSchema,
} from './schema/quiz-attempt.schema';
import { Quiz, QuizSchema } from 'src/quiz/schema/quiz.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuizAttempt.name, schema: QuizAttemptSchema },
      { name: Quiz.name, schema: QuizSchema },
    ]),
  ],
  controllers: [QuizAttemptController],
  providers: [QuizAttemptService],
})
export class QuizAttempModule {}

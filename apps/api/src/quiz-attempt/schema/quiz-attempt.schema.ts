import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Sous-document : réponse à une question
@Schema({ _id: false })
export class StudentAnswer {
  @Prop({ type: Types.ObjectId, required: true })
  questionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  selectedOptionId: Types.ObjectId;

  @Prop({ required: true })
  isCorrect: boolean;
}

export const StudentAnswerSchema = SchemaFactory.createForClass(StudentAnswer);

//tentative de quiz
@Schema({ timestamps: true })
export class QuizAttempt extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Quiz', required: true })
  quizId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  studentId: Types.ObjectId;

  @Prop({ type: [StudentAnswerSchema], required: true })
  answers: StudentAnswer[];

  @Prop({ required: true })
  passed: boolean;

  @Prop({ required: true, min: 0, max: 100 })
  score: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export const QuizAttemptSchema = SchemaFactory.createForClass(QuizAttempt);

QuizAttemptSchema.index({ studentId: 1, quizId: 1 });
QuizAttemptSchema.index({ quizId: 1, passed: 1 });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// schema du options
@Schema({ _id: true })
export class Option {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true, default: false, select: false })
  isCorrect: boolean;
}
export const OptionSchema = SchemaFactory.createForClass(Option);

// schema du questions
export enum QuestionType {
  QCM = 'QCM',
  BOOLEAN = 'boolean',
  MULTIPLE = 'multiple',
}

@Schema({ _id: true })
export class Question {
  @Prop({ required: true })
  text: string;

  @Prop({ enum: QuestionType, default: QuestionType.QCM })
  type: QuestionType;

  @Prop({ type: [OptionSchema], required: true })
  options: Option[];
}
export const QuestionSchema = SchemaFactory.createForClass(Question);

// schema du quiz
@Schema({ timestamps: true })
export class Quiz extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Module' })
  moduleId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, min: 0, max: 100 })
  passingScore: number;

  @Prop({ type: [QuestionSchema], default: [] })
  questions: Question[];
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);

QuizSchema.index({ title: 1, moduleId: 1 }, { unique: true });

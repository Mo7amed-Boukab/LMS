import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
export class ModuleProgress {
  @Prop({ type: Types.ObjectId, required: true })
  moduleId: Types.ObjectId;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ default: false })
  isUnlocked: boolean;
}

export const ModuleProgressSchema =
  SchemaFactory.createForClass(ModuleProgress);

// Document principal simplifié
@Schema({ timestamps: true })
export class Progress extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  studentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ type: [ModuleProgressSchema], default: [] })
  modules: ModuleProgress[];

  @Prop({
    type: [{ lessonId: Types.ObjectId, completedAt: Date }],
    default: [],
  })
  lessonsProgress: { lessonId: Types.ObjectId; completedAt: Date }[];

  @Prop({ default: Date.now })
  lastAccessedAt: Date;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);

ProgressSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

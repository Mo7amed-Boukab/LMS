import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { CourseStatus } from 'src/common/enums/course.enum';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true, trim: true, maxlength: 200 })
  title: string;

  @Prop({ trim: true, maxlength: 1000 })
  description: string;

  @Prop({ required: true, enum: CourseStatus, default: CourseStatus.Draft })
  status: CourseStatus;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true,
  })
  instructorId: Types.ObjectId;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

CourseSchema.index({ title: 1, instructorId: 1 }, { unique: true });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type CourseModuleDocument = HydratedDocument<Module>;

/**
 * Module représente une SECTION du cours
 * Chaque section contient plusieurs CourseLesson
 */
@Schema({ timestamps: true, collection: 'coursemodules' })
export class Module {
  @Prop({ required: true, trim: true, maxlength: 200 })
  title: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Course',
    required: true,
    index: true,
  })
  courseId: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  order: number;

  @Prop({ default: true })
  isActive: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const CourseModuleSchema = SchemaFactory.createForClass(Module);

/**
 * Index composé pour optimiser les requêtes :
 * - Récupération des modules d'un cours triés par ordre
 */
CourseModuleSchema.index({ courseId: 1, order: 1 });

/**
 * Index pour rechercher rapidement les modules actifs
 */
CourseModuleSchema.index({ isActive: 1 });

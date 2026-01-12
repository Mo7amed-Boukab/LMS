import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export enum ModuleContentType {
  PDF = 'PDF',
  VIDEO = 'VIDEO',
}

export type CourseModuleDocument = HydratedDocument<CourseModule>;

@Schema({ timestamps: true })
export class CourseModule {
  @Prop({ required: true, trim: true, maxlength: 200 })
  title: string;

  @Prop({ trim: true, maxlength: 1000 })
  description: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Course',
    required: true,
    index: true,
  })
  courseId: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  order: number;

  @Prop({ required: true, enum: ModuleContentType })
  type: ModuleContentType;

  @Prop({ required: true })
  contentUrl: string;

  @Prop({ default: true })
  isActive: boolean;

  /**
   * Métadonnées extensibles pour stocker des informations supplémentaires
   * comme : durée de la vidéo, nombre de pages du PDF, taille du fichier, etc.
   */
  /**
   * @example
   * {
   *   duration: 120,
   *   pages: 100,
   *   size: 1024
   * }
   */
  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  createdAt?: Date;
  updatedAt?: Date;
}

export const CourseModuleSchema = SchemaFactory.createForClass(CourseModule);

/**
 * Index composé pour optimiser les requêtes :
 * - Récupération des modules d'un cours triés par ordre
 */
CourseModuleSchema.index({ courseId: 1, order: 1 });

/**
 * Index pour rechercher rapidement les modules actifs
 */
CourseModuleSchema.index({ isActive: 1 });

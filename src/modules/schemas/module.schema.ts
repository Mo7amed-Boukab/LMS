import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum ModuleContentType {
    PDF = 'PDF',
    VIDEO = 'VIDEO',
}

@Schema({ timestamps: true })
export class Module extends Document {
    @Prop({ required: true, trim: true })
    title: string;

    @Prop({ trim: true })
    description: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course', required: true })
    courseId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true, min: 0 })
    order: number;

    @Prop({ required: true, enum: ModuleContentType })
    type: ModuleContentType;

    @Prop({ required: true })
    contentUrl: string;

    @Prop({ default: true })
    isActive: boolean;

    // Champ pour future extensibilité (ex: durée vidéo, nbre pages PDF, etc.)
    @Prop({ type: Object, default: {} })
    metadata: Record<string, any>;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);

// Index pour optimiser la récupération des modules d'un cours triés par ordre
ModuleSchema.index({ courseId: 1, order: 1 });

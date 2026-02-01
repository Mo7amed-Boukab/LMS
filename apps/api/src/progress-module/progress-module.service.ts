import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Progress } from './schema/progress-module.schema';
import {
  CourseModuleDocument,
  Module,
} from 'src/course-modules/schemas/course-module.schema';

@Injectable()
export class ProgressModuleService {
  constructor(
    @InjectModel(Progress.name) private progressModel: Model<Progress>,
    @InjectModel(Module.name)
    private moduleModel: Model<CourseModuleDocument>,
  ) {}

  /**
   * 1️ Initialiser la progression (à l'inscription)
   */
  async initializeCourseProgress(studentId: string, courseId: string) {
    // Vérifier si existe déjà
    const existing = await this.progressModel.findOne({
      studentId: new Types.ObjectId(studentId),
      courseId: new Types.ObjectId(courseId),
    });

    if (existing) return existing;

    // Récupérer les modules du cours (triés par ordre)
    const modules = await this.moduleModel
      .find({ courseId: new Types.ObjectId(courseId) })
      .sort({ order: 1 })
      .select('_id')
      .lean();

    // Créer la progression
    const moduleProgress = modules.map((module, index) => ({
      moduleId: module._id,
      isCompleted: false,
      isUnlocked: index === 0, // Seul le 1er module déverrouillé
    }));

    return await this.progressModel.create({
      studentId: new Types.ObjectId(studentId),
      courseId: new Types.ObjectId(courseId),
      modules: moduleProgress,
    });
  }

  /**
   * 2️ Vérifier si un module est accessible
   */
  async canAccessModule(studentId: string, moduleId: string): Promise<boolean> {
    const module = await this.moduleModel.findById(moduleId).select('courseId');
    if (!module) throw new NotFoundException('Module not found');

    const progress = await this.progressModel.findOne({
      studentId: new Types.ObjectId(studentId),
      courseId: module.courseId,
    });

    if (!progress) return false;

    const moduleProgress = progress.modules.find(
      (m) => m.moduleId.toString() === moduleId,
    );

    return moduleProgress?.isUnlocked || false;
  }

  /**
   * 3 Marquer un module comme terminé (appelé après quiz réussi)
   */
  async completeModule(studentId: string, moduleId: string) {
    const module = await this.moduleModel.findById(moduleId).select('courseId');
    if (!module) throw new NotFoundException('Module not found');

    const progress = await this.progressModel.findOne({
      studentId: new Types.ObjectId(studentId),
      courseId: module.courseId,
    });

    if (!progress) throw new NotFoundException('Progress not found');

    // Trouver l'index du module
    const currentIndex = progress.modules.findIndex(
      (m) => m.moduleId.toString() === moduleId,
    );

    if (currentIndex === -1) {
      throw new NotFoundException('Module not found in progress');
    }

    // Marquer comme complété
    progress.modules[currentIndex].isCompleted = true;

    // Déverrouiller le suivant
    if (currentIndex + 1 < progress.modules.length) {
      progress.modules[currentIndex + 1].isUnlocked = true;
    }

    await progress.save();

    return {
      message: 'Module completed',
      nextModuleUnlocked: currentIndex + 1 < progress.modules.length,
    };
  }

  /**
   * 4 Obtenir la progression d'un cours
   */
  async getCourseProgress(studentId: string, courseId: string) {
    const progress = await this.progressModel
      .findOne({
        studentId: new Types.ObjectId(studentId),
        courseId: new Types.ObjectId(courseId),
      })
      .lean();

    if (!progress) throw new NotFoundException('Progress not found');

    // Récupérer les infos des modules
    const moduleIds = progress.modules.map((m) => m.moduleId);
    const modules = await this.moduleModel
      .find({ _id: { $in: moduleIds } })
      .select('_id title order')
      .sort({ order: 1 })
      .lean();

    // Enrichir avec les détails
    const enrichedModules = progress.modules.map((mp) => {
      const moduleInfo = modules.find(
        (m) => m._id.toString() === mp.moduleId.toString(),
      );
      return {
        moduleId: mp.moduleId,
        title: moduleInfo?.title,
        order: moduleInfo?.order,
        isCompleted: mp.isCompleted,
        isUnlocked: mp.isUnlocked,
      };
    });

    // Calculer la progression à la volée
    const completedCount = progress.modules.filter((m) => m.isCompleted).length;
    const overallProgress = Math.round(
      (completedCount / progress.modules.length) * 100,
    );

    return {
      courseId: progress.courseId,
      overallProgress, // Calculé dynamiquement
      modules: enrichedModules,
      completedModules: completedCount,
      totalModules: progress.modules.length,
    };
  }

  /**
   * 5️ Prochain module à faire
   */
  async getNextModule(studentId: string, courseId: string) {
    const progress = await this.progressModel.findOne({
      studentId: new Types.ObjectId(studentId),
      courseId: new Types.ObjectId(courseId),
    });

    if (!progress) throw new NotFoundException('Progress not found');

    // Trouver le premier module déverrouillé et non complété
    const nextModuleProgress = progress.modules.find(
      (m) => m.isUnlocked && !m.isCompleted,
    );

    if (!nextModuleProgress) {
      return { message: 'Course completed!', allCompleted: true };
    }

    const module = await this.moduleModel
      .findById(nextModuleProgress.moduleId)
      .select('_id title order')
      .lean();

    return { nextModule: module };
  }
}

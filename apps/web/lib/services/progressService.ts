import { apiClient } from "../api-client";

export interface ModuleProgress {
  moduleId: string;
  title?: string;
  order?: number;
  isCompleted: boolean;
  isUnlocked: boolean;
}

export interface CourseProgress {
  courseId: string;
  overallProgress: number;
  modules: ModuleProgress[];
  completedModules: number;
  totalModules: number;
  completedLessons: string[];
}

export const progressApi = {
  getCourseProgress: async (courseId: string): Promise<CourseProgress> => {
    return apiClient.get<CourseProgress>(`/progress/${courseId}`);
  },

  toggleLesson: async (lessonId: string): Promise<{ isCompleted: boolean }> => {
    return apiClient.post<{ isCompleted: boolean }>(`/progress/${lessonId}/toggle`);
  },
};

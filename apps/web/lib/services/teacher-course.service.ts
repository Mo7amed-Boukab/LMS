import { apiClient } from "../api-client";

export interface Course {
  _id: string;
  title: string;
  description?: string;
  category: string;
  level: string;
  thumbnail?: string;
  promotionalVideo?: string;
  price?: number;
  isPublicVisible?: boolean;
  hasCertificate?: boolean;
  status: "draft" | "published" | "archived";
  instructorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseModule {
  _id: string;
  title: string;
  courseId: string;
  order: number;
  isActive: boolean;
  lessons?: CourseLesson[];
}

export interface CourseLesson {
  _id: string;
  title: string;
  moduleId: string;
  order: number;
  type: "VIDEO" | "PDF";
  contentUrl: string;
  isActive: boolean;
  isPreview: boolean;
  metadata?: Record<string, any>;
}

export const teacherCourseService = {
  // --- Courses ---
  createCourse: async (data: Partial<Course>): Promise<Course> => {
    return apiClient.post<Course>("/courses", data);
  },

  getAllCourses: async (): Promise<Course[]> => {
    return apiClient.get<Course[]>("/courses");
  },

  getCourse: async (id: string): Promise<Course> => {
    return apiClient.get<Course>(`/courses/${id}`);
  },

  updateCourse: async (id: string, data: Partial<Course>): Promise<Course> => {
    return apiClient.request<Course>(`/courses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteCourse: async (id: string): Promise<void> => {
    return apiClient.request<void>(`/courses/${id}`, {
      method: "DELETE",
    });
  },

  // --- Modules ---
  createModule: async (data: Partial<CourseModule>): Promise<CourseModule> => {
    return apiClient.post<CourseModule>("/course-modules", data);
  },

  getModulesByCourse: async (courseId: string): Promise<CourseModule[]> => {
    return apiClient.get<CourseModule[]>(`/course-modules/course/${courseId}`);
  },

  updateModule: async (
    id: string,
    data: Partial<CourseModule>
  ): Promise<CourseModule> => {
    return apiClient.request<CourseModule>(`/course-modules/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteModule: async (id: string): Promise<void> => {
    return apiClient.request<void>(`/course-modules/${id}`, {
      method: "DELETE",
    });
  },

  reorderModules: async (
    courseId: string,
    moduleIds: string[]
  ): Promise<void> => {
    return apiClient.request<void>(
      `/course-modules/course/${courseId}/reorder`,
      {
        method: "PATCH",
        body: JSON.stringify(moduleIds),
      }
    );
  },

  // --- Lessons ---
  createLesson: async (data: Partial<CourseLesson>): Promise<CourseLesson> => {
    return apiClient.post<CourseLesson>("/course-lessons", data);
  },

  getLessonsByModule: async (moduleId: string): Promise<CourseLesson[]> => {
    return apiClient.get<CourseLesson[]>(`/course-lessons/module/${moduleId}`);
  },

  updateLesson: async (
    id: string,
    data: Partial<CourseLesson>
  ): Promise<CourseLesson> => {
    return apiClient.request<CourseLesson>(`/course-lessons/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteLesson: async (id: string): Promise<void> => {
    return apiClient.request<void>(`/course-lessons/${id}`, {
      method: "DELETE",
    });
  },

  reorderLessons: async (
    moduleId: string,
    lessonIds: string[]
  ): Promise<void> => {
    return apiClient.request<void>(
      `/course-lessons/module/${moduleId}/reorder`,
      {
        method: "PATCH",
        body: JSON.stringify(lessonIds),
      }
    );
  },

  // --- Uploads ---
  uploadFile: async (
    file: File,
    type: "video" | "image" | "pdf"
  ): Promise<{ url: string; originalName: string; size: number }> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/uploads/${type}`,
      {
        method: "POST",
        body: formData,
        credentials: "include",
      }
    );

    if (!response.ok) {
      let errorMessage = "Upload failed";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = await response.text();
      }
      console.error("Upload Error:", response.status, errorMessage);
      throw new Error(
        errorMessage || `Upload failed with status ${response.status}`
      );
    }

    return response.json();
  },
};

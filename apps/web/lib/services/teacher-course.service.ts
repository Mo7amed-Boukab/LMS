
import { apiClient } from '../api-client';
import { tokenStorage } from '../token-storage';

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
    status: 'draft' | 'published' | 'archived';
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
    type: 'VIDEO' | 'PDF';
    contentUrl: string;
    isActive: boolean;
    isPreview: boolean;
    metadata?: Record<string, any>;
}

const getHeaders = () => {
    const token = tokenStorage.get();
    return {
        Authorization: `Bearer ${token}`,
    };
};

export const teacherCourseService = {
    // --- Courses ---
    createCourse: async (data: Partial<Course>): Promise<Course> => {
        return apiClient.post<Course>('/courses', data, {
            headers: getHeaders(),
        });
    },

    getCourse: async (id: string): Promise<Course> => {
        return apiClient.get<Course>(`/courses/${id}`, {
            headers: getHeaders(),
        });
    },

    updateCourse: async (id: string, data: Partial<Course>): Promise<Course> => {
        return apiClient.request<Course>(`/courses/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: getHeaders(),
        });
    },

    // --- Modules ---
    createModule: async (data: Partial<CourseModule>): Promise<CourseModule> => {
        return apiClient.post<CourseModule>('/course-modules', data, {
            headers: getHeaders(),
        });
    },

    getModulesByCourse: async (courseId: string): Promise<CourseModule[]> => {
        return apiClient.get<CourseModule[]>(`/course-modules/course/${courseId}`, {
            headers: getHeaders(),
        });
    },

    updateModule: async (id: string, data: Partial<CourseModule>): Promise<CourseModule> => {
        return apiClient.request<CourseModule>(`/course-modules/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: getHeaders(),
        });
    },

    deleteModule: async (id: string): Promise<void> => {
        return apiClient.request<void>(`/course-modules/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
    },

    reorderModules: async (courseId: string, moduleIds: string[]): Promise<void> => {
        return apiClient.request<void>(`/course-modules/course/${courseId}/reorder`, {
            method: 'PATCH',
            body: JSON.stringify(moduleIds),
            headers: getHeaders(),
        });
    },

    // --- Lessons ---
    createLesson: async (data: Partial<CourseLesson>): Promise<CourseLesson> => {
        return apiClient.post<CourseLesson>('/course-lessons', data, {
            headers: getHeaders(),
        });
    },

    getLessonsByModule: async (moduleId: string): Promise<CourseLesson[]> => {
        return apiClient.get<CourseLesson[]>(`/course-lessons/module/${moduleId}`, {
            headers: getHeaders(),
        });
    },

    updateLesson: async (id: string, data: Partial<CourseLesson>): Promise<CourseLesson> => {
        return apiClient.request<CourseLesson>(`/course-lessons/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: getHeaders(),
        });
    },

    deleteLesson: async (id: string): Promise<void> => {
        return apiClient.request<void>(`/course-lessons/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
    },

    reorderLessons: async (moduleId: string, lessonIds: string[]): Promise<void> => {
        return apiClient.request<void>(`/course-lessons/module/${moduleId}/reorder`, {
            method: 'PATCH',
            body: JSON.stringify(lessonIds),
            headers: getHeaders(),
        });
    },

    // --- Uploads ---
    uploadFile: async (file: File, type: 'video' | 'image' | 'pdf'): Promise<{ url: string; originalName: string; size: number }> => {
        const formData = new FormData();
        formData.append('file', file);

        const token = tokenStorage.get();

        if (!token) {
            throw new Error("Authentication token not found. Please log in again.");
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/uploads/${type}`, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            let errorMessage = 'Upload failed';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                errorMessage = await response.text();
            }
            console.error('Upload Error:', response.status, errorMessage);
            throw new Error(errorMessage || `Upload failed with status ${response.status}`);
        }

        return response.json();
    },
};

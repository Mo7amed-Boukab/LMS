import { apiClient } from "../api-client";

export interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  thumbnail?: string;
  promotionalVideo?: string;
  price: number;
  isPublicVisible: boolean;
  hasCertificate: boolean;
  status: string;
  instructorId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CoursesResponse {
  courses: Course[];
  total: number;
  page: number;
  pages: number;
}

export interface CourseFilters {
  category?: string;
  level?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const courseApi = {
  // Public endpoints (no authentication required)
  getAllPublic: async (filters?: CourseFilters): Promise<CoursesResponse> => {
    const searchParams = new URLSearchParams();
    
    if (filters?.category) searchParams.append('category', filters.category);
    if (filters?.level) searchParams.append('level', filters.level);
    if (filters?.search) searchParams.append('search', filters.search);
    if (filters?.page) searchParams.append('page', filters.page.toString());
    if (filters?.limit) searchParams.append('limit', filters.limit.toString());

    const queryString = searchParams.toString();
    const url = `/courses/public${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<CoursesResponse>(url);
  },

  getByIdPublic: async (id: string): Promise<Course> => {
    return apiClient.get<Course>(`/courses/public/${id}`);
  },

  getCurriculum: async (courseId: string): Promise<CourseModule[]> => {
    return apiClient.get<CourseModule[]>(`/course-modules/public/course/${courseId}`);
  },
};

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

export interface CourseModule {
  _id: string;
  title: string;
  courseId: string;
  order: number;
  isActive: boolean;
  lessons?: CourseLesson[];
}

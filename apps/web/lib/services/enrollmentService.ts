import { apiClient } from "../api-client";
import { Course } from "./courseService";
 
export interface Enrollment {
  _id: string;
  studentId: string;
  courseId: Course;
  status: 'active' | 'completed' | 'dropped';
  enrolledAt: string;
}

export const enrollmentApi = {
  enroll: async (courseId: string): Promise<Enrollment> => {
    return apiClient.post<Enrollment>(`/enrollments/${courseId}`);
  },

  checkEnrollment: async (courseId: string): Promise<{ isEnrolled: boolean; enrollment: Enrollment | null }> => {
    return apiClient.get<{ isEnrolled: boolean; enrollment: Enrollment | null }>(`/enrollments/${courseId}/check`);
  },

  getMyCourses: async (): Promise<Enrollment[]> => {
    return apiClient.get<Enrollment[]>('/enrollments/my-courses');
  },
};

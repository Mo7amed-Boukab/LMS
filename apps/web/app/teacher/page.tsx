"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import RecentCourses from "@/components/dashboard/RecentCourses";
import StatCard from "@/components/dashboard/StatCard";
import { useAuth } from "@/context/auth-context";
import { enrollmentApi } from "@/lib/services/enrollmentService";
import { Course, teacherCourseService } from "@/lib/services/teacher-course.service";
import { useEffect, useState } from "react";
import { DashboardStudent } from "./students/page";

export default function TeacherDashboard() {
  const { user } = useAuth();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<DashboardStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [coursesData, studentsData] = await Promise.all([
          teacherCourseService.getAllCourses(),
          enrollmentApi.getInstructorStudents(),
        ]);
        setCourses(coursesData);
        setStudents(studentsData);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Compute Statistics
  const totalCourses = courses.length;
  const totalEnrollments = students.reduce((acc, student) => acc + student.courses.length, 0);
  
  // Create a map of courseId to enrollment count
  const enrollmentCountByCourse: Record<string, number> = {};
  let totalRevenue = 0;

  students.forEach(student => {
    student.courses.forEach(c => {
      enrollmentCountByCourse[c.courseId] = (enrollmentCountByCourse[c.courseId] || 0) + 1;
    });
  });

  courses.forEach(course => {
    const enrollments = enrollmentCountByCourse[course._id] || 0;
    if (course.price) {
      totalRevenue += enrollments * course.price;
    }
  });

  // Calculate trends (mock trends for now until we have historical data)
  const isTrendUp = true;
  
  // Format courses for RecentCourses component (add student counts)
  const coursesWithStats = courses
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map(c => ({
      _id: c._id,
      title: c.title,
      category: c.category,
      price: c.price || 0,
      status: c.status === 'published' ? 'Published' : c.status === 'draft' ? 'Draft' : 'Archived',
      thumbnail: c.thumbnail,
      enrollmentCount: enrollmentCountByCourse[c._id] || 0,
    }));

  return (
    <>
      <DashboardHeader
        title={`Welcome back, ${user?.firstName || "Teacher"}`}
        description="Here's what's happening with your courses today."
      />

      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
          </div>
        ) : (
          <>
            {/* Stats Overview - 4 cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard
                title="Total Courses"
                value={totalCourses.toString()}
                trend="View all"
                trendUp={isTrendUp}
              />
              <StatCard
                title="Total Enrollments"
                value={totalEnrollments.toString()}
                trend="View all"
                trendUp={isTrendUp}
              />
              <StatCard
                title="Total Quizzes"
                value={"0"} // Placeholder until quiz stats are tracked globally
                trend="View all"
                trendUp={isTrendUp}
              />
              <StatCard
                title="Total Revenue"
                value={`$${totalRevenue.toFixed(2)}`}
                trend="View all"
                trendUp={isTrendUp}
              />
            </div>

            {/* Recent Courses Table */}
            <RecentCourses courses={coursesWithStats.slice(0, 5)} totalCourses={courses.length} />
          </>
        )}
      </div>
    </>
  );
}

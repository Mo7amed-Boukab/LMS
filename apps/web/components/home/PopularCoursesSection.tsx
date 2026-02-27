"use client";

import { getMediaUrl } from "@/lib/media";
import { Course, courseApi } from "@/lib/services/courseService";
import { useEffect, useState } from "react";
import CourseCard from "./CourseCard";

export default function PopularCoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseApi.getAllPublic({ limit: 4 });
        setCourses(data.courses);
      } catch (error) {
        console.error("Failed to fetch popular courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-2">
              Popular Courses
            </h2>
            <p className="text-gray-500">
              Highest rated courses by our students this month.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No courses available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                category={course.category}
                imageUrl={getMediaUrl(course.thumbnail)}
                rating="4.8"
                reviewCount="0"
                title={course.title}
                description={course.description}
                instructorName={`${course.instructorId?.firstName || "Unknown"} ${course.instructorId?.lastName || ""}`.trim()}
                instructorAvatar={`https://ui-avatars.com/api/?name=${course.instructorId?.firstName || "Unknown"}+${course.instructorId?.lastName || ""}&background=random&color=fff&background=ef4444`}
                price={`${course.price?.toFixed(2) || "0.00"} DH`}
                slug={course._id}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

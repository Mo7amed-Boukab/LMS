"use client";

import { getMediaUrl } from "@/lib/media";
import { ArrowRight, MoreVertical } from "lucide-react";
import Link from "next/link";

export interface RecentCourseData {
  _id: string;
  title: string;
  category: string;
  price: number;
  status: string;
  thumbnail?: string;
  enrollmentCount: number;
}

interface RecentCoursesProps {
  courses: RecentCourseData[];
  totalCourses: number;
}

export default function RecentCourses({ courses, totalCourses }: RecentCoursesProps) {
  return (
    <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
      <div className="p-5 flex items-center justify-between border-b border-gray-100">
        <h3 className="text-base font-bold text-gray-900">Recent Courses</h3>
        <Link
          href="/teacher/courses"
          className="text-sm font-medium text-red-700 hover:text-red-800 flex items-center gap-1"
        >
          View all {totalCourses} courses <ArrowRight size={14} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        {courses.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            You haven't created any courses yet.
            <div className="mt-4">
              <Link href="/teacher/courses/create" className="text-red-600 hover:text-red-700 underline">
                Create your first course
              </Link>
            </div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Course Name
                </th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Enrolled
                </th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {courses.map((course) => (
                <tr
                  key={course._id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-sm bg-gray-100 bg-cover bg-center shrink-0 border border-gray-200"
                        style={{ backgroundImage: `url(${getMediaUrl(course.thumbnail) || 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=100&auto=format&fit=crop&q=60'})` }}
                      ></div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors max-w-[200px] truncate">
                          {course.title}
                        </h4>
                        <span className="text-xs text-gray-400">
                          ID: #{course._id.substring(0, 8)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-sm text-gray-600 truncate block max-w-[120px]">
                      {course.category}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    {course.enrollmentCount > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-2">
                          {[...Array(Math.min(3, course.enrollmentCount))].map(
                            (_, i) => (
                              <div
                                key={i}
                                className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white"
                              ></div>
                            )
                          )}
                        </div>
                        <span className="text-xs text-gray-500 font-medium">
                          +{course.enrollmentCount}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        No enrollments yet
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-sm font-medium text-gray-900">
                      ${course.price.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        course.status === "Published"
                          ? "bg-green-50 text-green-700"
                          : course.status === "Draft"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-red-50 text-red-700"
                      }`}
                    >
                      {course.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button className="text-gray-400 hover:text-gray-600 p-1.5 rounded-sm hover:bg-gray-100 transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-500">Showing {courses.length} of {totalCourses} courses</span>
        <div className="flex gap-2">
          <Link href="/teacher/courses" className="px-3 py-1.5 text-xs border border-gray-200 rounded-sm text-gray-500 hover:bg-gray-50">
            View All
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { BookOpen, Users, FileQuestion, DollarSign } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import RecentCourses from "@/components/dashboard/RecentCourses";

export default function TeacherDashboard() {
  const { user } = useAuth();

  return (
    <>
      <DashboardHeader
        title={`Welcome back, ${user?.firstName || 'Teacher'}`}
        description="Here's what's happening with your courses today."
      />

      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Stats Overview - 4 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Courses"
            value="12"
            trend="+2"
            trendUp={true}
          />
          <StatCard
            title="Total Enrollments"
            value="1,240"
            trend="+12%"
            trendUp={true}
          />
          <StatCard
            title="Total Quizzes"
            value="48"
            trend="+5"
            trendUp={true}
          />
          <StatCard
            title="Total Revenue"
            value="$12,450"
            trend="+8%"
            trendUp={true}
          />
        </div>

        {/* Recent Courses Table */}
        <RecentCourses />
      </div>
    </>
  );
}

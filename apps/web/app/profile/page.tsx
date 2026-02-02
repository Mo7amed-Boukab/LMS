"use client";

import CourseCard from "@/components/home/CourseCard";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { useAuth } from "@/context/auth-context";
import { getMediaUrl } from "@/lib/media";
import { Enrollment, enrollmentApi } from "@/lib/services/enrollmentService";
import {
  Book,
  GraduationCap,
  Mail,
  Shield,
  User as UserIcon
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
 
export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "learning"
  >("profile");
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(false);
 
  useEffect(() => {
    if (user && activeTab === "learning") {
      const fetchEnrollments = async () => {
        setIsLoadingEnrollments(true);
        try {
          const data = await enrollmentApi.getMyCourses();
          setEnrollments(data);
        } catch (error) {
          console.error("Failed to fetch enrollments", error);
        } finally {
          setIsLoadingEnrollments(false);
        }
      };
      fetchEnrollments();
    }
  }, [user, activeTab]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Please log in to view your profile.</p>
        <Link href="/login" className="text-red-700 hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            My Profile
          </h1>
          <p className="mt-1 text-gray-500">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Sidebar Navigation & Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Summary Card */}
            <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-red-800 to-red-600 w-full relative"></div>
              <div className="px-6 pb-6 relative">
                <div className="relative -mt-12 mb-4 flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md">
                    <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
                      <UserIcon size={40} />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold uppercase tracking-wide border border-red-100">
                    {user.role}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="bg-white rounded-sm border border-gray-200 overflow-hidden">
              <div className="p-2 space-y-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-sm transition-colors text-left ${
                    activeTab === "profile"
                      ? "text-red-700 bg-red-50"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <UserIcon size={18} />
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-sm transition-colors text-left ${
                    activeTab === "security"
                      ? "text-red-700 bg-red-50"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Shield size={18} />
                  Security
                </button>
                <button
                  onClick={() => setActiveTab("learning")}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-sm transition-colors text-left ${
                    activeTab === "learning"
                      ? "text-red-700 bg-red-50"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Book size={18} />
                  My Learning
                </button>
              </div>
            </nav>
          </div>

          {/* Right Column - Content details */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === "profile" && (
              <>
                {/* Personal Information Section */}
                <div className="bg-white rounded-sm border border-gray-200 p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-gray-900">
                      Personal Information
                    </h3>
                    <button className="text-sm font-semibold text-red-700 hover:text-red-800 transition-colors">
                      Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        First Name
                      </label>
                      <input
                        type="text"
                        disabled
                        value={user.firstName || ""}
                        className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all disabled:bg-gray-50 disabled:text-gray-900 disabled:opacity-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Last Name
                      </label>
                      <input
                        type="text"
                        disabled
                        value={user.lastName || ""}
                        className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all disabled:bg-gray-50 disabled:text-gray-900 disabled:opacity-100"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail size={18} className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          disabled
                          value={user.email}
                          className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-sm text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all disabled:bg-gray-50 disabled:text-gray-900 disabled:opacity-100"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Role
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <GraduationCap size={18} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          disabled
                          value={user.role}
                          className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-sm text-sm text-gray-900 font-medium capitalize focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all disabled:bg-gray-50 disabled:text-gray-900 disabled:opacity-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preferences Section */}
                <div className="bg-white rounded-sm border border-gray-200 p-6 sm:p-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">
                    Account Preferences
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium text-gray-900">
                          Email Notifications
                        </p>
                        <p className="text-xs text-gray-500">
                          Receive updates about your courses and progress.
                        </p>
                      </div>
                      <div className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 bg-red-700">
                        <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "security" && (
              <div className="bg-white rounded-sm border border-gray-200 p-6 sm:p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  Security Settings
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Manage your password and security preferences.
                </p>

                <div className="space-y-6 max-w-lg">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your current password"
                      className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-sm text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-sm text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    />
                  </div>
                  <div className="pt-2">
                    <button className="px-4 py-2 bg-red-700 text-white text-sm font-medium rounded-sm hover:bg-red-800 transition-colors">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "learning" && (
              <div className="bg-white rounded-sm border border-gray-200 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    My Learning
                  </h3>
                  <Link
                    href="/courses"
                    className="text-sm font-medium text-red-700 hover:text-red-800 hover:underline"
                  >
                    Browse Courses
                  </Link>
                </div>
                
                {isLoadingEnrollments ? (
                  <div className="flex justify-center py-12">
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
                  </div>
                ) : enrollments.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4 text-gray-400">
                      <Book size={32} />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      No enrollments yet
                    </h4>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
                      You haven't enrolled in any courses yet. Explore our catalog
                      to find the perfect course for you.
                    </p>
                    <Link href="/courses">
                      <button className="px-4 py-2 bg-red-700 text-white text-sm font-medium rounded-sm hover:bg-red-800 transition-colors">
                        Browse Courses
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {enrollments.map((enrollment) => (
                      <CourseCard
                        key={enrollment._id}
                        category={enrollment.courseId.category}
                        imageUrl={getMediaUrl(enrollment.courseId.thumbnail)}
                        rating="4.8"
                        reviewCount="0"
                        title={enrollment.courseId.title}
                        description={enrollment.courseId.description}
                        instructorName={enrollment.courseId.instructorId?.firstName ? `${enrollment.courseId.instructorId.firstName} ${enrollment.courseId.instructorId.lastName}` : "Instructor"}
                        instructorAvatar={`https://ui-avatars.com/api/?name=${enrollment.courseId.instructorId?.firstName || 'I'}+${enrollment.courseId.instructorId?.lastName || 'N'}&background=random&color=fff&background=ef4444`}
                        price={`${enrollment.courseId.price.toFixed(2)} DH`}
                        slug={enrollment.courseId._id}
                        showContinueLearning={true}
                        variant="horizontal"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

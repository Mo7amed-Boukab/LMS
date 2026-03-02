"use client";
 
import CourseCard from "@/components/home/CourseCard";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { useAuth } from "@/context/auth-context";
import { getMediaUrl } from "@/lib/media";
import { Enrollment, enrollmentApi } from "@/lib/services/enrollmentService";
import { Book } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
 
export default function MyEnrollmentsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    if (isAuthenticated) {
      const fetchEnrollments = async () => {
        try {
          const data = await enrollmentApi.getMyCourses();
          setEnrollments(data);
        } catch (error) {
          console.error("Failed to fetch enrollments", error);
        } finally {
          setLoading(false);
        }
      };
      fetchEnrollments();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);
 
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
        </div>
        <Footer />
      </div>
    );
  }
 
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <Book size={48} className="text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Please Log In</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view your courses.</p>
          <Link href="/login">
            <button className="bg-red-700 text-white px-8 py-3 rounded font-bold hover:bg-red-800 transition-colors">
              Go to Login
            </button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
 
      <main className="flex-grow max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-[#1a1a1a] tracking-tight">My Enrollments</h1>
            <p className="text-[#896168] mt-2">Continue where you left off and achieve your goals.</p>
          </div>
          <Link href="/courses">
            <button className="text-sm font-bold text-red-700 hover:text-red-800 transition-colors flex items-center gap-2">
              Browse more courses <span>→</span>
            </button>
          </Link>
        </div>
 
        {enrollments.length === 0 ? (
          <div className="bg-white rounded-sm border border-gray-100 p-12 text-center">
            <div className="inline-flex items-center justify-center size-20 rounded-full bg-red-50 text-red-700 mb-6">
              <Book size={32} />
            </div>
            <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">No enrollments yet</h2>
            <p className="text-[#896168] max-w-md mx-auto mb-8">
              Looks like you haven't started any courses yet. Start your journey today!
            </p>
            <Link href="/courses">
              <button className="bg-red-700 text-white px-8 py-3 rounded-sm font-bold hover:bg-red-800 transition-colors">
                Explore Catalog
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {enrollments
              .filter(enrollment => enrollment.courseId)
              .map((enrollment) => (
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
              />
            ))}
          </div>
        )}
      </main>
 
      <Footer />
    </div>
  );
}

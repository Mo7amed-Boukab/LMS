"use client";

import { useAuth } from "@/context/auth-context";
import {
  AlertCircle,
  Award,
  BarChart,
  BookOpen,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  FileText,
  Gift,
  Globe,
  Infinity,
  Lock,
  Monitor,
  Play,
  PlayCircle,
  RefreshCw,
  Share2,
  Star,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Footer from "../../../components/layout/Footer";
import Header from "../../../components/layout/Header";
import { getMediaUrl } from "../../../lib/media";
import { Course, courseApi, CourseLesson, CourseModule } from "../../../lib/services/courseService";
import { enrollmentApi } from "../../../lib/services/enrollmentService";
import { progressApi } from "../../../lib/services/progressService";

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { isAuthenticated } = useAuth();




  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState("overview");
  const [isPlayingPromo, setIsPlayingPromo] = useState(false);
  
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      try {
        setLoading(true);
        const [courseData, curriculumData] = await Promise.all([
          courseApi.getByIdPublic(slug),
          courseApi.getCurriculum(slug)
        ]);
        setCourse(courseData);
        setModules(curriculumData);

        if (isAuthenticated) {
            try {
                // Check enrollment
                const { isEnrolled } = await enrollmentApi.checkEnrollment(courseData._id);
                setIsEnrolled(isEnrolled);

                // If enrolled, fetch value progress
                if (isEnrolled) {
                   const progress = await progressApi.getCourseProgress(courseData._id);
                   setCompletedLessons(progress.completedLessons);
                }
            } catch (err) {
                console.error("Failed to check enrollment/progress:", err);
            }
        }

      } catch (err) {
        console.error("Failed to load course details:", err);
        setError("Failed to load course details. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug, isAuthenticated]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
        toast.error("You must be logged in to enroll");
        router.push(`/login?redirect=/courses/${slug}`);
        return;
    }

    if (!course) return;

    try {
        setEnrollmentLoading(true);
        await enrollmentApi.enroll(course._id);
        setIsEnrolled(true);
        toast.success("Successfully enrolled! Happy learning.");
    } catch (err) {
        console.error("Enrollment failed:", err);
        toast.error("Failed to enroll. Please try again.");
    } finally {
        setEnrollmentLoading(false);
    }
  };

  const handleStartLearning = () => {
      // Find the first lesson and select it
      if (modules.length > 0 && modules[0].lessons && modules[0].lessons.length > 0) {
          const firstLesson = modules[0].lessons[0];
          setSelectedLesson(firstLesson);
          setActiveTab("curriculum");
          // Scroll to player
          window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
          toast.info("No lessons available yet.");
      }
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
        return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`;
    }
    return null;
  };

  const handleLessonSelect = async (lesson: CourseLesson) => {
      // Allow preview lessons to be viewed without login
      if (!lesson.isPreview && !isAuthenticated) {
          toast.error("You must be logged in to view this lesson");
          router.push(`/login?redirect=/courses/${slug}`);
          return;
      }

      // Check if user is enrolled for non-preview lessons
      if (!lesson.isPreview && !isEnrolled) {
          toast.error("You must be enrolled to view this lesson");
          return;
      }

      if (selectedLesson?._id === lesson._id) {
          // Allow closing the player or just stay? 
          // Current logic was toggle off if same selected.
          setSelectedLesson(null);
      } else {
          setSelectedLesson(lesson);
          
          // Mark as read if enrolled and not already completed
          if (isEnrolled && !completedLessons.includes(lesson._id)) {
              // Optimistic update
              setCompletedLessons(prev => [...prev, lesson._id]);
              try {
                  await progressApi.toggleLesson(lesson._id);
              } catch (error) {
                  console.error("Failed to update progress:", error);
                  // Revert if failed
                  setCompletedLessons(prev => prev.filter(id => id !== lesson._id));
              }
          }
      }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Course not found</h1>
          <p className="text-gray-600 mb-6">{error || "The course you are looking for does not exist."}</p>
          <Link href="/courses" className="bg-red-700 text-white px-6 py-2 rounded-md hover:bg-red-800 transition-colors">
            Browse Courses
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate stats
  const totalLessons = modules.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0);
  const totalDurationMinutes = totalLessons * 15; // Assumption: 15 min per lesson
  const totalHours = Math.floor(totalDurationMinutes / 60);
  const remainingMinutes = totalDurationMinutes % 60;
  const thumbnailUrl = getMediaUrl(course.thumbnail);
  
  // Price formatting
  const originalPrice = course.price * 1.2; // +20%
  const discountPercentage = 20; // Fixed as requested based on math logic

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-[#1a1a1a]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
            style={{
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBrVLh01DohL903CxyBu7x05LYNSmwKyQmzgl8F385wGj3FOzVBHlTEYfq5q1JtxkJ_H8QR848NaBu3B8V5KuFupCkI-ZbAeA09b29SANUun7bUDTUdtP1JWSjELV2naFhiDPcCThwsFMsuGnbtgaI3TldHazP72RcgxncEm89Ox2itm4fSHxtiy7_-r6J4PQlcuW4Hwoi6z34a9Y9USf1VGotfwEgstpiJYW7ojZX8BW250lnTaUE8wAxfvapaZGKDictWCKXZgEIF')",
            }}
          ></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-12">
            <div className="max-w-3xl">
              {/* Breadcrumbs inside Hero */}
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400 mb-6 font-medium">
                <Link
                  className="hover:text-white transition-colors"
                  href="/courses"
                >
                  Courses
                </Link>
                <span>›</span>
                <span className="text-white">{course.category || "General"}</span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-6">
                {course.title}
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl leading-relaxed">
                {course.description.length > 150 ? course.description.substring(0, 150) + "..." : course.description}
              </p>
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 mb-8">
                <div className="flex items-center gap-2">
                  <Clock size={20} />
                  <span>{totalHours > 0 ? `${totalHours} Hours` : "Coming Soon"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart size={20} />
                  <span>{course.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={20} />
                  <span>English</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw size={20} />
                  <span>Last updated {new Date(course.updatedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className="bg-[#f6c344] text-black text-xs font-bold px-2 py-0.5 rounded-[3px]">
                    Bestseller
                  </span>
                  <div className="flex items-center gap-1 text-[#f6c344]">
                    <span className="font-bold text-sm">4.8</span>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-gray-300 text-sm">(1,204 ratings)</span>
                  <span className="text-white text-sm">12,500 students</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-[#1a1a1a] bg-red-700 flex items-center justify-center text-white font-bold text-xs">
                    {course.instructorId.firstName.charAt(0)}{course.instructorId.lastName.charAt(0)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-300">
                    Created by{" "}
                    <button
                      className="text-white font-bold hover:underline"
                      onClick={() => setActiveTab("instructor")}
                    >
                      {course.instructorId.firstName} {course.instructorId.lastName}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8 relative">
            {/* Left Content Column */}
            <div className="flex-1 min-w-0">
              {/* Tabs Navigation */}
              <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-[#f4f0f1] mb-8">
                <div className="flex overflow-x-auto no-scrollbar gap-8">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`whitespace-nowrap py-4 border-b-[3px] font-bold text-sm ${activeTab === 'overview' ? 'border-[#cb1030] text-[#cb1030]' : 'border-transparent text-[#896168] hover:text-[#181112]'}`}
                  >
                    Overview
                  </button>
                  <button
                     onClick={() => setActiveTab("curriculum")}
                    className={`whitespace-nowrap py-4 border-b-[3px] font-bold text-sm ${activeTab === 'curriculum' ? 'border-[#cb1030] text-[#cb1030]' : 'border-transparent text-[#896168] hover:text-[#181112]'}`}
                  >
                    Curriculum
                  </button>
                  <button
                     onClick={() => setActiveTab("instructor")}
                    className={`whitespace-nowrap py-4 border-b-[3px] font-bold text-sm ${activeTab === 'instructor' ? 'border-[#cb1030] text-[#cb1030]' : 'border-transparent text-[#896168] hover:text-[#181112]'}`}
                  >
                    Instructor
                  </button>
                  <button
                     onClick={() => setActiveTab("reviews")}
                    className={`whitespace-nowrap py-4 border-b-[3px] font-bold text-sm ${activeTab === 'reviews' ? 'border-[#cb1030] text-[#cb1030]' : 'border-transparent text-[#896168] hover:text-[#181112]'}`}
                  >
                    Reviews
                  </button>
                </div>
              </div>

              {/* Overview Section */}
              {activeTab === "overview" && (
                <div className="mb-12 animate-fadeIn">
                  <h2 className="text-2xl font-bold mb-6 text-[#181112]">
                    About this course
                  </h2>
                  <div className="prose prose-lg text-[#896168] mb-8">
                    <p className="whitespace-pre-line">{course.description}</p>
                  </div>
                </div>
              )}

              {/* Curriculum Section */}
               {activeTab === "curriculum" && (
                <div className="mb-12 animate-fadeIn">
                  <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl font-bold text-[#181112]">
                      Course Curriculum
                    </h2>
                    <span className="text-sm text-[#896168]">
                      {modules.length} Sections • {totalLessons} Lectures • {totalHours}h {remainingMinutes}m
                    </span>
                  </div>
                  
                  {modules.length === 0 ? (
                    <div className="p-8 text-center bg-gray-50 rounded-lg text-gray-500">
                      No curriculum available yet.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {modules.map((module, moduleIndex) => {
                          const moduleLessons = module.lessons || [];
                          // Check if all lessons in this module are completed
                          const isModuleCompleted = moduleLessons.length > 0 && 
                              moduleLessons.every(lesson => completedLessons.includes(lesson._id));

                          return (
                            <details
                              key={module._id}
                              className="group bg-white rounded border border-gray-200 overflow-hidden"
                              open={moduleIndex === 0}
                            >
                              <summary className="flex cursor-pointer items-center justify-between p-4 bg-[#f4f0f1]/50 hover:bg-[#f4f0f1] transition-colors select-none">
                                <div className="flex items-center gap-3">
                                  <span className="transition-transform group-open:rotate-180 text-[#896168]">
                                    ▼
                                  </span>
                                  <h3 className="font-bold text-[#181112]">
                                    Section {moduleIndex + 1}: {module.title}
                                  </h3>
                                </div>
                                <span className="text-xs font-bold text-[#896168]">
                                  {moduleLessons.length} lessons
                                </span>
                              </summary>
                              
                              <div className="p-0 border-t border-gray-100">
                                {moduleLessons.length > 0 ? (
                                    moduleLessons.map((lesson, lessonIndex) => {
                                        const isSelected = selectedLesson?._id === lesson._id;
                                        
                                        const prevLesson = lessonIndex > 0 ? moduleLessons[lessonIndex - 1] : null;
                                        const nextLesson = lessonIndex < moduleLessons.length - 1 ? moduleLessons[lessonIndex + 1] : null;

                                        return (
                                          <div key={lesson._id}>
                                              <div 
                                                  onClick={() => handleLessonSelect(lesson)}
                                                  className={`flex items-center justify-between px-5 py-3 cursor-pointer transition-colors border-b border-gray-100 last:border-0 ${
                                                      isSelected ? "bg-red-50" : "hover:bg-gray-50 bg-white"
                                                  }`}
                                              >
                                                <div className="flex items-center gap-3">
                                                  {completedLessons.includes(lesson._id) ? (
                                                      <CheckCircle className="text-red-700 font-bold" size={18} />
                                                  ) : lesson.type === 'VIDEO' ? (
                                                      <PlayCircle className={isSelected ? "text-red-700" : "text-[#896168]"} size={18} />
                                                  ) : ( 
                                                      <FileText className={isSelected ? "text-red-700" : "text-[#896168]"} size={18} />
                                                  )}
                                                  <span className={`text-sm ${isSelected ? "text-red-800 font-bold" : "text-[#181112]"}`}>
                                                    {lesson.title}
                                                  </span>
                                                </div>
                                                 <div className="flex items-center gap-3">
                                                       {lesson.isPreview && (
                                                           <span className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">PREVIEW</span>
                                                       )}
                                                       {!isEnrolled && !lesson.isPreview && (
                                                           <Lock size={14} className="text-gray-400" />
                                                       )}
                                                       <span className="text-xs text-[#896168]">{lesson.type}</span>
                                                 </div>
                                              </div>

                                              {/* Inline Player */}
                                              {isSelected && (
                                                  <div className="bg-white border-b border-gray-200 animate-fadeIn">
                                                      <div className="aspect-video bg-black flex items-center justify-center">
                                                          {lesson.type === "VIDEO" ? (
                                                              getMediaUrl(lesson.contentUrl) ? (
                                                                  <video 
                                                                      key={getMediaUrl(lesson.contentUrl)}
                                                                      controls 
                                                                      className="w-full h-full"
                                                                      src={getMediaUrl(lesson.contentUrl) || ""}
                                                                      controlsList="nodownload"
                                                                  >
                                                                      Your browser does not support the video tag.
                                                                  </video>
                                                              ) : (
                                                                  <div className="text-white flex flex-col items-center">
                                                                      <Video size={48} className="mb-4 text-gray-500" />
                                                                      <p>Video content not available</p>
                                                                  </div>
                                                              )
                                                          ) : (
                                                              <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center p-8 text-center">
                                                                  <FileText size={48} className="text-red-700 mb-4" />
                                                                  <h3 className="text-lg font-bold text-gray-900 mb-2">{lesson.title}</h3>
                                                                  <p className="text-gray-500 mb-6 text-sm max-w-md">
                                                                      This lesson contains a PDF document.
                                                                  </p>
                                                                  {getMediaUrl(lesson.contentUrl) ? (
                                                                      <a 
                                                                          href={getMediaUrl(lesson.contentUrl) || ""}
                                                                          target="_blank" 
                                                                          rel="noopener noreferrer"
                                                                          className="bg-red-700 text-white px-6 py-2 rounded font-medium hover:bg-red-800 transition-colors flex items-center gap-2"
                                                                      >
                                                                          <Download size={18} />
                                                                          Open PDF Document
                                                                      </a>
                                                                  ) : (
                                                                      <p className="text-red-500">PDF source not found</p>
                                                                  )}
                                                              </div>
                                                          )}
                                                      </div>
                                                      
                                                      {/* Navigation Buttons */}
                                                      <div className="flex items-center justify-between p-4 bg-white border-t border-gray-200">
                                                          <button
                                                              onClick={(e) => { e.stopPropagation(); if(prevLesson) handleLessonSelect(prevLesson); }}
                                                              disabled={!prevLesson}
                                                              className={`flex items-center gap-2 px-4 py-2 rounded font-medium text-sm transition-colors border ${
                                                                  prevLesson 
                                                                      ? "bg-white text-gray-700 border-gray-300 hover:bg-gray-50" 
                                                                      : "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                                                              }`}
                                                          >
                                                              <ChevronDown size={16} className="rotate-90" />
                                                              Previous
                                                          </button>
                                                          
                                                          <div className="text-gray-600 text-xs font-medium">
                                                              Lesson {lessonIndex + 1} of {moduleLessons.length}
                                                          </div>
                                                          
                                                          <button
                                                              onClick={(e) => { e.stopPropagation(); if(nextLesson) handleLessonSelect(nextLesson); }}
                                                              disabled={!nextLesson}
                                                              className={`flex items-center gap-2 px-4 py-2 rounded font-medium text-sm transition-colors ${
                                                                  nextLesson 
                                                                      ? "bg-red-700 text-white hover:bg-red-800" 
                                                                      : "bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed"
                                                              }`}
                                                          >
                                                              Next
                                                              <ChevronDown size={16} className="-rotate-90" />
                                                          </button>
                                                      </div>
                                                  </div>
                                              )}
                                          </div>
                                        );
                                    })
                                ) : (
                                    <div className="px-5 py-3 text-sm text-gray-400 italic">No lessons in this module</div>
                                )}
                                
                                {/* Module Quiz Row - Always visible if a quiz exists OR if there are lessons */}
                                {(module.quiz || moduleLessons.length > 0) && (
                                     <div 
                                        className={`flex items-center justify-between px-5 py-4 border-t-2 border-dashed border-gray-200 transition-colors ${
                                            isModuleCompleted && isAuthenticated && module.quiz
                                                ? "bg-white cursor-pointer hover:bg-gray-50" 
                                                : "bg-[#fcf8f9] cursor-not-allowed opacity-80"
                                        }`}
                                        onClick={() => {
                                            if (isModuleCompleted && isAuthenticated && module.quiz) {
                                                router.push(`/student/quiz/${module.quiz._id}`);
                                            } else if (!isAuthenticated) {
                                                toast.error("Please login to take the quiz");
                                            } else if (!module.quiz) {
                                                toast.info("No quiz available for this module.");
                                            } else {
                                                toast.error("Please complete all lessons in this module to unlock the quiz.");
                                            }
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            {isModuleCompleted && isAuthenticated && module.quiz ? (
                                                <BookOpen size={18} className="text-[#cb1030]" />
                                            ) : (
                                                <Lock size={18} className="#896168" />
                                            )}
                                            <div>
                                                <span className={`text-sm font-medium block ${isModuleCompleted && isAuthenticated && module.quiz ? "text-[#cb1030]" : "text-[#896168]"}`}>
                                                    {module.quiz?.title || "Module Quiz"}
                                                </span>
                                                {((!isModuleCompleted || !isAuthenticated) && moduleLessons.length > 0) && (
                                                    <span className="text-xs text-[#896168]">
                                                        Complete all {moduleLessons.length} lessons to unlock
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-[#896168]">
                                                {module.quiz ? "Assessment" : "Not scheduled"}
                                            </span>
                                        </div>
                                    </div>
                                )}
                              </div>
                            </details>
                          );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Instructor Section */}
              {activeTab === "instructor" && (
                <div className="mb-12 animate-fadeIn">
                  <h2 className="text-2xl font-bold mb-6 text-[#181112]">
                    Meet Your Instructor
                  </h2>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row gap-6 p-6 rounded-md border border-gray-200 bg-white">
                      <div className="shrink-0">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-700 flex items-center justify-center text-white text-3xl font-bold">
                           {course.instructorId.firstName.charAt(0)}{course.instructorId.lastName.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#181112]">
                          {course.instructorId.firstName} {course.instructorId.lastName}
                        </h3>
                        <p className="text-[#cb1030] font-medium text-sm mb-3">
                          Instructor
                        </p>
                         <div className="flex gap-4 text-xs text-[#896168] mb-4">
                            <div className="flex items-center gap-1">
                              <Star size={16} fill="currentColor" />
                              <span>4.9 Instructor Rating</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users size={16} />
                              <span>5,200 Students</span>
                            </div>
                          </div>
                        <p className="text-sm text-[#896168] leading-relaxed">
                          {course.instructorId.email}
                          </p>
                      </div>
                    </div>
                  </div>
               </div>
              )}

               {/* Reviews Section */}
               {activeTab === "reviews" && (
                <div className="mb-12 animate-fadeIn">
                  <h2 className="text-2xl font-bold mb-6 text-[#181112]">
                    Student Reviews
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Review Card 1 */}
                    <div className="p-5 rounded-md bg-[#f4f0f1]">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="size-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                          JD
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#181112]">
                            John Doe
                          </h4>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} fill="currentColor" />
                            ))}
                          </div>
                        </div>
                        <span className="ml-auto text-xs text-[#896168]">
                          2 days ago
                        </span>
                      </div>
                      <p className="text-sm text-[#181112]">
                        The best course I've taken this year. The content was incredibly detailed and helpful.
                      </p>
                    </div>
                    {/* Review Card 2 */}
                    <div className="p-5 rounded-md bg-[#f4f0f1]">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="size-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                          AL
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#181112]">
                            Anna Lee
                          </h4>
                          <div className="flex text-yellow-400">
                            {[...Array(4)].map((_, i) => (
                              <Star key={i} size={14} fill="currentColor" />
                            ))}
                            <Star size={14} />
                          </div>
                        </div>
                        <span className="ml-auto text-xs text-[#896168]">
                          1 week ago
                        </span>
                      </div>
                      <p className="text-sm text-[#181112]">
                        Great content! I learned a lot about {course.category} concepts that I can apply immediately.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar (Sticky) */}
            <div className="w-full lg:w-[360px] shrink-0">
              <div className="sticky top-24 z-20">
                <div className="bg-white rounded-md shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
                  
                  {/* Preview Image / Video Logic */}
                 <div className="aspect-video bg-black relative group cursor-pointer border-b border-gray-100">
                     {course.promotionalVideo ? (
                         isPlayingPromo ? (
                            // Video Player (YouTube or Native)
                            getEmbedUrl(course.promotionalVideo) ? (
                                <iframe 
                                    className="w-full h-full"
                                    src={getEmbedUrl(course.promotionalVideo)!}
                                    title="Promotional Video"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <video 
                                    className="w-full h-full"
                                    src={getMediaUrl(course.promotionalVideo) || ""}
                                    controls
                                    autoPlay
                                ></video>
                            )
                         ) : (
                            // Thumbnail Preview with Play Button
                            <div 
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url('${thumbnailUrl || '/placeholder-course.jpg'}')` }}
                                onClick={() => setIsPlayingPromo(true)}
                            >
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg">
                                        <Play size={24} className="text-red-600 ml-1" fill="currentColor" />
                                    </div>
                                </div>
                                <div className="absolute bottom-4 left-0 w-full text-center">
                                    <span className="text-white text-xs font-bold uppercase tracking-wider drop-shadow-md">Preview Course</span>
                                </div>
                            </div>
                         )
                     ) : (
                         <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                             {/* If no promo video, just show thumbnail static */}
                              <div 
                                className="absolute inset-0 bg-cover bg-center opacity-60"
                                style={{ backgroundImage: `url('${thumbnailUrl || '/placeholder-course.jpg'}')` }}
                              />
                             <div className="relative flex flex-col items-center gap-2 text-white">
                                 <Video size={32} />
                                 <span className="text-xs font-medium">No preview available</span>
                             </div>
                         </div>
                     )}
                 </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-6 relative">
                      <span className="text-2xl font-black text-[#181112]">
                        {course.price.toFixed(2)} DH 
                      </span>
                       <span className="text-lg font-base text-[#896168] line-through decoration-[#cb1030] decoration-2">
                          {originalPrice.toFixed(2)} DH
                       </span>
                      <span className="absolute right-0 top-1 px-2 py-1 bg-red-300/20 text-red-700 text-xs font-bold rounded">
                        {discountPercentage}% OFF
                      </span>
                    </div>
                    {isEnrolled ? (
                        <button 
                            onClick={handleStartLearning}
                            className="w-full py-3 px-4 bg-red-700 hover:bg-red-800 text-white rounded font-bold text-sm shadow-[0_0_15px_rgba(203,16,48,0.15)] transition-all active:scale-[0.98] mb-3"
                        >
                            Start Learning
                        </button>
                    ) : (
                        <button 
                            onClick={handleEnroll}
                            disabled={enrollmentLoading}
                            className="w-full py-3 px-4 bg-red-700 hover:bg-red-800 text-white rounded font-bold text-sm shadow-[0_0_15px_rgba(203,16,48,0.15)] transition-all active:scale-[0.98] mb-3 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {enrollmentLoading ? "Enrolling..." : "Enroll Now"}
                        </button>
                    )}
                    <button className="w-full py-2.5 px-4 bg-transparent border border-gray-200 hover:border-[#cb1030] text-[#181112] hover:text-[#cb1030] rounded font-bold text-sm transition-all mb-6">
                      Add to Favorites
                    </button>
                    <div className="text-center text-xs text-[#896168] mb-6">
                      30-Day Money-Back Guarantee
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-bold text-sm text-[#181112]">
                        This course includes:
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-sm text-[#896168]">
                          <Monitor size={20} />
                          <span>{totalHours} hours on-demand video</span>
                        </li>
                        <li className="flex items-center gap-3 text-sm text-[#896168]">
                          <Download size={20} />
                          <span>Downloadable resources</span>
                        </li>
                        <li className="flex items-center gap-3 text-sm text-[#896168]">
                          <Infinity size={20} />
                          <span>Full lifetime access</span>
                        </li>
                         {course.hasCertificate && (
                            <li className="flex items-center gap-3 text-sm text-[#896168]">
                            <Award size={20} />
                            <span>Certificate of completion</span>
                            </li>
                        )}
                      </ul>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 p-4 flex justify-between items-center">
                    <button className="text-sm font-bold text-[#181112] hover:underline flex items-center gap-2">
                      <Share2 size={16} /> Share
                    </button>
                    <button className="text-sm font-bold text-[#181112] hover:underline flex items-center gap-2">
                      <Gift size={16} /> Gift this course
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import { teacherCourseService, type Course, type CourseLesson, type CourseModule } from "@/lib/services/teacher-course.service";
import {
  ArrowLeft,
  BarChart,
  BookOpen,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  Edit,
  FileText,
  Globe,
  Infinity,
  Loader2,
  Lock,
  Monitor,
  Play,
  PlayCircle,
  RefreshCw,
  Smartphone,
  Star,
  Trash2,
  Users,
  Video
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

export default function CourseDetailsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isPlayingPromo, setIsPlayingPromo] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [courseData, modulesData] = await Promise.all([
          teacherCourseService.getCourse(courseId),
          teacherCourseService.getModulesByCourse(courseId),
        ]);
        setCourse(courseData);
        setModules(modulesData);
      } catch (error) {
        toast.error("Failed to load course details");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [courseId]);

  const handleDeleteConfirm = async () => {
    if (!courseId) return;
    setIsDeleting(true);
    try {
      await teacherCourseService.deleteCourse(courseId);
      toast.success("Course deleted successfully");
      router.push("/teacher/courses");
    } catch (error: any) {
      console.error("Failed to delete course:", error);
      toast.error(error.message || "Failed to delete course");
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
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

  if (isLoading || !course) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-red-700" size={32} />
      </div>
    );
  }

  const getMediaUrl = (url?: string) => {
    if (!url) return null;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    
    if (url.includes("localhost:3000/uploads")) {
        return url.replace("localhost:3000", "localhost:4000");
    }

    if (url.startsWith("http")) return url;
    return `${apiUrl}/${url.startsWith("/") ? url.slice(1) : url}`;
  };

  const thumbnailUrl = getMediaUrl(course.thumbnail);
  // Calculate stats from modules
  const totalLessons = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
  const totalDuration = "12h 30m"; // Placeholder

  return (
    <>
      <DashboardHeader
        title="Course Details"
        description="View and manage your course content."
      />

      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Secondary Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
            <Link 
                href="/teacher/courses" 
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium"
            >
                <ArrowLeft size={16} />
                Back to Courses
            </Link>
            <div className="flex items-center gap-3">
                 <button 
                    onClick={() => setDeleteModalOpen(true)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded font-medium text-sm transition-colors"
                 >
                    <Trash2 size={16} />
                    Delete
                 </button>
                 <Link href={`/teacher/courses/${courseId}/edit`}>
                    <button className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-3 py-1.5 rounded font-medium text-sm transition-colors">
                        <Edit size={16} />
                        <span>Edit Course</span>
                    </button>
                </Link>
            </div>
        </div>
        
        {/* Compact Hero Section */}
        <section className="relative bg-[#1a1a1a] rounded overflow-hidden mb-6 min-h-[180px]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBrVLh01DohL903CxyBu7x05LYNSmwKyQmzgl8F385wGj3FOzVBHlTEYfq5q1JtxkJ_H8QR848NaBu3B8V5KuFupCkI-ZbAeA09b29SANUun7bUDTUdtP1JWSjELV2naFhiDPcCThwsFMsuGnbtgaI3TldHazP72RcgxncEm89Ox2itm4fSHxtiy7_-r6J4PQlcuW4Hwoi6z34a9Y9USf1VGotfwEgstpiJYW7ojZX8BW250lnTaUE8wAxfvapaZGKDictWCKXZgEIF')",
            }}
          ></div>
          <div className="relative p-6 lg:p-8 flex flex-col justify-end h-full">
            <div className="max-w-3xl">
               <div className="flex items-center gap-2 text-red-400 font-bold text-xs mb-2 uppercase tracking-wide">
                    {course.category}
                </div>
              <h1 className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight mb-4">
                {course.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{totalDuration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart size={16} />
                  <span>{course.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={16} />
                  <span>English</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw size={16} />
                  <span>Last updated {new Date(course.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col xl:flex-row gap-6 relative items-start">
          
          {/* Main Content Column */}
          <div className="flex-1 min-w-0 w-full space-y-6">
            
            {/* Description */}
            <div className="bg-white border border-gray-200 rounded p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">About this course</h3>
                <div className="prose prose-sm prose-gray max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {course.description || "No description provided."}
                </div>
            </div>
            
             {/* Curriculum List */}
            <div className="bg-white border border-gray-200 rounded p-6">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Course Content</h3>
                    <span className="text-xs text-gray-500 font-medium">
                        {modules.length} Sections • {totalLessons} Lessons
                    </span>
                </div>

                <div className="flex flex-col gap-3">
                    {modules.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded border border-dashed border-gray-300 text-gray-500 text-sm">
                            No content added yet.
                        </div>
                    ) : modules.map((module, moduleIndex) => {
                        const moduleLessons = module.lessons || [];
                        const allLessonsCompleted = moduleLessons.length > 0 && moduleLessons.every(lesson => 
                            completedLessons.includes(lesson._id)
                        );
                        
                        return (
                            <details key={module._id} className="group bg-white rounded overflow-hidden border border-gray-200" open={moduleIndex === 0}>
                                <summary className="flex cursor-pointer items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors select-none">
                                    <div className="flex items-center gap-3">
                                        <div className="transition-transform duration-200 group-open:rotate-180">
                                             <ChevronDown className="text-gray-500" size={18} />
                                        </div>
                                        <span className="font-bold text-gray-900 text-sm">
                                            Section {moduleIndex + 1}: {module.title}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium hidden sm:block">
                                        {moduleLessons.length} lectures
                                    </span>
                                </summary>
                                
                                <div className="border-t border-gray-200">
                                    {moduleLessons.map((lesson, lessonIndex) => {
                                        const isSelected = selectedLesson?._id === lesson._id;
                                        
                                        // Find prev and next lessons
                                        const prevLesson = lessonIndex > 0 ? moduleLessons[lessonIndex - 1] : null;
                                        const nextLesson = lessonIndex < moduleLessons.length - 1 ? moduleLessons[lessonIndex + 1] : null;
                                        
                                        return (
                                            <div key={lesson._id}>
                                                {/* Lesson Item */}
                                                <div 
                                                    onClick={() => {
                                                        if (selectedLesson?._id === lesson._id) {
                                                            setSelectedLesson(null);
                                                        } else {
                                                            setSelectedLesson(lesson);
                                                            if (!completedLessons.includes(lesson._id)) {
                                                                setCompletedLessons([...completedLessons, lesson._id]);
                                                            }
                                                        }
                                                    }}
                                                    className={`flex items-center justify-between px-4 py-3 cursor-pointer border-b border-gray-100 transition-colors ${
                                                        isSelected ? "bg-red-50" : "bg-white hover:bg-gray-50"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {lesson.type === 'VIDEO' ? (
                                                            <PlayCircle size={16} className={isSelected ? "text-red-600" : "text-gray-400"} />
                                                        ) : (
                                                            <FileText size={16} className={isSelected ? "text-red-600" : "text-gray-400"} />
                                                        )}
                                                        <span className={`text-sm font-medium ${isSelected ? "text-red-700" : "text-gray-700"}`}>
                                                            {lesson.title}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3 shrink-0">
                                                        {lesson.isPreview && (
                                                            <span className="text-xs text-red-600 font-medium">
                                                                Preview
                                                            </span>
                                                        )}
                                                        <span className="text-xs text-gray-400">
                                                            {lesson.metadata?.duration ? `${Math.floor(lesson.metadata.duration / 60)}:${(lesson.metadata.duration % 60).toString().padStart(2, '0')}` : '12:00'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Inline Lesson Player */}
                                                {isSelected && (
                                                    <div className="bg-white border-b border-gray-200">
                                                        {/* Player Content */}
                                                        <div className="aspect-video bg-black flex items-center justify-center">
                                                            {lesson.type === "VIDEO" ? (
                                                                getMediaUrl(lesson.contentUrl) ? (
                                                                    <video 
                                                                        key={getMediaUrl(lesson.contentUrl)}
                                                                        controls 
                                                                        className="w-full h-full"
                                                                        src={getMediaUrl(lesson.contentUrl) || ""}
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
                                                                onClick={() => prevLesson && setSelectedLesson(prevLesson)}
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
                                                                onClick={() => nextLesson && setSelectedLesson(nextLesson)}
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
                                    })}
                                    
                                    {/* Module Quiz */}
                                    <div 
                                        className={`flex items-center justify-between px-4 py-3 border-t-2 border-gray-200 transition-colors ${
                                            allLessonsCompleted 
                                                ? "bg-white cursor-pointer hover:bg-gray-50" 
                                                : "bg-gray-50 cursor-not-allowed opacity-60"
                                        }`}
                                        onClick={() => {
                                            if (allLessonsCompleted) {
                                                // TODO: Open quiz modal or navigate to quiz
                                                toast.info("Quiz feature coming soon!");
                                            }
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            {allLessonsCompleted ? (
                                                <BookOpen size={16} className="text-gray-400" />
                                            ) : (
                                                <Lock size={16} className="text-gray-400" />
                                            )}
                                            <div>
                                                <span className={`text-sm font-medium block ${allLessonsCompleted ? "text-gray-700" : "text-gray-500"}`}>
                                                    Module Quiz
                                                </span>
                                                {!allLessonsCompleted && (
                                                    <span className="text-xs text-gray-400">
                                                        Complete all {moduleLessons.length} lessons to unlock
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400">
                                                10 questions
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {(!moduleLessons || moduleLessons.length === 0) && (
                                        <div className="px-4 py-3 text-sm text-gray-400 italic bg-white">
                                            No lessons in this section.
                                        </div>
                                    )}
                                </div>
                            </details>
                        );
                    })}
                </div>
            </div>

          </div>

          {/* Right Sidebar - Sticky */}
          <div className="w-full xl:w-[320px] shrink-0 xl:sticky xl:top-24 space-y-6">
             
             {/* Course Includes & Preview Card (MOVED TO TOP) */}
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
                 {/* Promo Video Header */}
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
                            <div className="flex flex-col items-center gap-2 text-gray-500">
                                <Video size={32} />
                                <span className="text-xs font-medium">No preview available</span>
                            </div>
                         </div>
                     )}
                </div>

                <div className="p-5">
                    <h4 className="font-bold text-gray-900 mb-4 text-sm">Course Includes</h4>
                     <ul className="space-y-3">
                       <li className="flex items-center gap-3 text-sm text-gray-600">
                           <Video size={16} className="text-gray-400" />
                           <span>{totalLessons} video lessons</span>
                       </li>
                        <li className="flex items-center gap-3 text-sm text-gray-600">
                           <Download size={16} className="text-gray-400" />
                           <span>Downloadable resources</span>
                       </li>
                        <li className="flex items-center gap-3 text-sm text-gray-600">
                           <Smartphone size={16} className="text-gray-400" />
                           <span>Access on mobile</span>
                       </li>
                       <li className="flex items-center gap-3 text-sm text-gray-600">
                           <Infinity size={16} className="text-gray-400" />
                           <span>Lifetime access</span>
                       </li>
                     </ul>
                </div>
            </div>

             {/* Stats Card (MOVED BELOW) */}
             <div className="bg-white border border-gray-200 rounded p-5">
                <h4 className="font-bold text-gray-900 mb-4 text-sm">Course Info</h4>
                <div className="space-y-4">
                     <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                        <span className="text-sm text-gray-600 flex items-center gap-2">
                             <Monitor size={16} /> Status
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            course.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                            {course.status}
                        </span>
                    </div>
                    <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                        <span className="text-sm text-gray-600 flex items-center gap-2">
                             <Users size={16} /> Enrollments
                        </span>
                        <span className="text-sm font-bold text-gray-900">0</span>
                    </div>
                     <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 flex items-center gap-2">
                             <Star size={16} /> Rating
                        </span>
                        <span className="text-sm font-bold text-gray-900">4.8 (0)</span>
                    </div>
                </div>
             </div>

          </div>

        </div>
      </div>
      
       {/* Delete Confirmation Modal */}
       <ConfirmDeleteModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleDeleteConfirm}
            title="Delete Course"
            message="Are you sure you want to delete this course? This action cannot be undone."
            isDeleting={isDeleting}
        />
    </>
  );
}

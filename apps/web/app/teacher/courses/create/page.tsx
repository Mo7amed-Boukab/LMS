"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { teacherCourseService } from "@/lib/services/teacher-course.service";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Edit,
  Eye,
  FileText,
  GripVertical,
  Image as ImageIcon,
  Layout,
  List,
  Loader2,
  Plus,
  Save,
  Settings,
  Trash2,
  UploadCloud,
  Video,
  X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const categories = [
  "Design",
  "Development",
  "Marketing",
  "Data Science",
  "Business",
  "Finance",
  "Photography",
  "Music",
  "Personal Development",
  "Health & Fitness",
];
const levels = ["Beginner", "Intermediate", "Advanced", "All Levels"];

// --- Reusable Components for this page ---

function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
}: {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded text-sm text-left focus:ring-1 focus:ring-red-500/20 focus:border-red-300 outline-none transition-all"
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded shadow-lg z-20 py-1 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                  value === option
                    ? "text-red-700 font-medium bg-red-50"
                    : "text-gray-600"
                }`}
              >
                {option}
                {value === option && <Check size={14} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

interface LocalLesson {
  id: string | number;
  title: string;
  type: "VIDEO" | "PDF";
  contentUrl?: string; // Add this
  isUploading?: boolean;
  fileName?: string;
  isPreview?: boolean;
  duration?: number;
  _id?: string; // Backend ID
}

interface LocalSection {
  id: string | number;
  title: string;
  lessons: LocalLesson[];
  _id?: string; // Backend ID
}

export default function CreateCoursePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const [isSaving, setIsSaving] = useState(false);
  const [courseId, setCourseId] = useState<string | null>(null);

  // State for form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [isPublicVisible, setIsPublicVisible] = useState(false);
  const [hasCertificate, setHasCertificate] = useState(true);
  const [thumbnail, setThumbnail] = useState("");
  const [promotionalVideo, setPromotionalVideo] = useState("");
  const [isThumbnailUploading, setIsThumbnailUploading] = useState(false);

  const [sections, setSections] = useState<LocalSection[]>([]);

  // Helper to fix backend URLs if they have the wrong port
  const getMediaUrl = (url?: string) => {
    if (!url) return "";
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    // If URL is absolute but points to port 3000 (backend default), swap it to correct API URL
    if (url.startsWith("http://localhost:3000/")) {
      return url.replace("http://localhost:3000", apiUrl);
    }
    // If it's already absolute or a full URL, return as is
    if (url.startsWith("http")) return url;
    // Otherwise assume it's relative to API
    return `${apiUrl}/${url.startsWith("/") ? url.slice(1) : url}`;
  };

  const handleSave = async (asDraft = true) => {
    if (!title) {
      toast.error("Please enter a course title");
      return;
    }
    if (!category) {
      toast.error("Please select a category");
      return;
    }

    // Frontend Validation for Publishing
    if (!asDraft) {
      if (!description) {
        toast.error("Cannot publish: Description is required.");
        return;
      }
      if (!level) {
        toast.error("Cannot publish: Level is required.");
        return;
      }
      if (!thumbnail) {
        toast.error("Cannot publish: Course thumbnail is required.");
        return;
      }

      if (sections.length === 0) {
        toast.error("Cannot publish: You must add at least one module (section).");
        return;
      }
      
      for (const section of sections) {
         if (section.lessons.length === 0) {
            toast.error(`Cannot publish: Section "${section.title}" has no lessons.`);
            return;
         }
         // Validate lessons have content
         for (const lesson of section.lessons) {
             if (!lesson.contentUrl) { // Check if file is uploaded
                 toast.error(`Cannot publish: Lesson "${lesson.title}" in section "${section.title}" has no content uploaded.`);
                 return;
             }
         }
      }
    }

    setIsSaving(true);
    try {
      let currentCourseId = courseId;
      
      const initialStatus = (asDraft || !currentCourseId) ? "draft" : "published"; 
      
      const courseData = {
        title,
        description,
        category,
        level,
        price,
        isPublicVisible,
        hasCertificate,
        thumbnail,
        promotionalVideo,
        status: initialStatus,
      } as const;

      // 2. Create or Update Course (Initial Step)
      if (!currentCourseId) {
        // Create new course (always as draft first if intend to publish)
        const newCourse = await teacherCourseService.createCourse({
          ...courseData,
          status: "draft" // Force draft for creation
        });
        currentCourseId = newCourse._id;
        setCourseId(newCourse._id);
        if (asDraft) toast.success("Course draft created");
      } else {
        // Update existing course
        // If we are publishing, we defer the status update to AFTER content sync
        const updateData = { ...courseData };
        if (!asDraft) updateData.status = "draft"; // Keep draft while syncing content

        await teacherCourseService.updateCourse(currentCourseId, updateData);
        if (asDraft) toast.success("Course saved");
      }

      // 3. Sync Sections (Modules) & Lessons
      const updatedSections = [...sections];

      for (let i = 0; i < updatedSections.length; i++) {
        const section = updatedSections[i];
        let moduleId = section._id;

        if (!moduleId) {
          // Create Module
          const newModule = await teacherCourseService.createModule({
            courseId: currentCourseId!,
            title: section.title,
            order: i + 1,
          });
          moduleId = newModule._id;
          updatedSections[i]._id = moduleId;
        } else {
          // Update Module
          await teacherCourseService.updateModule(moduleId, {
            title: section.title,
            order: i + 1,
          });
        }

        // Sync Lessons
        const updatedLessons = [...section.lessons];
        for (let j = 0; j < updatedLessons.length; j++) {
          const lesson = updatedLessons[j];
          let lessonId = lesson._id;

          if (!lessonId) {
            // Create Lesson
            const newLesson = await teacherCourseService.createLesson({
              moduleId: moduleId!,
              title: lesson.title,
              type: lesson.type || "VIDEO",
              contentUrl: lesson.contentUrl || "", // No fake default for real usage
              order: j + 1,
              isActive: true,
              isPreview: lesson.isPreview || false,
              metadata: { duration: lesson.duration || 0 },
            });
            lessonId = newLesson._id;
            updatedLessons[j]._id = lessonId;
          } else {
            // Update Lesson
            await teacherCourseService.updateLesson(lessonId, {
              title: lesson.title,
              order: j + 1,
            });
          }
        }
        updatedSections[i].lessons = updatedLessons;
      }

      setSections(updatedSections);

      if (!asDraft) {
        await teacherCourseService.updateCourse(currentCourseId!, {
            status: "published"
        });
        toast.success("Course published successfully!");
        router.push("/teacher/courses");
      }

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to save course");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Uploading thumbnail...");
    setIsThumbnailUploading(true);
    try {
      const result = await teacherCourseService.uploadFile(file, "image");
      setThumbnail(result.url);
      toast.success("Thumbnail uploaded", { id: toastId });
    } catch (error) {
      toast.error("Upload failed", { id: toastId });
    } finally {
      setIsThumbnailUploading(false);
    }
  };

  const addSection = () => {
    setSections([
      ...sections,
      { id: Date.now(), title: "New Section", lessons: [] },
    ]);
  };

  const addLesson = (sectionId: string | number) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            lessons: [
              ...section.lessons,
              { id: Date.now(), title: "New Lesson", type: "VIDEO" },
            ],
          };
        }
        return section;
      })
    );
  };

  const handleLessonUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    sectionIndex: number,
    lessonIndex: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const updatedSections = [...sections];
    const lesson = updatedSections[sectionIndex].lessons[lessonIndex];

    // Update local state to showing uploading
    updatedSections[sectionIndex].lessons[lessonIndex].isUploading = true;
    setSections(updatedSections);

    const toastId = toast.loading("Uploading content...");

    try {
      // Determine upload type based on lesson type
      const uploadType = lesson.type === "PDF" ? "pdf" : "video";
      const result = await teacherCourseService.uploadFile(file, uploadType);

      // Simulate getting video duration if it's a video
      let duration = 0;
      if (uploadType === "video") {
        // Create a temporary video element to get duration
        const video = document.createElement("video");
        video.preload = "metadata";
        video.src = URL.createObjectURL(file);

        await new Promise<void>((resolve) => {
          video.onloadedmetadata = () => {
            duration = video.duration;
            URL.revokeObjectURL(video.src);
            resolve();
          };
          video.onerror = () => resolve(); // fallback
        });
      }

      // Update lesson with URL and filename
      const finalSections = [...sections];
      finalSections[sectionIndex].lessons[lessonIndex].contentUrl = result.url;
      finalSections[sectionIndex].lessons[lessonIndex].fileName =
        result.originalName;
      finalSections[sectionIndex].lessons[lessonIndex].isUploading = false;
      if (duration > 0)
        finalSections[sectionIndex].lessons[lessonIndex].duration = duration;

      setSections(finalSections);

      toast.success("Content uploaded successfully", { id: toastId });
    } catch (error) {
      const errorSections = [...sections];
      errorSections[sectionIndex].lessons[lessonIndex].isUploading = false;
      setSections(errorSections);
      toast.error("Upload failed", { id: toastId });
    }
  };

  return (
    <>
      <DashboardHeader
        title="Create New Course"
        description="Fill in the details to create a new course."
      />

      {/* Main Container */}
      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Actions Bar - Separated from Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <Link
            href="/teacher/courses"
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Courses
          </Link>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500 mr-2">
              {courseId ? "Draft Saved" : "Unsaved"}
            </div>
            <button
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Save Draft
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded font-medium text-sm transition-colors shadow-sm disabled:opacity-50"
            >
              <span>Publish Course</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Tabs - Fixed width */}
          <div className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-6">
            <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              <button
                onClick={() => setActiveTab("basic")}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded whitespace-nowrap transition-colors w-full text-left ${
                  activeTab === "basic"
                    ? "bg-red-50 text-red-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Layout size={18} />
                Basic Information
              </button>
              <button
                onClick={() => setActiveTab("curriculum")}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded whitespace-nowrap transition-colors w-full text-left ${
                  activeTab === "curriculum"
                    ? "bg-red-50 text-red-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <List size={18} />
                Curriculum
              </button>
              <button
                onClick={() => setActiveTab("media")}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded whitespace-nowrap transition-colors w-full text-left ${
                  activeTab === "media"
                    ? "bg-red-50 text-red-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <ImageIcon size={18} />
                Media
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded whitespace-nowrap transition-colors w-full text-left ${
                  activeTab === "settings"
                    ? "bg-red-50 text-red-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Settings size={18} />
                Settings
              </button>
            </nav>
          </div>

          {/* Content Area - Expanded to fill remaining space */}
          <div className="flex-1 w-full">
            <div className="bg-white rounded border border-gray-200 p-6 lg:p-8 min-h-[600px]">
              {/* Basic Information Section */}
              {activeTab === "basic" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="border-b border-gray-100 pb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Basic Information
                    </h3>
                    <p className="text-sm text-gray-500">
                      Provide the fundamental details of your course to get
                      started.
                    </p>
                  </div>

                  <div className="space-y-6 max-w-4xl">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Course Title
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Advanced React Patterns for Senior Developers" // Added explicit value and onChange
                        className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-red-500/20 focus:border-red-300 outline-none transition-all placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Course Description
                      </label>
                      <textarea
                        rows={6}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Write a compelling description that highlights what students will learn..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-red-500/20 focus:border-red-300 outline-none transition-all resize-y placeholder:text-gray-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Category
                        </label>
                        <CustomSelect
                          options={categories}
                          value={category}
                          onChange={setCategory}
                          placeholder="Select a category"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Level
                        </label>
                        <CustomSelect
                          options={levels}
                          value={level}
                          onChange={setLevel}
                          placeholder="Select difficulty level"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Curriculum Section */}
              {activeTab === "curriculum" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="border-b border-gray-100 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Curriculum
                      </h3>
                      <p className="text-sm text-gray-500">
                        Organize your course into sections and lessons.
                      </p>
                    </div>
                    <button
                      onClick={addSection}
                      className="flex items-center gap-2 text-sm font-medium text-red-700 hover:text-red-800 px-4 py-2 rounded transition-colors"
                    >
                      <Plus size={16} /> New Section
                    </button>
                  </div>

                  <div className="space-y-6 max-w-4xl">
                    {sections.map((section, index) => (
                      <div
                        key={section.id}
                        className="border border-gray-200 rounded overflow-hidden bg-gray-50/30"
                      >
                        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="cursor-move text-gray-400 hover:text-gray-600">
                              <GripVertical size={20} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                  Section {index + 1}
                                </span>
                              </div>
                              <input
                                type="text"
                                value={section.title}
                                onChange={(e) => {
                                  const newSections = [...sections];
                                  newSections[index].title = e.target.value;
                                  setSections(newSections);
                                }}
                                className="w-full bg-transparent border-none focus:ring-0 text-base font-bold text-gray-900 p-0 hover:bg-gray-100/50 rounded px-2 -ml-2 transition-colors placeholder:text-gray-300"
                                placeholder={`Enter section title`}
                              />
                            </div>
                          </div>
                          <button
                            onClick={async () => {
                              if (section._id) {
                                try {
                                  await teacherCourseService.deleteModule(
                                    section._id
                                  );
                                  toast.success("Section deleted");
                                } catch (error) {
                                  toast.error("Failed to delete section");
                                  return;
                                }
                              }
                              const newSections = sections.filter(
                                (_, i) => i !== index
                              );
                              setSections(newSections);
                            }}
                            className="text-gray-400 hover:text-red-600 p-2 rounded hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <div className="p-4 space-y-3">
                          {section.lessons.map((lesson, lIndex) => (
                            <div
                              key={lesson.id}
                              className="bg-white border border-gray-200 rounded p-4 group hover:border-gray-300 transition-all"
                            >
                              {/* Lesson Header: Grip, Order, Title, Delete */}
                              <div className="flex items-center gap-4 mb-3">
                                <GripVertical
                                  size={16}
                                  className="text-gray-300 cursor-move"
                                />
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-medium text-gray-500">
                                  {lIndex + 1}
                                </div>
                                <input
                                  type="text"
                                  value={lesson.title}
                                  onChange={(e) => {
                                    const newSections = [...sections];
                                    newSections[index].lessons[lIndex].title =
                                      e.target.value;
                                    setSections(newSections);
                                  }}
                                  placeholder="Enter lesson title"
                                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-700 p-0 hover:bg-gray-50 rounded px-2 -ml-2 transition-colors"
                                />
                                <div className="flex items-center ml-auto">
                                  <button
                                    onClick={async () => {
                                      if (lesson._id) {
                                        try {
                                          await teacherCourseService.deleteLesson(
                                            lesson._id
                                          );
                                          toast.success("Lesson deleted");
                                        } catch (error) {
                                          toast.error(
                                            "Failed to delete lesson"
                                          );
                                          return;
                                        }
                                      }
                                      const newSections = [...sections];
                                      newSections[index].lessons = newSections[
                                        index
                                      ].lessons.filter((_, i) => i !== lIndex);
                                      setSections(newSections);
                                    }}
                                    className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              </div>

                              {/* Lesson Details: Type Selector, Upload, File Info */}
                              <div className="pl-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Type Selector */}
                                <div>
                                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                                    Content Type
                                  </label>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => {
                                        const newSections = [...sections];
                                        newSections[index].lessons[
                                          lIndex
                                        ].type = "VIDEO";
                                        setSections(newSections);
                                      }}
                                      className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded border transition-all ${
                                        lesson.type === "VIDEO"
                                          ? "bg-red-50 border-red-200 text-red-700"
                                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                      }`}
                                    >
                                      <Video size={14} /> Video
                                    </button>
                                    <button
                                      onClick={() => {
                                        const newSections = [...sections];
                                        newSections[index].lessons[
                                          lIndex
                                        ].type = "PDF";
                                        setSections(newSections);
                                      }}
                                      className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded border transition-all ${
                                        lesson.type === "PDF"
                                          ? "bg-red-50 border-red-200 text-red-700"
                                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                      }`}
                                    >
                                      <FileText size={14} /> PDF
                                    </button>
                                  </div>

                                  <div className="mt-3 flex items-center gap-2">
                                    <label className="flex items-center gap-2 text-xs text-gray-600 font-medium cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={lesson.isPreview || false}
                                        onChange={(e) => {
                                          const newSections = [...sections];
                                          newSections[index].lessons[
                                            lIndex
                                          ].isPreview = e.target.checked;
                                          setSections(newSections);
                                        }}
                                        className="rounded border-gray-300 text-red-600 focus:ring-red-500 w-3.5 h-3.5"
                                      />
                                      Free Preview
                                    </label>
                                  </div>
                                </div>

                                {/* File Upload / Info */}
                                <div>
                                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                                    {lesson.type === "VIDEO"
                                      ? "Video Content"
                                      : "PDF Document"}
                                  </label>

                                  {!lesson.contentUrl ? (
                                    <div className="relative">
                                      <input
                                        type="file"
                                        accept={
                                          lesson.type === "VIDEO"
                                            ? "video/*"
                                            : "application/pdf"
                                        }
                                        onChange={(e) =>
                                          handleLessonUpload(e, index, lIndex)
                                        }
                                        disabled={lesson.isUploading}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                      />
                                      <div className="w-full border border-dashed border-gray-300 rounded bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-white hover:border-gray-400 transition-all py-2 px-3 flex items-center justify-center gap-2 text-xs cursor-pointer">
                                        {lesson.isUploading ? (
                                          <>
                                            <Loader2
                                              size={14}
                                              className="animate-spin"
                                            />{" "}
                                            Uploading...
                                          </>
                                        ) : (
                                          <>
                                            <UploadCloud size={14} />
                                            Upload{" "}
                                            {lesson.type === "VIDEO"
                                              ? "Video"
                                              : "PDF"}
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                                      <div className="flex items-center gap-2 truncate">
                                        <Check
                                          size={14}
                                          className="flex-shrink-0"
                                        />
                                        <span className="truncate max-w-[150px]">
                                          {lesson.fileName || "File uploaded"}
                                        </span>
                                        {lesson.duration && (
                                          <span className="text-green-600 text-[10px] ml-1">
                                            ({Math.floor(lesson.duration / 60)}m{" "}
                                            {Math.floor(lesson.duration % 60)}s)
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <a
                                          href={getMediaUrl(lesson.contentUrl)}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="p-1 hover:bg-green-100 rounded text-green-700"
                                          title="View"
                                        >
                                          <Eye size={14} />
                                        </a>
                                        <button
                                          onClick={() => {
                                            const newSections = [...sections];
                                            newSections[index].lessons[
                                              lIndex
                                            ].contentUrl = undefined;
                                            newSections[index].lessons[
                                              lIndex
                                            ].fileName = undefined;
                                            setSections(newSections);
                                          }}
                                          className="p-1 hover:bg-green-100 rounded text-green-700"
                                          title="Remove"
                                        >
                                          <X size={14} />
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={() => addLesson(section.id)}
                            className="w-full py-2.5 border border-dashed border-gray-300 rounded text-sm font-medium text-gray-500 hover:border-gray-400 hover:bg-white hover:text-gray-700 transition-all flex items-center justify-center gap-2 mt-2"
                          >
                            <Plus size={14} /> Add Lesson
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Media Section */}
              {activeTab === "media" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="border-b border-gray-100 pb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Course Media
                    </h3>
                    <p className="text-sm text-gray-500">
                      Upload your course thumbnail and promotional video.
                    </p>
                  </div>

                  <div className="space-y-8 max-w-4xl">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Course Thumbnail
                      </label>
                      <div className="relative group">
                        {!thumbnail ? (
                          <div className="relative border-2 border-dashed border-gray-300 rounded p-10 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer">
                            {isThumbnailUploading ? (
                              <div className="flex flex-col items-center">
                                <Loader2
                                  size={32}
                                  className="text-red-600 animate-spin mb-4"
                                />
                                <p className="text-base font-medium text-gray-900">
                                  Uploading thumbnail...
                                </p>
                              </div>
                            ) : (
                              <>
                                <div className="p-4 bg-gray-100 rounded-full mb-4 group-hover:bg-white group-hover:shadow-sm transition-all">
                                  <UploadCloud
                                    size={32}
                                    className="text-gray-500 group-hover:text-red-600"
                                  />
                                </div>
                                <p className="text-base font-medium text-gray-900 mb-1">
                                  Click to upload or drag and drop
                                </p>
                                <p className="text-sm text-gray-500">
                                  SVG, PNG, JPG or GIF (max. 800x600px)
                                </p>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50 aspect-video max-w-2xl">
                            <img
                              src={getMediaUrl(thumbnail)}
                              alt="Thumbnail preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                              <button
                                onClick={() => setThumbnail("")}
                                className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all"
                                title="Remove"
                              >
                                <Trash2 size={20} />
                              </button>
                              <label
                                className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white cursor-pointer transition-all"
                                title="Change"
                              >
                                <Edit size={20} />
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Promotional Video
                      </label>
                      <div className="border border-gray-200 rounded p-6 bg-gray-50/50">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <input
                            type="text"
                            value={promotionalVideo}
                            onChange={(e) =>
                              setPromotionalVideo(e.target.value)
                            }
                            placeholder="Paste video URL (e.g. YouTube, Vimeo)"
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-red-500/20 focus:border-red-300 outline-none"
                          />
                          <button className="px-5 py-2.5 bg-white border border-gray-200 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
                            Preview Video
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Section */}
              {activeTab === "settings" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="border-b border-gray-100 pb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Course Settings
                    </h3>
                    <p className="text-sm text-gray-500">
                      Configure pricing, visibility, and enrollment settings.
                    </p>
                  </div>

                  <div className="space-y-8 max-w-4xl">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Regular Price ($)
                      </label>
                      <div className="relative max-w-xs">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                          $
                        </span>
                        <input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(Number(e.target.value))}
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-red-500/20 focus:border-red-300 outline-none transition-all"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Leave blank or set to 0 for free courses.
                      </p>
                    </div>

                    <div className="border-t border-gray-100"></div>

                    <div className="space-y-6">
                      <div className="flex items-start justify-between p-4 border border-gray-200 rounded hover:border-gray-300 transition-colors bg-white">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 mb-1">
                            Public visibility
                          </h4>
                          <p className="text-xs text-gray-500 max-w-md">
                            Make this course visible to everyone in the
                            catalogue and search results.
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer mt-1">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isPublicVisible}
                            onChange={(e) =>
                              setIsPublicVisible(e.target.checked)
                            }
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-700"></div>
                        </label>
                      </div>

                      <div className="flex items-start justify-between p-4 border border-gray-200 rounded hover:border-gray-300 transition-colors bg-white">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 mb-1">
                            Certificate of completion
                          </h4>
                          <p className="text-xs text-gray-500 max-w-md">
                            Issue certificates automatically to students upon
                            successful completion.
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer mt-1">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={hasCertificate}
                            onChange={(e) =>
                              setHasCertificate(e.target.checked)
                            }
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-700"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import {
  Save,
  ArrowLeft,
  Layout,
  List,
  Settings,
  Image as ImageIcon,
  Plus,
  GripVertical,
  X,
  UploadCloud,
  ChevronDown,
  Eye,
  Check,
  Trash2,
  Edit,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useCourseEditor } from "@/context/Course-editor-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { teacherCourseService } from "@/lib/services/teacher-course.service";

const categories = [
  "Design",
  "Development",
  "Marketing",
  "Data Science",
  "Business",
  "Finance",
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

export default function CourseEditor() {
  const {
    course,
    modules,
    isLoading,
    isSaving,
    updateCourse,
    createModule,
    updateModule,
    deleteModule,
    createLesson,
    updateLesson,
    deleteLesson,
  } = useCourseEditor();

  const [activeTab, setActiveTab] = useState("basic");
  const router = useRouter();

  if (isLoading || !course) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-red-600" size={32} />
      </div>
    );
  }

  const handlePublish = async () => {
    if (!course.title || modules.length === 0) {
      toast.error(
        "Please add a title and at least one module before publishing."
      );
      return;
    }

    if (
      confirm(
        "Are you sure you want to publish this course? It will be visible to students."
      )
    ) {
      await updateCourse({ status: "published" });
      router.push("/teacher/courses");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await teacherCourseService.uploadFile(file, "image");
      await updateCourse({ thumbnail: result.url });
      toast.success("Thumbnail uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload thumbnail");
    }
  };

  return (
    <>
      <DashboardHeader
        title={`Edit Course: ${course.title}`}
        description="Manage your course content and settings."
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
            <div className="flex items-center gap-2 text-sm text-gray-500 mr-4">
              {isSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={14} className="text-green-500" />
                  Saved
                </>
              )}
            </div>

            <button
              onClick={handlePublish}
              className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded font-medium text-sm transition-colors shadow-sm"
            >
              <span>
                {course.status === "published"
                  ? "Update Course"
                  : "Publish Course"}
              </span>
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
                      Provide the fundamental details of your course.
                    </p>
                  </div>

                  <div className="space-y-6 max-w-4xl">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Course Title
                      </label>
                      <input
                        type="text"
                        value={course.title}
                        onChange={(e) =>
                          updateCourse({ title: e.target.value })
                        }
                        placeholder="e.g. Advanced React Patterns"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-red-500/20 focus:border-red-300 outline-none transition-all placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Course Description
                      </label>
                      <textarea
                        rows={6}
                        value={course.description || ""}
                        onChange={(e) =>
                          updateCourse({ description: e.target.value })
                        }
                        placeholder="Write a compelling description..."
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
                          value={course.category}
                          onChange={(val) => updateCourse({ category: val })}
                          placeholder="Select a category"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Level
                        </label>
                        <CustomSelect
                          options={levels}
                          value={course.level}
                          onChange={(val) => updateCourse({ level: val })}
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
                      onClick={() => createModule({ title: "New Section" })}
                      className="flex items-center gap-2 text-sm font-medium text-red-700 hover:text-red-800 px-4 py-2 rounded transition-colors"
                    >
                      <Plus size={16} /> New Section
                    </button>
                  </div>

                  <div className="space-y-6 max-w-4xl">
                    {modules.map((module, index) => (
                      <div
                        key={module._id}
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
                                defaultValue={module.title}
                                onBlur={(e) => {
                                  if (e.target.value !== module.title) {
                                    updateModule(module._id, {
                                      title: e.target.value,
                                    });
                                  }
                                }}
                                className="w-full bg-transparent border-none text-base font-bold text-gray-900 focus:ring-0 p-0 hover:underline decoration-dashed decoration-gray-300 underline-offset-4 transition-all"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => deleteModule(module._id)}
                            className="text-gray-400 hover:text-red-600 p-2 rounded hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <div className="p-4 space-y-3">
                          {module.lessons?.map((lesson, lIndex) => (
                            <div
                              key={lesson._id}
                              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded group hover:border-gray-300 transition-all"
                            >
                              <div className="flex items-center gap-4 w-full">
                                <GripVertical
                                  size={16}
                                  className="text-gray-300 cursor-move"
                                />
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-medium text-gray-500">
                                  {lIndex + 1}
                                </div>
                                <input
                                  type="text"
                                  defaultValue={lesson.title}
                                  onBlur={(e) => {
                                    if (e.target.value !== lesson.title) {
                                      updateLesson(lesson._id, {
                                        title: e.target.value,
                                      });
                                    }
                                  }}
                                  className="flex-1 bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 p-0"
                                />
                                <span className="text-xs text-gray-400 uppercase border px-1 rounded">
                                  {lesson.type}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100">
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={() => deleteLesson(lesson._id)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() =>
                                createLesson(module._id, {
                                  title: "New Video Lesson",
                                  type: "VIDEO",
                                  contentUrl: "",
                                })
                              }
                              className="flex-1 py-2.5 border border-dashed border-gray-300 rounded text-sm font-medium text-gray-500 hover:border-gray-400 hover:bg-white hover:text-gray-700 transition-all flex items-center justify-center gap-2"
                            >
                              <Plus size={14} /> Add Video
                            </button>
                            <button
                              onClick={() =>
                                createLesson(module._id, {
                                  title: "New PDF Lesson",
                                  type: "PDF",
                                  contentUrl: "",
                                })
                              }
                              className="flex-1 py-2.5 border border-dashed border-gray-300 rounded text-sm font-medium text-gray-500 hover:border-gray-400 hover:bg-white hover:text-gray-700 transition-all flex items-center justify-center gap-2"
                            >
                              <Plus size={14} /> Add PDF
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {modules.length === 0 && (
                      <div className="text-center py-10 text-gray-500 bg-gray-50 rounded border border-dashed border-gray-300">
                        No sections yet. Click New Section to start building
                        your curriculum.
                      </div>
                    )}
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
                      <div className="relative border-2 border-dashed border-gray-300 rounded p-10 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt="Thumbnail"
                            className="max-h-64 object-cover rounded shadow-sm"
                          />
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
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Promotional Video URL
                      </label>
                      <div className="border border-gray-200 rounded p-6 bg-gray-50/50">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <input
                            type="text"
                            value={course.promotionalVideo || ""}
                            onChange={(e) =>
                              updateCourse({ promotionalVideo: e.target.value })
                            }
                            placeholder="Paste video URL (e.g. YouTube, Vimeo)"
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-red-500/20 focus:border-red-300 outline-none"
                          />
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
                          value={course.price || 0}
                          onChange={(e) =>
                            updateCourse({ price: Number(e.target.value) })
                          }
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
                            checked={course.isPublicVisible}
                            onChange={(e) =>
                              updateCourse({
                                isPublicVisible: e.target.checked,
                              })
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
                            checked={course.hasCertificate}
                            onChange={(e) =>
                              updateCourse({ hasCertificate: e.target.checked })
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

"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import { quizApi } from "@/lib/services/quizService";
import { Quiz } from "@/lib/types/quiz";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  HelpCircle,
  LayoutDashboard,
  Loader2,
  Trash2,
  Trophy
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

export default function QuizDetailsPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = use(params);
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const data = await quizApi.getById(quizId);
        setQuiz(data);
      } catch (error) {
        toast.error("Failed to load quiz details");
        console.error(error);
        router.push("/teacher/quizzes");
      } finally {
        setIsLoading(false);
      }
    }
    fetchQuiz();
  }, [quizId, router]);

  const handleDeleteConfirm = async () => {
    if (!quizId) return;
    setIsDeleting(true);
    try {
      await quizApi.delete(quizId);
      toast.success("Quiz deleted successfully");
      router.push("/teacher/quizzes");
    } catch (error: any) {
      console.error("Failed to delete quiz:", error);
      toast.error(error.message || "Failed to delete quiz");
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  if (isLoading || !quiz) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-red-700" size={32} />
      </div>
    );
  }

  // Helper to safely get module title
  const getModuleTitle = () => {
      // Logic to handle populated vs unpopulated
      if (typeof quiz.moduleId === 'object' && quiz.moduleId !== null && 'title' in quiz.moduleId) {
          return (quiz.moduleId as any).title;
      }
      return "Linked Module";
  };

  return (
    <>
      <DashboardHeader
        title="Quiz Details"
        description="Review quiz content and settings."
      />

      <div className="p-6 max-w-[1600px] mx-auto space-y-8">
        {/* Navigation & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <Link
            href="/teacher/quizzes"
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Quizzes
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded font-medium text-sm transition-colors"
            >
              <Trash2 size={16} />
              Delete
            </button>
            <Link href={`/teacher/quizzes/${quizId}/edit`}>
              <button className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded font-medium text-sm transition-colors shadow-sm">
                <Edit size={16} />
                <span>Edit Quiz</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Top Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {/* Title Card */}
            <div className="md:col-span-2 bg-white rounded border border-gray-200 p-6 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        quiz.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                        {quiz.status}
                    </span>
                    <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                        {getModuleTitle()}
                    </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1 leading-tight">{quiz.title}</h1>
                <p className="text-gray-500 text-sm">
                   Created on {new Date(quiz.createdAt || Date.now()).toLocaleDateString()}
                </p>
            </div>

            {/* Stats */}
             <div className="bg-white rounded border border-gray-200 p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                    <Trophy size={24} />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Passing Score</p>
                    <p className="text-2xl font-bold text-gray-900">{quiz.passingScore}%</p>
                </div>
            </div>

            <div className="bg-white rounded border border-gray-200 p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <HelpCircle size={24} />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Total Questions</p>
                    <p className="text-2xl font-bold text-gray-900">{quiz.questions.length}</p>
                </div>
            </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Questions List */}
            <div className="flex-1 w-full space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <BookOpen size={20} className="text-gray-400" />
                        Questions Preview
                    </h2>
                </div>

                {quiz.questions.length === 0 ? (
                    <div className="bg-gray-50 rounded border border-dashed border-gray-300 p-12 text-center text-gray-500">
                        No questions added yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {quiz.questions.map((question, index) => (
                            <div key={question._id || index} className="bg-white border border-gray-200 rounded overflow-hidden">
                                <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs font-bold flex items-center justify-center mt-0.5">
                                        {index + 1}
                                    </span>
                                    <div>
                                         <h3 className="text-gray-900 font-medium text-sm leading-relaxed">
                                            {question.text}
                                         </h3>
                                         <div className="mt-1">
                                             <span className="text-[10px] font-bold uppercase text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                                 {question.type}
                                             </span>
                                         </div>
                                    </div>
                                </div>
                                <div className="p-4 space-y-2">
                                    {question.options.map((option, optIndex) => (
                                        <div 
                                            key={optIndex} 
                                            className={`flex items-start gap-3 p-2 rounded text-sm ${
                                                option.isCorrect 
                                                ? "bg-green-50 text-green-800 border border-green-100" // Keep green for read-only view as it signifies "Correct" state universally
                                                : "text-gray-600 pl-4" // minimal indentation for normal options
                                            }`}
                                        >
                                            {option.isCorrect ? (
                                                <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                                            ) : (
                                                <div className="w-4 h-4 rounded-full border border-gray-300 mt-0.5 flex-shrink-0" />
                                            )}
                                            <span className={option.isCorrect ? "font-medium" : ""}>
                                                {option.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Sidebar Details (Settings Preview) */}
            <div className="w-full lg:w-80 shrink-0 space-y-6">
                 <div className="bg-white border border-gray-200 rounded p-5">
                    <h3 className="font-bold text-gray-900 mb-4 text-sm flex items-center gap-2">
                        <LayoutDashboard size={16} className="text-gray-400" />
                        Configuration
                    </h3>
                    
                    <div className="space-y-4">
                         <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                            <span className="text-sm text-gray-600 flex items-center gap-2">
                                <Clock size={14} /> Time Limit
                            </span>
                            <span className="text-sm font-medium text-gray-900">{quiz.timeLimit ? `${quiz.timeLimit} mins` : "No Limit"}</span>
                        </div>
                         <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 flex items-center gap-2">
                                <Calendar size={14} /> Last Updated
                            </span>
                             <span className="text-sm font-medium text-gray-900">
                                {new Date(quiz.updatedAt || Date.now()).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                 </div>
                 
                 <div className="bg-blue-50 border border-blue-100 rounded p-4">
                     <div className="flex gap-3">
                         <div className="mt-1">
                             <HelpCircle size={18} className="text-blue-600" />
                         </div>
                         <div>
                             <h4 className="text-sm font-bold text-blue-800 mb-1">Student View</h4>
                             <p className="text-xs text-blue-600 leading-relaxed">
                                 The settings shown here are currently placeholders. In the future, these will control the actual quiz behavior for students.
                             </p>
                         </div>
                     </div>
                 </div>
            </div>

        </div>

      </div>

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Quiz"
        message="Are you sure you want to delete this quiz? This action will permanently remove it and all student attempts associated with it."
        isDeleting={isDeleting}
      />
    </>
  );
}

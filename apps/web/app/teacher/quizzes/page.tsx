"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import { quizApi } from "@/lib/services/quizService";
import { Quiz } from "@/lib/types/quiz";
import {
    Check,
    ChevronDown,
    Edit,
    Eye,
    Loader2,
    MoreVertical,
    Plus,
    Search,
    Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const statuses = ["All Status", "PUBLISHED", "DRAFT"];

// --- Components ---

function CustomDropdown({
  options,
  value,
  onChange,
  minWidth = "min-w-[140px]",
}: {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  minWidth?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${minWidth}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded text-sm text-gray-700 hover:border-gray-300 transition-colors"
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded shadow-lg z-50 py-1 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                value === option
                  ? "text-red-600 font-medium bg-red-50"
                  : "text-gray-600"
              }`}
            >
              {option === "PUBLISHED" ? "Published" : option === "DRAFT" ? "Draft" : option}
              {value === option && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ActionMenu({ quizId }: { quizId: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="text-gray-400 hover:text-gray-600 p-1.5 rounded-md hover:bg-gray-100 transition-colors"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: `${menuPosition.top}px`,
              right: `${menuPosition.right}px`,
            }}
            className="w-40 bg-white border border-gray-100 rounded-md shadow-lg z-50 py-1.5 px-1"
          >
            <button
              onClick={() => {
                router.push(`/teacher/quizzes/${quizId}`);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md flex items-center gap-3 transition-colors"
            >
              <Eye size={16} /> View
            </button>
            <button
              onClick={() => {
                router.push(`/teacher/quizzes/${quizId}/edit`);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md flex items-center gap-3 transition-colors"
            >
              <Edit size={16} /> Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const deleteEvent = new CustomEvent("delete-quiz", {
                  detail: { quizId },
                });
                window.dispatchEvent(deleteEvent);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md flex items-center gap-3 transition-colors"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default function QuizzesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    const handleDeleteQuiz = (event: Event) => {
      const customEvent = event as CustomEvent<{ quizId: string }>;
      setQuizToDelete(customEvent.detail.quizId);
      setDeleteModalOpen(true);
    };

    window.addEventListener("delete-quiz", handleDeleteQuiz);
    return () => window.removeEventListener("delete-quiz", handleDeleteQuiz);
  }, []);

  const fetchQuizzes = async () => {
    try {
      setIsLoading(true);
      const data = await quizApi.getAll();
      setQuizzes(data);
    } catch (error: any) {
      console.error("Failed to fetch quizzes:", error);
      toast.error(error.message || "Failed to load quizzes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!quizToDelete) return;

    setIsDeleting(true);
    try {
      await quizApi.delete(quizToDelete);
      toast.success("Quiz deleted successfully");
      setQuizzes(quizzes.filter((q) => q._id !== quizToDelete));
      setDeleteModalOpen(false);
      setQuizToDelete(null);
    } catch (error: any) {
      console.error("Failed to delete quiz:", error);
      toast.error(error.message || "Failed to delete quiz");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = quiz.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "All Status" || quiz.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusDisplay = (status: string) => {
    if (status === "PUBLISHED") return "Published";
    if (status === "DRAFT") return "Draft";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "text-green-700 bg-green-50";
      case "DRAFT":
        return "text-gray-700 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <>
      <DashboardHeader
        title="Quizzes"
        description="Manage your quizzes and assessments."
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded text-sm focus:ring-1 focus:ring-red-500/20 focus:border-red-300 outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            <CustomDropdown
              options={statuses}
              value={selectedStatus === "PUBLISHED" ? "Published" : selectedStatus === "DRAFT" ? "Draft" : selectedStatus}
              onChange={(val) => setSelectedStatus(val === "Published" ? "PUBLISHED" : val === "Draft" ? "DRAFT" : val)}
              minWidth="w-full sm:w-40"
            />
          </div>

          <Link href="/teacher/quizzes/create">
            <button className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-sm font-medium text-sm transition-colors shadow-sm w-full md:w-auto justify-center">
              <Plus size={16} />
              <span>Create Quiz</span>
            </button>
          </Link>
        </div>

        <div className="bg-white rounded-md border border-gray-100 min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-red-600" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Quiz Title
                      </th>
                      <th className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Module
                      </th>
                      <th className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Passing Score
                      </th>
                      <th className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Questions
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
                    {filteredQuizzes.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center">
                          <p className="text-sm text-gray-500">
                            No quizzes found. Create your first quiz!
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredQuizzes.map((quiz) => (
                        <tr
                          key={quiz._id}
                          className="hover:bg-gray-50/50 transition-colors group"
                        >
                          <td className="py-4 px-5">
                            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                              {quiz.title}
                            </h4>
                            <span className="text-xs text-gray-400">
                              ID: #{quiz._id.slice(-6)}
                            </span>
                          </td>
                          <td className="py-4 px-5">
                            <span className="text-sm text-gray-600">
                              {quiz.moduleId?.title || "Unknown Module"}
                            </span>
                          </td>
                          <td className="py-4 px-5">
                            <span className="text-sm font-medium text-gray-900">
                              {quiz.passingScore}%
                            </span>
                          </td>
                          <td className="py-4 px-5">
                            <span className="text-sm text-gray-600">
                              {quiz.questions?.length || 0}
                            </span>
                          </td>
                          <td className="py-4 px-5">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                quiz.status
                              )}`}
                            >
                              {getStatusDisplay(quiz.status)}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <ActionMenu quizId={quiz._id} />
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Showing {filteredQuizzes.length} of {quizzes.length} quizzes
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setQuizToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Quiz"
        message="Are you sure you want to delete this quiz? This action cannot be undone."
        isDeleting={isDeleting}
      />
    </>
  );
}


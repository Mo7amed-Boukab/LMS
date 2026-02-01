"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { quizApi } from "@/lib/services/quizService";
import { teacherCourseService } from "@/lib/services/teacher-course.service";
import { CreateQuizDto, QuestionType } from "@/lib/types/quiz";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Clock,
  Layout,
  List,
  Loader2,
  Plus,
  Save,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

// --- Components ---

function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded text-sm text-left focus:ring-1 focus:ring-red-500/20 focus:border-red-300 outline-none transition-all"
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {selectedLabel || placeholder}
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
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded shadow-lg z-20 py-1 max-h-60 overflow-y-auto w-full">
            {options.length === 0 ? (
                 <div className="px-4 py-2 text-sm text-gray-500">No options available</div>
            ) : (
                options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                    value === option.value
                        ? "text-red-700 font-medium bg-red-50"
                        : "text-gray-600"
                    }`}
                >
                    <span className="truncate">{option.label}</span>
                    {value === option.value && <Check size={14} className="flex-shrink-0 ml-2" />}
                </button>
                ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Local Interfaces for State
interface LocalOption {
  text: string;
  isCorrect: boolean;
}

interface LocalQuestion {
  id: string | number;
  text: string;
  type: QuestionType;
  options: LocalOption[];
  _id?: string;
}

export default function EditQuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId: paramQuizId } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quizId, setQuizId] = useState<string | null>(paramQuizId);

  // Form State
  const [title, setTitle] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [passingScore, setPassingScore] = useState(70);
  const [questions, setQuestions] = useState<LocalQuestion[]>([]);

  // Settings State
  const [timeLimit, setTimeLimit] = useState(30);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [showResults, setShowResults] = useState(true);

  // Metadata State
  const [availableModules, setAvailableModules] = useState<{ label: string; value: string }[]>([]);
  const [isLoadingModules, setIsLoadingModules] = useState(true);

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
        try {
            // 1. Fetch Modules
            const courses = await teacherCourseService.getAllCourses();
            const moduleOptions: { label: string; value: string }[] = [];
            
            await Promise.all(courses.map(async (course) => {
                try {
                    const modules = await teacherCourseService.getModulesByCourse(course._id);
                    modules.forEach(mod => {
                        moduleOptions.push({
                            label: `${course.title} > ${mod.title}`,
                            value: mod._id
                        });
                    });
                } catch (e) {
                   // ignore
                }
            }));
            setAvailableModules(moduleOptions);
            setIsLoadingModules(false);

            // 2. Fetch Quiz Data
            if (paramQuizId) {
                const quiz = await quizApi.getById(paramQuizId);
                setTitle(quiz.title);
                // Handle different shapes of moduleId if populated
                if (typeof quiz.moduleId === 'object' && quiz.moduleId !== null && '_id' in quiz.moduleId) {
                     setModuleId((quiz.moduleId as any)._id);
                } else {
                     setModuleId(quiz.moduleId as unknown as string);
                }
                
                setPassingScore(quiz.passingScore);
                setTimeLimit(quiz.timeLimit || 0);
                setShuffleQuestions(quiz.shuffleQuestions || false);
                setShowResults(quiz.showResultsImmediately ?? true);
                
                // Map questions
                const mappedQuestions: LocalQuestion[] = quiz.questions.map(q => ({
                    id: q._id!, // Use backend ID
                    _id: q._id,
                    text: q.text,
                    type: q.type,
                    options: q.options.map(o => ({
                        text: o.text,
                        isCorrect: o.isCorrect
                    }))
                }));
                setQuestions(mappedQuestions);
            }

        } catch (error) {
            console.error("Failed to load data", error);
            toast.error("Failed to load quiz data");
            // router.push("/teacher/quizzes");
        } finally {
            setIsLoading(false);
        }
    };
    
    fetchData();
  }, [paramQuizId, router]);


  const handleSave = async (publish = false) => {
    if (!title.trim()) {
      toast.error("Please enter a quiz title");
      return;
    }
    if (!moduleId.trim()) {
      toast.error("Please select a module");
      return;
    }

    setIsSaving(true);
    try {
      // 1. Update Quiz
      const quizData: Partial<CreateQuizDto> = {
        title,
        moduleId,
        passingScore,
        timeLimit,
        shuffleQuestions,
        showResultsImmediately: showResults,
      };

      await quizApi.update(quizId!, quizData);
      toast.success("Quiz settings saved!");

      // 2. Sync Questions
      // IMPORTANT: In a real app, strict diffing is needed.
      // Here, we re-verify all questions.
      
      const updatedQuestions = [...questions];

      for (let i = 0; i < updatedQuestions.length; i++) {
        const q = updatedQuestions[i];
        
        if (!q.text.trim()) continue; 
        if (q.options.length < 2) continue; 

        const questionData = {
          text: q.text,
          type: q.type,
          options: q.options,
        };

        if (q._id) {
          // Update existing
          await quizApi.updateQuestion(quizId!, q._id, questionData);
        } else {
          // Add new question that was added in UI
          const newQ = await quizApi.addQuestion(quizId!, questionData);
          updatedQuestions[i]._id = newQ._id;
          updatedQuestions[i].id = newQ._id; 
        }
      }
      setQuestions(updatedQuestions);

      if (publish) {
        await quizApi.publish(quizId!);
        toast.success("Quiz published!");
        router.push("/teacher/quizzes");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to save quiz");
    } finally {
      setIsSaving(false);
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        text: "",
        type: QuestionType.QCM,
        options: [
          { text: "Option 1", isCorrect: true },
          { text: "Option 2", isCorrect: false },
        ],
      },
    ]);
  };

  const updateQuestion = (index: number, field: keyof LocalQuestion, value: any) => {
    const newQuestions = [...questions];
    (newQuestions[index] as any)[field] = value;
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex: number, oIndex: number, field: keyof LocalOption, value: any) => {
    const newQuestions = [...questions];
    (newQuestions[qIndex].options[oIndex] as any)[field] = value;
    setQuestions(newQuestions);
  };

  const addOption = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push({ text: `Option ${newQuestions[qIndex].options.length + 1}`, isCorrect: false });
    setQuestions(newQuestions);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, i) => i !== oIndex);
    setQuestions(newQuestions);
  };
    
  const removeQuestion = async (index: number) => {
      const question = questions[index];
      if (question._id) {
          try {
             await quizApi.deleteQuestion(quizId!, question._id);
             toast.success("Question deleted");
          } catch (e) {
              toast.error("Failed to delete question");
              return;
          }
      }
      setQuestions(questions.filter((_, i) => i !== index));
  }
  
  if (isLoading) {
      return (
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 size={32} className="animate-spin text-red-700" />
          </div>
      )
  }

  return (
    <>
      <DashboardHeader
        title="Edit Quiz"
        description="Update your quiz questions and settings."
      />

      {/* Main Container */}
      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <Link
            href="/teacher/quizzes"
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Quizzes
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Save Changes
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded font-medium text-sm transition-colors shadow-sm disabled:opacity-50"
            >
              <span>Update & Publish</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Tabs */}
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
                onClick={() => setActiveTab("questions")}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded whitespace-nowrap transition-colors w-full text-left ${
                  activeTab === "questions"
                    ? "bg-red-50 text-red-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <List size={18} />
                Questions
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

          {/* Content Area */}
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
                      Edit the basic details of the quiz.
                    </p>
                  </div>

                  <div className="space-y-6 max-w-2xl">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Quiz Title
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Final Assessment - React Fundamentals"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-red-500/20 focus:border-red-300 outline-none transition-all placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Linked Module
                      </label>
                      {isLoadingModules ? (
                          <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm text-gray-400 flex items-center gap-2">
                              <Loader2 size={14} className="animate-spin" />
                              Loading modules...
                          </div>
                      ) : (
                        <CustomSelect 
                            options={availableModules}
                            value={moduleId}
                            onChange={setModuleId}
                            placeholder="Select a module to link..."
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Passing Score (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={passingScore}
                        onChange={(e) => setPassingScore(Number(e.target.value))}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-red-500/20 focus:border-red-300 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Questions Section */}
              {activeTab === "questions" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="border-b border-gray-100 pb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Questions
                      </h3>
                      <p className="text-sm text-gray-500">
                        Add and manage questions for this quiz.
                      </p>
                    </div>
                    <button
                      onClick={addQuestion}
                      className="flex items-center gap-2 text-sm font-medium text-red-700 hover:text-red-800 px-4 py-2 rounded transition-colors bg-red-50 hover:bg-red-100"
                    >
                      <Plus size={16} /> Add Question
                    </button>
                  </div>

                  <div className="space-y-6">
                    {questions.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded border border-dashed border-gray-300">
                        <p className="text-gray-500 mb-2">No questions added yet.</p>
                        <button onClick={addQuestion} className="text-red-700 font-medium hover:underline">
                            Add your first question
                        </button>
                      </div>
                    ) : (
                      questions.map((question, qIndex) => (
                        <div
                          key={question.id}
                          className="border border-gray-200 rounded overflow-hidden bg-gray-50/50"
                        >
                          {/* Question Header */}
                          <div className="p-4 flex items-start gap-4 bg-white border-b border-gray-100">
                            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-bold text-gray-500 mt-2">
                              {qIndex + 1}
                            </span>
                            <div className="flex-1 space-y-3">
                                <div className="flex gap-4">
                                     <input
                                        type="text"
                                        value={question.text}
                                        onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
                                        placeholder="Enter question text..."
                                        className="flex-1 px-3 py-2 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-red-500/20 focus:border-red-300 outline-none transition-all font-medium"
                                    />
                                    <div className="w-40">
                                         <CustomSelect
                                            options={[
                                                { label: "QCM", value: QuestionType.QCM },
                                                { label: "True/False", value: QuestionType.VRAI_FAUX }
                                            ]}
                                            value={question.type}
                                            onChange={(val) => updateQuestion(qIndex, "type", val)}
                                         />
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => removeQuestion(qIndex)}
                                className="text-gray-400 hover:text-red-600 p-2 rounded hover:bg-red-50 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                          </div>

                          {/* Options Area */}
                          <div className="p-4 pl-14 space-y-3">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Answer Options
                            </label>
                            
                            <div className="space-y-2">
                                {question.options.map((option, oIndex) => (
                                    <div key={oIndex} className="flex items-center gap-3">
                                        <button
                                            onClick={() => updateOption(qIndex, oIndex, "isCorrect", !option.isCorrect)}
                                            className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                                option.isCorrect 
                                                ? "bg-red-600 border-red-600 text-white shadow-sm"  // Red instead of Green
                                                : "bg-white border-gray-300 text-transparent hover:border-red-400"
                                            }`}
                                        >
                                            <Check size={12} strokeWidth={3} />
                                        </button>
                                        <input
                                            type="text"
                                            value={option.text}
                                            onChange={(e) => updateOption(qIndex, oIndex, "text", e.target.value)}
                                            placeholder={`Option ${oIndex + 1}`}
                                            className={`flex-1 px-3 py-1.5 border rounded text-sm focus:ring-1 focus:outline-none transition-all ${
                                                option.isCorrect
                                                ? "border-red-200 bg-red-50/50 focus:border-red-400 focus:ring-red-500/10" // Red instead of Green
                                                : "border-gray-200 bg-white focus:border-red-400 focus:ring-red-500/10"
                                            }`}
                                        />
                                        <button 
                                            onClick={() => removeOption(qIndex, oIndex)}
                                            className="text-gray-300 hover:text-red-500 p-1"
                                            disabled={question.options.length <= 2}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            
                            <button
                                onClick={() => addOption(qIndex)}
                                className="mt-2 text-xs font-medium text-red-600 hover:text-red-700 flex items-center gap-1"
                            >
                                <Plus size={12} /> Add Option
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Settings Section */}
              {activeTab === "settings" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="border-b border-gray-100 pb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Quiz Settings
                        </h3>
                        <p className="text-sm text-gray-500">
                            Configure advanced options for this quiz.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                         {/* Time Limit */}
                         <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock size={18} className="text-gray-400" />
                                <label className="text-sm font-semibold text-gray-700">Time Limit</label>
                            </div>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="number" 
                                    value={timeLimit}
                                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                                    className="w-24 px-3 py-2 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-red-500/20 focus:border-red-300 outline-none"
                                />
                                <span className="text-sm text-gray-500">minutes</span>
                            </div>
                            <p className="text-xs text-gray-400">Set to 0 for no time limit.</p>
                         </div>

                         {/* Shuffle Questions */}
                         <div className="space-y-4">
                             <div className="flex items-start gap-3">
                                <input 
                                    type="checkbox" 
                                    id="shuffle"
                                    checked={shuffleQuestions}
                                    onChange={(e) => setShuffleQuestions(e.target.checked)}
                                    className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                />
                                <div>
                                    <label htmlFor="shuffle" className="text-sm font-semibold text-gray-700 block">Shuffle Questions</label>
                                    <p className="text-xs text-gray-500 mt-1">Randomize the order of questions for each student attempt.</p>
                                </div>
                             </div>
                         </div>

                         {/* Show Results */}
                         <div className="space-y-4">
                             <div className="flex items-start gap-3">
                                <input 
                                    type="checkbox" 
                                    id="results"
                                    checked={showResults}
                                    onChange={(e) => setShowResults(e.target.checked)}
                                    className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                />
                                <div>
                                    <label htmlFor="results" className="text-sm font-semibold text-gray-700 block">Show Results Immediately</label>
                                    <p className="text-xs text-gray-500 mt-1">Allow students to see their score and correct answers immediately after submission.</p>
                                </div>
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

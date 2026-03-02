"use client";

import ConfirmModal from "@/components/modals/ConfirmModal";
import { apiClient } from "@/lib/api-client";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Info,
  List,
  Timer,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface QuizClientProps {
  quiz: any;
  quizId: string;
}

export default function QuizClient({ quiz, quizId }: QuizClientProps) {
  const router = useRouter();
  const [hasStarted, setHasStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState((quiz.timeLimit || 15) * 60);

  // Modal state
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Load saved progress
  useEffect(() => {
    const savedAnswers = localStorage.getItem(`quiz-${quizId}-answers`);
    const savedState = localStorage.getItem(`quiz-${quizId}-state`);

    if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
    if (savedState === "started") setHasStarted(true);
  }, [quizId]);

  // Save progress
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem(`quiz-${quizId}-answers`, JSON.stringify(answers));
    }
    if (hasStarted) {
      localStorage.setItem(`quiz-${quizId}-state`, "started");
    }
  }, [answers, quizId, hasStarted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = (autoSubmit = false) => {
    if (autoSubmit) {
      confirmSubmit();
      return;
    }

    if (Object.keys(answers).length !== quiz.questions.length) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    setShowSubmitModal(true);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    const toastId = toast.loading("Submitting quiz...");

    try {
      const formattedAnswers = Object.entries(answers).map(
        ([questionId, selectedOptionId]) => ({ questionId, selectedOptionId })
      );

      const result = await apiClient.post<{ attemptId: string }>(
        `/quiz-attempts/quiz/${quizId}/submit`,
        { answers: formattedAnswers }
      );

      // Cleanup local storage
      localStorage.removeItem(`quiz-${quizId}-answers`);
      localStorage.removeItem(`quiz-${quizId}-state`);

      toast.success("Quiz submitted successfully!", { id: toastId });
      setShowSubmitModal(false);
      router.push(`/student/quiz/${quizId}/results/${result.attemptId}`);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to submit quiz. Please try again.";
      console.error("Submission failed:", err);
      toast.error(errorMessage, { id: toastId });
      setIsSubmitting(false);
      setShowSubmitModal(false);
    }
  };

  // Timer logic
  useEffect(() => {
    if (!hasStarted || isSubmitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true); // Auto submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStarted, isSubmitting]);

  // --------------------------------------------------------------------------
  // START SCREEN RENDER
  // --------------------------------------------------------------------------
  if (!hasStarted) {
    return (
      <div className="w-full flex-grow bg-white flex flex-col items-center justify-start pt-12 pb-12 px-4">
        <div className="w-full max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Breadcrumbs */}
          <div className="text-sm text-gray-500 font-medium">
            Module 3 <span className="mx-2">/</span> JavaScript Fundamentals
          </div>

          {/* Main Card */}
          <div className="bg-white rounded border border-gray-100 overflow-hidden relative w-full">
            {/* Top Red Accent */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-red-700" />

            <div className="p-8 md:p-12">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {quiz.title}
                  </h1>
                </div>
                <div className="p-2 bg-red-50 text-red-700 rounded-full">
                  <FileText size={20} />
                </div>
              </div>

              <p className="text-gray-600 mb-10 leading-relaxed text-lg">
                Test your knowledge of variables, loops, and functions. You've
                got this! Ensure you have a stable internet connection before
                starting.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-gray-50/50 p-6 rounded-xl flex flex-col items-center justify-center text-center gap-2 group hover:bg-red-50/10 transition-colors border border-transparent hover:border-red-100">
                  <List className="text-red-700 mb-1" size={24} />
                  <span className="text-2xl font-bold text-gray-900">
                    {quiz.questions.length}
                  </span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    QUESTIONS
                  </span>
                </div>
                <div className="bg-gray-50/50 p-6 rounded-xl flex flex-col items-center justify-center text-center gap-2 group hover:bg-red-50/10 transition-colors border border-transparent hover:border-red-100">
                  <Timer className="text-red-700 mb-1" size={24} />
                  <span className="text-2xl font-bold text-gray-900">
                    {quiz.timeLimit || 15}
                  </span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    MINUTES
                  </span>
                </div>
                <div className="bg-gray-50/50 p-6 rounded-xl flex flex-col items-center justify-center text-center gap-2 group hover:bg-red-50/10 transition-colors border border-transparent hover:border-red-100">
                  <CheckCircle2 className="text-red-700 mb-1" size={24} />
                  <span className="text-2xl font-bold text-gray-900">
                    {quiz.passingScore}%
                  </span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    TO PASS
                  </span>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-gray-500 font-bold text-sm tracking-wider uppercase">
                  <Info size={16} />
                  <span>INSTRUCTIONS</span>
                </div>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-300 mt-2.5 flex-shrink-0" />
                    <span>
                      This quiz consists of multiple-choice and code-completion
                      questions designed to test practical application.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-300 mt-2.5 flex-shrink-0" />
                    <span>
                      You cannot pause the timer once you begin. Ensure you are
                      in a distraction-free environment.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-300 mt-2.5 flex-shrink-0" />
                    <span>
                      Results will be displayed immediately after submission,
                      along with detailed feedback on incorrect answers.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-gray-100">
                <button
                  onClick={() => router.back()}
                  className="px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded text-sm font-medium hover:text-red-700 transition-all flex items-center gap-2"
                >
                  <ArrowLeft size={15} /> Review Lessons
                </button>
                <button
                  onClick={() => setHasStarted(true)}
                  className="px-8 py-3 bg-red-700 hover:bg-red-800 text-white rounded font-medium hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 justify-center text-sm"
                >
                  Start Quiz <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-400 font-medium">
            Last attempt: Never • Best Score: --
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // QUIZ TAKING RENDER
  // --------------------------------------------------------------------------
  const question = quiz.questions[currentIndex];
  // Safe guard if question is missing
  if (!question) return <div>Error: Question not found</div>;

  const progress = ((currentIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="w-full flex-grow bg-white flex flex-col">
      {/* Quiz Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left: Timer */}
          <div className="flex items-center gap-2 font-small text-gray-900 bg-gray-50 px-3 py-1.5 rounded-sm border border-gray-100">
            <Clock size={18} className="text-red-700" />
            <span className="font-mono text-base">{formatTime(timeLeft)}</span>
          </div>

          {/* Center: Title info */}
          <div className="hidden md:flex flex-col items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              QUESTION {currentIndex + 1} OF {quiz.questions.length}
            </span>
            <span className="font-bold text-gray-900 text-sm line-clamp-1">
              {quiz.title}
            </span>
          </div>

          {/* Right: Mock Points/Status */}
          <div className="flex items-center gap-2">
            <div className="bg-red-50 text-red-700 px-3 py-2 text-xs font-semibold uppercase tracking-wider">
              In Progress
            </div>
          </div>
        </div>

        {/* Continuous Progress Bar (Matches Start Screen vibe) */}
        <div className="h-1 bg-gray-100 w-full">
          <div
            className="h-full bg-red-700 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Question Card */}
        <div className="bg-white rounded border border-gray-200 p-8 md:p-10 mb-8">
          <span className="inline-block px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-bold mb-6">
            Question {currentIndex + 1}
          </span>

          <h3 className="text-md md:text-lg font-medium text-gray-900 leading-relaxed">
            {question.text}
          </h3>
        </div>

        {/* Options List */}
        <div className="space-y-2">
          {question.options.map((option: any, index: number) => {
            const isSelected = answers[question._id] === option._id;
            const letter = String.fromCharCode(65 + index); // A, B, C, D...

            return (
              <button
                key={option._id}
                onClick={() => handleSelectOption(question._id, option._id)}
                className={`w-full text-left p-2 md:p-4 rounded border-1 transition-all flex items-center gap-4 group ${
                  isSelected
                    ? "border-red-700 bg-white"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {/* Circular Letter Badge */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-base flex-shrink-0 transition-colors ${
                    isSelected
                      ? "bg-red-50 text-red-700"
                      : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                  }`}
                >
                  {letter}
                </div>

                {/* Option Text */}
                <div className="text-gray-700 text-sm md:text-sm flex-grow">
                  {option.text}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between mt-10">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded text-sm font-medium hover:text-red-700 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={15} /> Previous
          </button>

          {currentIndex === quiz.questions.length - 1 ? (
            <button
              onClick={() => handleSubmit()}
              disabled={isSubmitting}
              className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white font-medium rounded text-sm hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Quiz"}{" "}
              <CheckCircle2 size={15} />
            </button>
          ) : (
            <button
              onClick={() =>
                setCurrentIndex((prev) =>
                  Math.min(quiz.questions.length - 1, prev + 1)
                )
              }
              className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white font-medium rounded text-sm hover:shadow-xl transition-all flex items-center gap-2"
            >
              Next Question <ArrowRight size={15} />
            </button>
          )}
        </div>
      </main>

      <ConfirmModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={() => confirmSubmit()}
        title="Submit Quiz"
        message="Are you sure you want to submit the quiz? You won't be able to change your answers after submission."
        confirmText="Submit"
        confirmVariant="primary"
        isLoading={isSubmitting}
      />
    </div>
  );
}

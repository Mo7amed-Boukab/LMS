"use client";

import {
   ArrowRight,
   CheckCircle2,
   ChevronRight,
   Clock,
   RotateCcw,
   XCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ResultsClientProps {
  results: any;
  quizId: string;
}

export default function ResultClient({ results, quizId }: ResultsClientProps) {
  const router = useRouter();
  
  const {
    passed = false,
    score = 0,
    correctAnswers = 0,
    totalQuestions = 0,
    timeSpent = "12m 30s",
    quizTitle = "Quiz Result",
    passingScore = 80
  } = results;

  const percentage = score;
  const isPassed = percentage >= passingScore || passed;

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const circleColor = isPassed ? "text-green-600" : "text-red-700";

  const handleRetry = () => {
    // Clear saved progress
    localStorage.removeItem(`quiz-${quizId}-answers`);
    localStorage.removeItem(`quiz-${quizId}-state`);
    // Navigate back to quiz start page
    router.push(`/student/quiz/${quizId}`);
  };

  const handleContinue = () => {
    // Navigate back to courses or next module
    router.push('/courses');
  };

  return (
    <div className="w-full flex-grow bg-gray-50 flex flex-col items-center justify-start pt-8 pb-12 px-4">
      <div className="w-full max-w-5xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <Link href="/courses" className="hover:text-red-700 transition-colors">Courses</Link>
          <ChevronRight size={14} />
          <span>{quizTitle}</span>
          <ChevronRight size={14} />
          <span className="font-semibold text-gray-900">Results</span>
        </div>

        {/* Main Result Card */}
        <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden relative">
             {/* Top Status Bar */}
             <div className={`absolute top-0 left-0 w-full h-1.5 ${isPassed ? 'bg-green-600' : 'bg-red-700'}`} />
             
             <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                
                {/* Left Column: Score Circle */}
                <div className="flex flex-col items-center justify-center space-y-8 border-r border-gray-100 md:pr-12">
                   <div className="relative w-56 h-56">
                      <svg className="w-full h-full transform -rotate-90">
                         <circle
                           cx="112"
                           cy="112"
                           r={radius}
                           fill="none"
                           stroke="#f3f4f6"
                           strokeWidth="12"
                         />
                         <circle
                           cx="112"
                           cy="112"
                           r={radius}
                           fill="none"
                           stroke="currentColor"
                           strokeWidth="12"
                           strokeDasharray={circumference}
                           strokeDashoffset={strokeDashoffset}
                           strokeLinecap="round"
                           className={`${circleColor} transition-all duration-1000 ease-out`}
                         />
                      </svg>
                      
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                         <span className="text-3xl font-black text-gray-900">{percentage}%</span>
                         <span className="text-gray-400 font-bold tracking-widest text-xs mt-2 uppercase">Score</span>
                      </div>
                   </div>

                   <div className={`px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-2 border ${
                       isPassed 
                         ? 'bg-green-50 text-green-700 border-green-200' 
                         : 'bg-red-50 text-red-700 border-red-100'
                   }`}>
                      {isPassed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      {isPassed ? "PASSED" : "NOT PASSED"}
                   </div>
                </div>

                {/* Right Column: Stats & Actions */}
                <div className="space-y-8">
                   <div className="space-y-4 text-center md:text-left">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                         {isPassed ? "Great Job!" : "Keep Practicing!"}
                      </h1>
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                         {isPassed 
                           ? `You've mastered this module. You can now proceed to the next lesson.` 
                           : `You need ${passingScore}% to pass. Don't worry, review the material and try again.`
                         }
                      </p>
                   </div>

                   {/* Stats Grid */}
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded border border-gray-100 flex flex-col gap-1">
                         <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider">
                            <CheckCircle2 size={14} /> Correct
                         </div>
                         <p className="text-xl font-bold text-gray-900">{correctAnswers}<span className="text-gray-400 text-base">/{totalQuestions}</span></p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded border border-gray-100 flex flex-col gap-1">
                         <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider">
                            <Clock size={14} /> Duration
                         </div>
                         <p className="text-xl font-bold text-gray-900">{timeSpent}</p>
                      </div>
                   </div>

                   {/* Action Button - Unified Design */}
                   <div className="flex flex-col gap-3">
                      <button 
                         onClick={isPassed ? handleContinue : handleRetry}
                         className={`w-full px-8 py-3 rounded font-medium flex items-center justify-center gap-2 transition-all text-sm ${
                            isPassed 
                              ? 'bg-green-600 hover:bg-green-700 text-white' 
                              : 'bg-red-700 hover:bg-red-800 text-white hover:translate-y-px'
                         }`}
                      >
                         {isPassed ? (
                            <>Continue <ArrowRight size={16} /></>
                         ) : (
                            <>Recommencer <RotateCcw size={16} /></>
                         )}
                      </button>
                   </div>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
}

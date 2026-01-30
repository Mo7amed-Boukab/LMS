import { CheckCircle } from 'lucide-react';

interface QuizHeaderProps {
  title: string;
  passingScore: number;
  currentQuestion: number;
  totalQuestions: number;
  answeredCount: number;
}

export default function QuizHeader({
  title,
  passingScore,
  currentQuestion,
  totalQuestions,
  answeredCount,
}: QuizHeaderProps) {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-600 mt-1">Passing Score: {passingScore}%</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Question</p>
          <p className="text-2xl font-bold text-blue-600">
            {currentQuestion} / {totalQuestions}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Status */}
      <div className="flex items-center justify-between mt-3">
        <p className="text-sm text-gray-600">
          Answered: {answeredCount} / {totalQuestions}
        </p>
        {answeredCount === totalQuestions && (
          <span className="text-green-600 font-semibold flex items-center gap-1 text-sm">
            <CheckCircle className="w-4 h-4" />
            All questions answered
          </span>
        )}
      </div>
    </div>
  );
}
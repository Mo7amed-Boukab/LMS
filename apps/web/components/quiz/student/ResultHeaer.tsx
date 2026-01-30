import { Trophy, XCircle } from 'lucide-react';

interface ResultsHeaderProps {
  passed: boolean;
  title: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
}

export default function ResultsHeader({
  passed,
  title,
  score,
  correctAnswers,
  totalQuestions,
}: ResultsHeaderProps) {
  return (
    <div
      className={`rounded-lg shadow-lg p-8 ${
        passed
          ? 'bg-gradient-to-r from-green-500 to-green-600'
          : 'bg-gradient-to-r from-red-500 to-red-600'
      }`}
    >
      <div className="text-center text-white">
        {passed ? (
          <Trophy className="w-20 h-20 mx-auto mb-4" />
        ) : (
          <XCircle className="w-20 h-20 mx-auto mb-4" />
        )}
        <h1 className="text-4xl font-bold mb-2">
          {passed ? 'Congratulations!' : 'Not Passed'}
        </h1>
        <p className="text-xl mb-4">{title}</p>
        <div className="flex justify-center gap-8 mt-6">
          <div>
            <p className="text-sm opacity-90">Your Score</p>
            <p className="text-5xl font-bold">{score}%</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Correct Answers</p>
            <p className="text-5xl font-bold">
              {correctAnswers}/{totalQuestions}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
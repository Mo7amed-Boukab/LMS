import { CheckCircle, XCircle } from 'lucide-react';

interface ResultsDetailsProps {
  details: any[];
}

export default function ResultsDetails({ details }: ResultsDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Question Review</h2>
      <div className="space-y-4">
        {details.map((detail, idx) => (
          <div
            key={idx}
            className={`border-l-4 p-4 rounded ${
              detail.isCorrect
                ? 'border-green-500 bg-green-50'
                : 'border-red-500 bg-red-50'
            }`}
          >
            <div className="flex items-start gap-3">
              {detail.isCorrect ? (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              )}
              <div className="flex-1">
                <p className="font-semibold text-gray-800 mb-2">
                  {idx + 1}. {detail.questionText}
                </p>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Your answer:</span>{' '}
                    <span
                      className={
                        detail.isCorrect ? 'text-green-700' : 'text-red-700'
                      }
                    >
                      {detail.yourAnswer}
                    </span>
                  </p>
                  {!detail.isCorrect && (
                    <p>
                      <span className="font-medium">Correct answer:</span>{' '}
                      <span className="text-green-700">
                        {detail.correctAnswer}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
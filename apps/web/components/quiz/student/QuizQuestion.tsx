// components/quiz/QuizQuestion.tsx
'use client';

interface QuizQuestionProps {
  question: any;
  selectedOption?: string;
  onSelectOption: (questionId: string, optionId: string) => void;
}

export default function QuizQuestion({
  question,
  selectedOption,
  onSelectOption,
}: QuizQuestionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="mb-6">
        <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded">
          Question
        </span>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {question.text}
      </h2>

      <div className="space-y-3">
        {question.options.map((option: any) => {
          const isSelected = selectedOption === option._id;
          return (
            <label
              key={option._id}
              className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 shadow-md'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name={question._id}
                  value={option._id}
                  checked={isSelected}
                  onChange={() => onSelectOption(question._id, option._id)}
                  className="w-5 h-5 text-blue-600"
                />
                <span className="ml-3 text-lg text-gray-800">{option.text}</span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
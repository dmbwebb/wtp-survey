import React, { useState } from 'react';
import { Button } from '../components/Button';
import { TokenCounter } from '../components/TokenCounter';
import { AppName, TOKEN_VALUE_COP } from '../types/survey';
import { useSurvey } from '../contexts/SurveyContext';

interface ChoiceQuestionScreenProps {
  app: AppName;
  tokenAmount: number;
  questionNumber: number;
  totalQuestions: number;
  onNext: () => void;
}

export const ChoiceQuestionScreen: React.FC<ChoiceQuestionScreenProps> = ({
  app,
  tokenAmount,
  questionNumber,
  totalQuestions,
  onNext,
}) => {
  const [selected, setSelected] = useState<'tokens' | 'block' | null>(null);
  const { addChoice } = useSurvey();

  const handleSubmit = () => {
    if (selected) {
      addChoice({
        id: `${app}-${tokenAmount}-${Date.now()}`,
        app,
        tokenAmount,
        selectedOption: selected,
        timestamp: new Date().toISOString(),
      });
      onNext();
    }
  };

  const tokenText = tokenAmount >= 0
    ? `RECEIVE ${tokenAmount} tokens`
    : `LOSE ${Math.abs(tokenAmount)} tokens`;

  const tokenValue = tokenAmount * TOKEN_VALUE_COP;
  const tokenValueText = tokenValue >= 0
    ? `(worth $${tokenValue.toLocaleString()} COP)`
    : `(lose $${Math.abs(tokenValue).toLocaleString()} COP)`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <TokenCounter />
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6">
          <div className="text-sm font-semibold text-gray-500 mb-2">
            Question {questionNumber} of {totalQuestions}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Would you rather...
        </h1>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setSelected('tokens')}
            className={`p-6 rounded-xl border-2 transition-all duration-200 ${
              selected === 'tokens'
                ? 'border-blue-600 bg-blue-50 shadow-lg'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">💰</div>
              <div className="text-xl font-bold text-gray-900 mb-2">
                {tokenText}
              </div>
              <div className="text-sm text-gray-600">
                {tokenValueText}
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelected('block')}
            className={`p-6 rounded-xl border-2 transition-all duration-200 ${
              selected === 'block'
                ? 'border-blue-600 bg-blue-50 shadow-lg'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🚫</div>
              <div className="text-xl font-bold text-gray-900 mb-2">
                Block {app}
              </div>
              <div className="text-sm text-gray-600">
                on your phone for 1 week
              </div>
            </div>
          </button>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!selected}
          className="w-full"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

import React from 'react';
import { Button } from '../components/Button';
import { TokenCounter } from '../components/TokenCounter';

interface ChoiceInstructionsScreen2Props {
  onNext: () => void;
  onBack: () => void;
}

export const ChoiceInstructionsScreen2: React.FC<ChoiceInstructionsScreen2Props> = ({ onNext, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <TokenCounter />
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="space-y-6 text-gray-700 text-lg leading-relaxed mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="font-semibold text-gray-900 mb-4 text-xl">Important:</p>
            <p className="mb-3">
              You will make multiple choices, and <strong>only one</strong> of your choices will randomly be selected to be implemented.
            </p>
            <p>
              This means that each question should be treated <strong>independently</strong>, and for every choice, you should give your honest answer.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button onClick={onBack} className="px-6">
            Back
          </Button>
          <Button onClick={onNext} className="flex-1">
            Begin Choices
          </Button>
        </div>
      </div>
    </div>
  );
};

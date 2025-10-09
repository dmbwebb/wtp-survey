import React from 'react';
import { Button } from '../components/Button';
import { TokenCounter } from '../components/TokenCounter';

interface ChoiceInstructionsScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export const ChoiceInstructionsScreen: React.FC<ChoiceInstructionsScreenProps> = ({ onNext, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4">
      <div className="w-full flex justify-end mb-4">
        <TokenCounter />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          About Your Choices
        </h1>
        <div className="space-y-4 text-gray-700 text-lg leading-relaxed mb-8">
          <p>
            The choices you will make will involve <strong>setting limits for certain apps on your phone</strong>.
          </p>
          <p>
            If you choose to set a limit, and that option is chosen, then our team will actually set the limit on your phone for <strong>one week</strong> later today, and set a password so you cannot change it.
          </p>
          <p className="font-semibold text-blue-600">
            So you should only select the options that you really prefer.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-2">Important:</p>
            <p>
              You will make multiple choices, and <strong>only one</strong> of your choices will randomly be selected to be implemented.
            </p>
            <p className="mt-2">
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
    </div>
  );
};

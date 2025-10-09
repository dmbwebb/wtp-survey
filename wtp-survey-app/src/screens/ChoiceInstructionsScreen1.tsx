import React from 'react';
import { Button } from '../components/Button';
import { TokenCounter } from '../components/TokenCounter';

interface ChoiceInstructionsScreen1Props {
  onNext: () => void;
  onBack: () => void;
}

export const ChoiceInstructionsScreen1: React.FC<ChoiceInstructionsScreen1Props> = ({ onNext, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-24">
      <TokenCounter />
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
        </div>
        <div className="flex gap-4">
          <Button onClick={onBack} className="px-6">
            Back
          </Button>
          <Button onClick={onNext} className="flex-1">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

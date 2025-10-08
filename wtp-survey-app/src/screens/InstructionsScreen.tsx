import React from 'react';
import { Button } from '../components/Button';
import { TOKEN_VALUE_COP } from '../types/survey';

interface InstructionsScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export const InstructionsScreen: React.FC<InstructionsScreenProps> = ({ onNext, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Survey Instructions
        </h1>
        <div className="space-y-4 text-gray-700 text-lg leading-relaxed mb-8">
          <p>
            You are going to make some choices that will give you the chance to earn real rewards.
          </p>
          <p>
            To get these rewards, you will receive <strong>tokens</strong>. These tokens have a value of{' '}
            <strong>${TOKEN_VALUE_COP.toLocaleString()} COP</strong>, and can be exchanged for a{' '}
            <strong>Spotify gift card</strong> after one week that has that value.
          </p>
          <p>
            Please pay attention to the comprehension checks on the next screen to ensure you understand how the survey works.
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

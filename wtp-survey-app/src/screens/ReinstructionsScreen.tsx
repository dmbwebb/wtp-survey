import React from 'react';
import { Button } from '../components/Button';
import { TOKEN_VALUE_COP } from '../types/survey';

interface ReinstructionsScreenProps {
  onNext: () => void;
}

export const ReinstructionsScreen: React.FC<ReinstructionsScreenProps> = ({ onNext }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Let's Review the Instructions
        </h1>
        <div className="space-y-4 text-gray-700 text-lg leading-relaxed mb-8">
          <p>
            Let's go over the key information again:
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
            <p className="font-semibold mb-2">Token Value:</p>
            <p>
              Each <strong>token</strong> is worth <strong>${TOKEN_VALUE_COP.toLocaleString()} COP</strong>.
            </p>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
            <p className="font-semibold mb-2">Reward Type:</p>
            <p>
              You can exchange your tokens for a <strong>Spotify gift card</strong> after one week.
            </p>
          </div>
          <p>
            Please review these details carefully. You'll have another chance to answer the comprehension questions.
          </p>
        </div>
        <Button onClick={onNext} className="w-full">
          Continue to Comprehension Check
        </Button>
      </div>
    </div>
  );
};

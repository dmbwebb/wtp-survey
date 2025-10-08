import React, { useState } from 'react';
import { Button } from '../components/Button';
import { useSurvey } from '../contexts/SurveyContext';
import { TOKEN_VALUE_COP } from '../types/survey';

interface ComprehensionCheckScreenProps {
  onNext: () => void;
  onBack: () => void;
  onFailed?: () => void;
}

export const ComprehensionCheckScreen: React.FC<ComprehensionCheckScreenProps> = ({ onNext, onBack, onFailed }) => {
  const [tokenValue, setTokenValue] = useState('');
  const [rewardType, setRewardType] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const { setComprehensionAnswer } = useSurvey();

  const correctTokenValue = TOKEN_VALUE_COP.toString();
  const isTokenValueCorrect = tokenValue.trim() === correctTokenValue;
  const isRewardTypeCorrect = rewardType.toLowerCase().includes('spotify') ||
                               rewardType.toLowerCase().includes('gift card') ||
                               rewardType.toLowerCase().includes('reward');

  const canContinue = isTokenValueCorrect && isRewardTypeCorrect;

  const handleSubmit = () => {
    if (canContinue) {
      setComprehensionAnswer('tokenValue', tokenValue);
      setComprehensionAnswer('rewardType', rewardType);
      onNext();
    } else {
      setShowErrors(true);
      if (onFailed) {
        // Give user a moment to see the error, then navigate to re-explanation
        setTimeout(() => {
          onFailed();
        }, 1500);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Comprehension Check
        </h1>
        <div className="space-y-6 mb-8">
          <div>
            <label htmlFor="tokenValue" className="block text-lg font-medium text-gray-700 mb-2">
              How much is 1 token worth in COP?
            </label>
            <input
              id="tokenValue"
              type="text"
              value={tokenValue}
              onChange={(e) => {
                setTokenValue(e.target.value);
                setShowErrors(false);
              }}
              placeholder="Enter amount (e.g., 1000)"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                showErrors && !isTokenValueCorrect ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {showErrors && !isTokenValueCorrect && (
              <p className="text-red-600 text-sm mt-1">
                Incorrect. Please review the instructions.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="rewardType" className="block text-lg font-medium text-gray-700 mb-2">
              What can you exchange your tokens for?
            </label>
            <input
              id="rewardType"
              type="text"
              value={rewardType}
              onChange={(e) => {
                setRewardType(e.target.value);
                setShowErrors(false);
              }}
              placeholder="Enter reward type"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                showErrors && !isRewardTypeCorrect ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {showErrors && !isRewardTypeCorrect && (
              <p className="text-red-600 text-sm mt-1">
                Incorrect. Please review the instructions.
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={onBack} className="px-6">
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!tokenValue.trim() || !rewardType.trim()}
            className="flex-1"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

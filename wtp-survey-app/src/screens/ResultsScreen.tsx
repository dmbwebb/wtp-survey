import React, { useEffect } from 'react';
import { Button } from '../components/Button';
import { TokenCounter } from '../components/TokenCounter';
import { useSurvey } from '../contexts/SurveyContext';
import { TOKEN_VALUE_COP } from '../types/survey';

interface ResultsScreenProps {
  onNext: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ onNext }) => {
  const { surveyData, completeSurvey, updateTokenBalance } = useSurvey();

  useEffect(() => {
    // Only update token balance once - check if survey is not yet completed
    if (!surveyData.completedAt) {
      // Update token balance based on selected choice
      if (surveyData.selectedChoice && surveyData.selectedChoice.selectedOption === 'tokens') {
        updateTokenBalance(surveyData.selectedChoice.tokenAmount);
      }
      completeSurvey();
    }
  }, []);

  const selectedChoice = surveyData.selectedChoice;

  if (!selectedChoice) {
    return null;
  }

  const willBlock = selectedChoice.selectedOption === 'block';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <TokenCounter />
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{willBlock ? '🚫' : '💰'}</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Implementation Results
          </h1>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            What will happen:
          </h2>
          {willBlock ? (
            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>{selectedChoice.app}</strong> will be blocked on your phone for <strong>1 week</strong> starting today.
              </p>
              <p className="text-gray-700">
                Our team will set the block with a password so you cannot change it.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-700">
                You will <strong>{selectedChoice.tokenAmount >= 0 ? `receive ${selectedChoice.tokenAmount} tokens` : `pay ${Math.abs(selectedChoice.tokenAmount)} tokens`}</strong>.
              </p>
              <p className="text-gray-700">
                This is worth <strong>${Math.abs(selectedChoice.tokenAmount * TOKEN_VALUE_COP).toLocaleString()} COP</strong>.
              </p>
              <p className="text-gray-700">
                {selectedChoice.app} will <strong>not</strong> be blocked.
              </p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Final Token Balance:
          </h2>
          <p className="text-3xl font-bold text-blue-600">
            {surveyData.tokenBalance} tokens
          </p>
          <p className="text-gray-600 mt-1">
            (${(surveyData.tokenBalance * TOKEN_VALUE_COP).toLocaleString()} COP)
          </p>
        </div>

        <Button onClick={onNext} className="w-full">
          Finish Survey
        </Button>
      </div>
    </div>
  );
};

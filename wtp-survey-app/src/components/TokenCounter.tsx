import React from 'react';
import { useSurvey } from '../contexts/SurveyContext';
import { TOKEN_VALUE_COP } from '../types/survey';

export const TokenCounter: React.FC = () => {
  const { surveyData } = useSurvey();

  return (
    <div className="fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
      <div className="text-sm font-semibold">Tokens</div>
      <div className="text-2xl font-bold">{surveyData.tokenBalance}</div>
      <div className="text-xs opacity-90">
        ${(surveyData.tokenBalance * TOKEN_VALUE_COP).toLocaleString()} COP
      </div>
    </div>
  );
};

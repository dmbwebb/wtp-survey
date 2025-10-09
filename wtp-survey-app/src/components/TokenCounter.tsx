import React from 'react';
import { useSurvey } from '../contexts/SurveyContext';
import { TOKEN_VALUE_COP } from '../types/survey';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';

export const TokenCounter: React.FC = () => {
  const { surveyData } = useSurvey();
  const { language } = useLanguage();

  return (
    <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg">
      <div className="text-sm font-semibold">{t('tokenCounter.tokens', language)}</div>
      <div className="text-2xl font-bold">{surveyData.tokenBalance}</div>
      <div className="text-xs opacity-90">
        ${(surveyData.tokenBalance * TOKEN_VALUE_COP).toLocaleString()} COP
      </div>
    </div>
  );
};

import React from 'react';
import { useSurvey } from '../contexts/SurveyContext';
import { TOKEN_VALUE_COP } from '../types/survey';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';

export const TokenCounter: React.FC = () => {
  const { surveyData } = useSurvey();
  const { language } = useLanguage();

  const renderCoins = () => {
    const coins: React.ReactElement[] = [];
    const tokenCount = surveyData.tokenBalance;

    // Show grey coins for current balance
    for (let i = 0; i < tokenCount; i++) {
      coins.push(
        <div
          key={`token-${i}`}
          className="w-2.5 h-2.5 rounded-full bg-white border border-blue-200"
        />
      );
    }

    return coins;
  };

  return (
    <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg">
      <div className="text-sm font-semibold">{t('tokenCounter.tokens', language)}</div>
      <div className="text-2xl font-bold">{surveyData.tokenBalance}</div>
      <div className="text-xs opacity-90">
        ${(surveyData.tokenBalance * TOKEN_VALUE_COP).toLocaleString()} COP
      </div>
      <div className="flex flex-wrap justify-center gap-0.5 mt-2 max-w-[120px]">
        {renderCoins()}
      </div>
    </div>
  );
};

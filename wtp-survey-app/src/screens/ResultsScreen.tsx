import React, { useEffect } from 'react';
import { Button } from '../components/Button';
import { TokenCounter } from '../components/TokenCounter';
import { FinalTokenVisualizer } from '../components/FinalTokenVisualizer';
import { useSurvey } from '../contexts/SurveyContext';
import { TOKEN_VALUE_COP } from '../types/survey';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';

interface ResultsScreenProps {
  onNext: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ onNext }) => {
  const { language } = useLanguage();
  const { surveyData, completeSurvey } = useSurvey();

  useEffect(() => {
    // Mark survey as completed (token balance already updated in ChoicesSummaryScreen)
    if (!surveyData.completedAt) {
      completeSurvey();
    }
  }, []);

  const selectedChoice = surveyData.selectedChoice;

  if (!selectedChoice) {
    return null;
  }

  const willBlock = selectedChoice.selectedOption === 'block';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4">
      <div className="w-full flex justify-end mb-4">
        <TokenCounter />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{willBlock ? '🚫' : '💰'}</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('results.title', language)}
          </h1>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t('results.whatWillHappen', language)}
          </h2>
          {willBlock ? (
            <div className="space-y-2">
              <p className="text-gray-700">
                {t('results.blockMessage1', language)} <strong>{selectedChoice.app}</strong> {t('results.blockMessage2', language)}
              </p>
              <p className="text-gray-700">
                {t('results.blockMessage3', language)} {t('results.blockMessage4', language)}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-700">
                {t('results.tokenMessage1', language)} <strong>{selectedChoice.tokenAmount >= 0 ? `${t('results.receive', language)} ${selectedChoice.tokenAmount} ${t('results.tokens', language)}` : `${t('results.pay', language)} ${Math.abs(selectedChoice.tokenAmount)} ${t('results.tokens', language)}`}</strong>.
              </p>
              <p className="text-gray-700">
                {t('results.thisIsWorth', language)} <strong>${Math.abs(selectedChoice.tokenAmount * TOKEN_VALUE_COP).toLocaleString()} COP</strong>.
              </p>
              <p className="text-gray-700">
                {selectedChoice.app} {t('results.willNotBeBlocked', language)}
              </p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {t('results.finalTokenBalance', language)}
          </h2>
          <p className="text-3xl font-bold text-blue-600">
            {surveyData.tokenBalance} {t('results.tokens', language)}
          </p>
          <p className="text-gray-600 mt-1">
            (${(surveyData.tokenBalance * TOKEN_VALUE_COP).toLocaleString()} COP)
          </p>
          <FinalTokenVisualizer tokenCount={surveyData.tokenBalance} />
        </div>

        <Button onClick={onNext} className="w-full">
          {t('results.finishSurvey', language)}
        </Button>
        </div>
      </div>
    </div>
  );
};

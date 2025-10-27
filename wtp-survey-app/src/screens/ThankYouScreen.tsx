import React from 'react';
import { useSurvey } from '../contexts/SurveyContext';
import { Button } from '../components/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';

interface ThankYouScreenProps {
  onStartNewSurvey: () => void;
}

export const ThankYouScreen: React.FC<ThankYouScreenProps> = ({ onStartNewSurvey }) => {
  const { language } = useLanguage();
  const { surveyData } = useSurvey();

  const downloadData = () => {
    const dataStr = JSON.stringify(surveyData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `survey-${surveyData.participantId}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const startNewSurvey = async () => {
    // Call the reset callback from App.tsx
    onStartNewSurvey();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('thankYou.title', language)}
        </h1>
        <p className="text-xl text-gray-700 mb-6">
          {t('thankYou.completed', language)}
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <p className="text-gray-700 mb-2">
            {t('thankYou.recorded', language)}
          </p>
          <p className="text-gray-700">
            {t('thankYou.contactInfo', language)}
          </p>
        </div>
        <div className="text-sm text-gray-500 mb-4">
          {t('thankYou.participantId', language)} {surveyData.participantId}
        </div>
        <button
          onClick={downloadData}
          className="text-blue-600 hover:text-blue-700 underline text-sm mb-6"
        >
          {t('thankYou.downloadData', language)}
        </button>
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Button
            onClick={startNewSurvey}
            className="w-full"
          >
            {t('thankYou.startNew', language)}
          </Button>
        </div>
      </div>
    </div>
  );
};

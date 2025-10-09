import React from 'react';
import { Button } from '../components/Button';
import { TOKEN_VALUE_COP } from '../types/survey';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';

interface ReinstructionsScreenProps {
  onNext: () => void;
}

export const ReinstructionsScreen: React.FC<ReinstructionsScreenProps> = ({ onNext }) => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {t('reinstructions.title', language)}
        </h1>
        <div className="space-y-4 text-gray-700 text-lg leading-relaxed mb-8">
          <p>
            {t('reinstructions.intro', language)}
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
            <p className="font-semibold mb-2">{t('reinstructions.tokenValueLabel', language)}</p>
            <p>
              {t('reinstructions.tokenValueText', language)} <strong>${TOKEN_VALUE_COP.toLocaleString()} COP</strong>.
            </p>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
            <p className="font-semibold mb-2">{t('reinstructions.rewardTypeLabel', language)}</p>
            <p>
              {t('reinstructions.rewardTypeText', language)}
            </p>
          </div>
          <p>
            {t('reinstructions.outro', language)}
          </p>
        </div>
        <Button onClick={onNext} className="w-full">
          {t('reinstructions.button', language)}
        </Button>
      </div>
    </div>
  );
};

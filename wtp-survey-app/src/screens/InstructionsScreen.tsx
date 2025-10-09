import React from 'react';
import { Button } from '../components/Button';
import { TOKEN_VALUE_COP } from '../types/survey';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';

interface InstructionsScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export const InstructionsScreen: React.FC<InstructionsScreenProps> = ({ onNext, onBack }) => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {t('instructions.title', language)}
        </h1>
        <div className="space-y-4 text-gray-700 text-lg leading-relaxed mb-8">
          <p>
            {t('instructions.paragraph1', language)}
          </p>
          <p>
            {t('instructions.paragraph2', language)} <strong>${TOKEN_VALUE_COP.toLocaleString()} COP</strong>{t('instructions.paragraph2b', language)} <strong>{t('instructions.paragraph2c', language)}</strong> {t('instructions.paragraph2d', language)}
          </p>
          <p>
            {t('instructions.paragraph3', language)}
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={onBack} className="px-6">
            {t('common.back', language)}
          </Button>
          <Button onClick={onNext} className="flex-1">
            {t('common.continue', language)}
          </Button>
        </div>
      </div>
    </div>
  );
};

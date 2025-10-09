import React from 'react';
import { Button } from '../components/Button';
import { TokenCounter } from '../components/TokenCounter';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';

interface ChoiceInstructionsScreen2Props {
  onNext: () => void;
  onBack: () => void;
}

export const ChoiceInstructionsScreen2: React.FC<ChoiceInstructionsScreen2Props> = ({ onNext, onBack }) => {
  const { language } = useLanguage();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4">
      <div className="w-full flex justify-end mb-4">
        <TokenCounter />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="space-y-6 text-gray-700 text-lg leading-relaxed mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="font-semibold text-gray-900 mb-4 text-xl">{t('choiceInstructions2.important', language)}</p>
            <p className="mb-3">
              {t('choiceInstructions2.paragraph1', language)}
            </p>
            <p>
              {t('choiceInstructions2.paragraph2', language)}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button onClick={onBack} className="px-6">
            {t('common.back', language)}
          </Button>
          <Button onClick={onNext} className="flex-1">
            {t('choiceInstructions2.button', language)}
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Button } from '../components/Button';
import { TokenCounter } from '../components/TokenCounter';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';
import { AudioPlayer } from '../components/AudioPlayer';
import audioW6 from '../assets/audio_files/w6.mp3';

interface ChoiceInstructionsScreen1Props {
  onNext: () => void;
  onBack: () => void;
}

export const ChoiceInstructionsScreen1: React.FC<ChoiceInstructionsScreen1Props> = ({ onNext, onBack }) => {
  const { language } = useLanguage();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4">
      <div className="w-full flex justify-end mb-4">
        <TokenCounter />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('choiceInstructions1.title', language)}
          </h1>
          <AudioPlayer audioSrc={audioW6} />
        </div>
        <div className="space-y-4 text-gray-700 text-lg leading-relaxed mb-8">
          <p>
            {t('choiceInstructions1.paragraph1', language)}
          </p>
          <p>
            {t('choiceInstructions1.paragraph2', language)}
          </p>
          <p className="font-semibold text-blue-600">
            {t('choiceInstructions1.paragraph3', language)}
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
    </div>
  );
};

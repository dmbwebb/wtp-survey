import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { TokenCounter } from '../components/TokenCounter';
import { FinalTokenVisualizer } from '../components/FinalTokenVisualizer';
import { INITIAL_TOKENS, TOKEN_VALUE_COP } from '../types/survey';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';
import pesosBillImage from '../assets/64213cfd4266a0.83197333-original.jpg';
import { AudioPlayer } from '../components/AudioPlayer';
import audioW5 from '../assets/audio_files/w5.mp3';

interface TokenAllocationScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export const TokenAllocationScreen: React.FC<TokenAllocationScreenProps> = ({ onNext, onBack }) => {
  const [showCounter, setShowCounter] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    setTimeout(() => setShowCounter(true), 500);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4">
      {showCounter && (
        <div className="w-full flex justify-end mb-4">
          <TokenCounter />
        </div>
      )}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            {t('tokenAllocation.title', language)}
          </h1>
          <AudioPlayer audioSrc={audioW5} />
        </div>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-blue-100 rounded-full mb-4">
            <span className="text-5xl font-bold text-blue-600">{INITIAL_TOKENS}</span>
          </div>
          <p className="text-xl text-gray-700">
            {t('tokenAllocation.description1', language)} <strong>{INITIAL_TOKENS} {t('tokenAllocation.description2', language)}</strong>
          </p>
          <p className="text-lg text-gray-600 mt-2">
            ({t('tokenAllocation.worth', language)} ${(INITIAL_TOKENS * TOKEN_VALUE_COP).toLocaleString()} COP)
          </p>
          <div className="my-6">
            <img
              src={pesosBillImage}
              alt="10,000 pesos bill"
              className="w-full max-w-md mx-auto rounded-lg shadow-md"
            />
          </div>
          <FinalTokenVisualizer tokenCount={INITIAL_TOKENS} />
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-gray-700">
            {t('tokenAllocation.info', language)}
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

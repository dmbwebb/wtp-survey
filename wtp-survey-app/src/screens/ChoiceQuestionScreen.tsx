import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { TokenCounter } from '../components/TokenCounter';
import { AppName, TOKEN_VALUE_COP } from '../types/survey';
import { useSurvey } from '../contexts/SurveyContext';
import whatsappLogo from '../assets/whatsapp-logo.png';
import tiktokLogo from '../assets/tiktok-logo.png';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';

interface ChoiceQuestionScreenProps {
  app: AppName;
  tokenAmount: number;
  questionNumber: number;
  totalQuestions: number;
  onNext: () => void;
  onBack: () => void;
}

export const ChoiceQuestionScreen: React.FC<ChoiceQuestionScreenProps> = ({
  app,
  tokenAmount,
  questionNumber,
  totalQuestions,
  onNext,
  onBack,
}) => {
  const { language } = useLanguage();
  const [selected, setSelected] = useState<'tokens' | 'block' | null>(null);
  const { addChoice } = useSurvey();

  // Reset selection when question changes
  useEffect(() => {
    setSelected(null);
  }, [app, tokenAmount]);

  const handleSubmit = () => {
    if (selected) {
      addChoice({
        id: `${app}-${tokenAmount}-${Date.now()}`,
        app,
        tokenAmount,
        selectedOption: selected,
        timestamp: new Date().toISOString(),
      });
      onNext();
    }
  };

  const tokenText = tokenAmount >= 0
    ? `${t('choiceQuestion.receive', language)} ${tokenAmount} ${t('choiceQuestion.tokens', language)}`
    : `${t('choiceQuestion.pay', language)} ${Math.abs(tokenAmount)} ${t('choiceQuestion.tokens', language)}`;

  const tokenValue = tokenAmount * TOKEN_VALUE_COP;
  const tokenValueText = `(${t('choiceQuestion.worth', language)} $${Math.abs(tokenValue).toLocaleString()} COP)`;

  const appLogo = app === 'WhatsApp' ? whatsappLogo : tiktokLogo;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4">
      <div className="w-full flex justify-end mb-4">
        <TokenCounter />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6">
          <div className="text-sm font-semibold text-gray-500 mb-2">
            {t('choiceQuestion.questionOf', language)} {questionNumber} {t('choiceQuestion.of', language)} {totalQuestions}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          {t('choiceQuestion.wouldYouRather', language)}
        </h1>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setSelected('tokens')}
            className={`p-6 rounded-xl border-2 transition-all duration-200 ${
              selected === 'tokens'
                ? 'border-blue-600 bg-blue-50 shadow-lg'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">💰</div>
              <div className="text-xl font-bold text-gray-900 mb-2">
                {tokenText}
              </div>
              <div className="text-sm text-gray-600">
                {tokenValueText}
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelected('block')}
            className={`p-6 rounded-xl border-2 transition-all duration-200 ${
              selected === 'block'
                ? 'border-blue-600 bg-blue-50 shadow-lg'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
          >
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <img src={appLogo} alt={app} className="w-16 h-16" />
              </div>
              <div className="text-xl font-bold text-gray-900 mb-2">
                {t('choiceQuestion.block', language)} {app}
              </div>
              <div className="text-sm text-gray-600">
                {t('choiceQuestion.onYourPhoneFor1Week', language)}
              </div>
            </div>
          </button>
        </div>

        <div className="flex gap-4">
          <Button onClick={onBack} className="px-6">
            {t('common.back', language)}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selected}
            className="flex-1"
          >
            {t('common.continue', language)}
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
};

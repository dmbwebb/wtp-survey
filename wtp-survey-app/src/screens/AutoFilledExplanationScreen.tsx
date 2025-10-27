import React from 'react';
import { Button } from '../components/Button';
import { TokenCounter } from '../components/TokenCounter';
import { AppName } from '../types/survey';
import { useSurvey } from '../contexts/SurveyContext';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';
import whatsappLogo from '../assets/whatsapp-logo.png';
import tiktokLogo from '../assets/tiktok-logo.png';

interface AutoFilledExplanationScreenProps {
  app: AppName;
  onNext: () => void;
  onGoBack: () => void;
}

export const AutoFilledExplanationScreen: React.FC<AutoFilledExplanationScreenProps> = ({
  app,
  onNext,
  onGoBack,
}) => {
  const { language } = useLanguage();
  const { surveyData } = useSurvey();

  const switchingPoint = surveyData.switchingPoints[app];
  if (!switchingPoint || !switchingPoint.confirmed) {
    // This shouldn't happen, but handle it gracefully
    onNext();
    return null;
  }

  const appLogo = app === 'WhatsApp' ? whatsappLogo : tiktokLogo;

  // Get all auto-filled choices for this app
  const autoFilledChoices = surveyData.choices.filter(
    choice => choice.app === app && choice.autoFilled
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4">
      <div className="w-full flex justify-end mb-4">
        <TokenCounter />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6 flex justify-center">
            <img src={appLogo} alt={app} className="w-20 h-20" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t('autoFilled.title', language).replace('{app}', app)}
          </h1>

          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
            <p className="text-lg text-gray-700 mb-4">
              {t('autoFilled.explanation', language)
                .replace('{app}', app)
                .replace('{count}', autoFilledChoices.length.toString())}
            </p>

            <div className="bg-white rounded-lg p-4 max-h-64 overflow-y-auto">
              <h3 className="font-semibold text-gray-900 mb-3">
                {t('autoFilled.filledAnswers', language)}
              </h3>
              <div className="space-y-3">
                {autoFilledChoices.map((choice, index) => {
                  const tokenText = choice.tokenAmount > 0
                    ? `${t('choiceQuestion.receive', language).toLowerCase()} ${choice.tokenAmount} ${t('choiceQuestion.tokens', language)}`
                    : choice.tokenAmount < 0
                    ? `${t('choiceQuestion.pay', language).toLowerCase()} ${Math.abs(choice.tokenAmount)} ${t('choiceQuestion.tokens', language)}`
                    : `${t('choiceQuestion.doNotLimit', language).toLowerCase()} ${app}`;

                  const choiceText = choice.selectedOption === 'tokens'
                    ? tokenText
                    : `${t('choiceQuestion.limit', language)} ${app}`;

                  const limitOption = `${t('choiceQuestion.limit', language)} ${app}`;
                  const fullQuestion = `${limitOption} vs ${tokenText}`;

                  return (
                    <div
                      key={choice.id}
                      className="py-2 px-3 bg-gray-50 rounded"
                    >
                      <div className="text-sm text-gray-700">
                        <span className="text-gray-600">{t('autoFilled.question', language)} {index + 1}:</span>{' '}
                        {fullQuestion} → {t('autoFilled.decision', language)}: <span className="font-bold text-gray-900">{choiceText}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-center text-gray-600">
              {t('autoFilled.canGoBack', language)}
            </p>
          </div>

          <div className="flex gap-4">
            <Button onClick={onGoBack} className="flex-1">
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

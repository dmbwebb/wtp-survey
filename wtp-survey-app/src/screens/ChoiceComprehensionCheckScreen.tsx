import React from 'react';
import { Button } from '../components/Button';
import { TokenCounter } from '../components/TokenCounter';
import { useSurvey } from '../contexts/SurveyContext';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';

interface ChoiceComprehensionCheckScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export const ChoiceComprehensionCheckScreen: React.FC<ChoiceComprehensionCheckScreenProps> = ({
  onNext,
  onBack,
}) => {
  const { surveyData } = useSurvey();
  const { language } = useLanguage();

  // Get the first choice (just made by the participant)
  const firstChoice = surveyData.choices[0];

  if (!firstChoice) {
    // Shouldn't happen, but handle gracefully
    onNext();
    return null;
  }

  const { app, tokenAmount, selectedOption } = firstChoice;
  const finalBalance = surveyData.tokenBalance + tokenAmount;

  // Build the confirmation message based on what they chose
  let message: string;

  if (selectedOption === 'tokens') {
    // They chose to receive/pay tokens
    if (tokenAmount === 0) {
      // Special case for zero tokens
      message = t('choiceComprehensionCheck.confirmTokensZero', language)
        .replace('{app}', app)
        .replace('{currentBalance}', surveyData.tokenBalance.toString());
    } else {
      // Positive or negative tokens
      const tokenAction = tokenAmount > 0
        ? t('choiceComprehensionCheck.receive', language)
        : t('choiceComprehensionCheck.pay', language);
      const connector = tokenAmount > 0
        ? t('choiceComprehensionCheck.and', language)
        : t('choiceComprehensionCheck.but', language);
      const absTokens = Math.abs(tokenAmount);

      message = t('choiceComprehensionCheck.confirmTokens', language)
        .replace('{action}', tokenAction)
        .replace('{tokens}', absTokens.toString())
        .replace('{connector}', connector)
        .replace('{finalBalance}', finalBalance.toString())
        .replace('{app}', app);
    }
  } else {
    // They chose to limit the app
    const tokenAction = tokenAmount >= 0
      ? t('choiceComprehensionCheck.receiving', language)
      : t('choiceComprehensionCheck.paying', language);
    const absTokens = Math.abs(tokenAmount);

    message = t('choiceComprehensionCheck.confirmLimit', language)
      .replace('{app}', app)
      .replace('{action}', tokenAction)
      .replace('{tokens}', absTokens.toString())
      .replace('{currentBalance}', surveyData.tokenBalance.toString());
  }

  const handleYes = () => {
    onNext();
  };

  const handleNo = () => {
    // Go back to the first question
    onBack();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4">
      <div className="w-full flex justify-end mb-4">
        <TokenCounter />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t('choiceComprehensionCheck.title', language)}
          </h1>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <p className="text-lg text-gray-800 leading-relaxed">
              {message}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={handleNo}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3"
            >
              {t('choiceComprehensionCheck.no', language)}
            </Button>
            <Button
              onClick={handleYes}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3"
            >
              {t('choiceComprehensionCheck.yes', language)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

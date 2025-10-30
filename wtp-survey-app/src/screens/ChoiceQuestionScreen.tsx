import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { TokenCounter } from '../components/TokenCounter';
import { TokenVisualizer } from '../components/TokenVisualizer';
import { AppName, TOKEN_VALUE_COP, TOKEN_AMOUNTS } from '../types/survey';
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
  onSwitchingPointDetected: () => void;
  onBack: () => void;
}

export const ChoiceQuestionScreen: React.FC<ChoiceQuestionScreenProps> = ({
  app,
  tokenAmount,
  questionNumber,
  totalQuestions,
  onNext,
  onSwitchingPointDetected,
  onBack,
}) => {
  const { language } = useLanguage();
  const [selected, setSelected] = useState<'tokens' | 'limit' | null>(null);
  const { addChoice, surveyData, setSwitchingPoint, clearAutoFilledChoices } = useSurvey();

  // Reset selection when question changes
  useEffect(() => {
    setSelected(null);
  }, [app, tokenAmount]);

  const detectSwitch = (currentChoice: 'tokens' | 'limit'): boolean => {
    // Get all previous choices for this app (excluding auto-filled ones and current question)
    const previousChoices = surveyData.choices.filter(
      choice => choice.app === app && !choice.autoFilled && choice.tokenAmount !== tokenAmount
    );

    // Get the ordered token amounts to verify consistency
    const orderedTokenAmounts = surveyData.tokenOrder === 'ascending'
      ? [...TOKEN_AMOUNTS].reverse()  // [-10, -8, -5, -2, -1, 0, 2, 5]
      : TOKEN_AMOUNTS;                 // [5, 2, 0, -1, -2, -5, -8, -10]

    const firstTokenAmount = orderedTokenAmounts[0];
    const isFirstTokenForApp = previousChoices.length === 0 &&
      Math.abs(tokenAmount - firstTokenAmount) < 0.01; // Allow for floating point comparison

    console.log('[SWITCHING POINT DEBUG]', {
      app,
      tokenAmount,
      currentChoice,
      tokenOrder: surveyData.tokenOrder,
      firstTokenAmount,
      isFirstTokenForApp,
      previousChoicesCount: previousChoices.length,
      previousChoices: previousChoices.map(c => ({ token: c.tokenAmount, choice: c.selectedOption })),
    });

    // Special case: First choice for this app
    if (previousChoices.length === 0) {
      // DESCENDING order: Start with BEST offer (e.g., +5 tokens)
      // - Choose 'tokens' (accept best) → Need to ask about worse offers → NO SWITCH
      // - Choose 'limit' (reject best) → Will reject all worse offers → YES SWITCH
      if (surveyData.tokenOrder === 'descending') {
        const isSwitch = currentChoice === 'limit';
        console.log('[FIRST CHOICE - DESCENDING]', { currentChoice, isSwitch });
        return isSwitch;
      }

      // ASCENDING order: Start with WORST offer (e.g., -10 tokens)
      // - Choose 'tokens' (accept worst) → Will accept all better offers → YES SWITCH
      // - Choose 'limit' (reject worst) → Need to ask about better offers → NO SWITCH
      if (surveyData.tokenOrder === 'ascending') {
        const isSwitch = currentChoice === 'tokens';
        console.log('[FIRST CHOICE - ASCENDING]', { currentChoice, isSwitch });
        return isSwitch;
      }

      // This should never happen (tokenOrder must be 'ascending' or 'descending')
      console.error('[SWITCHING POINT ERROR] Invalid tokenOrder:', surveyData.tokenOrder);
      return false;
    }

    // Subsequent choices: Check if this represents a switch from previous pattern
    const allPreviousSame = previousChoices.every(
      choice => choice.selectedOption === previousChoices[0].selectedOption
    );

    if (!allPreviousSame) {
      console.log('[SUBSEQUENT CHOICE] Inconsistent previous choices, no switch detected');
      return false; // Previous choices were inconsistent
    }

    const previousOption = previousChoices[0].selectedOption;
    const isSwitch = previousOption !== currentChoice;

    console.log('[SUBSEQUENT CHOICE]', {
      previousOption,
      currentChoice,
      isSwitch,
      tokenOrder: surveyData.tokenOrder,
    });

    return isSwitch;
  };

  const checkIfBreaksSwitchingPoint = (currentChoice: 'tokens' | 'limit'): boolean => {
    // Check if there's a confirmed switching point for this app
    const switchingPoint = surveyData.switchingPoints[app];
    if (!switchingPoint || !switchingPoint.confirmed) {
      return false;
    }

    // Get the order of token amounts
    const orderedTokenAmounts = surveyData.tokenOrder === 'ascending'
      ? [...TOKEN_AMOUNTS].reverse()
      : TOKEN_AMOUNTS;

    // Find the indices
    const currentIndex = orderedTokenAmounts.findIndex(amt => amt === tokenAmount);
    const switchIndex = orderedTokenAmounts.findIndex(amt => amt === switchingPoint.tokenAmount);

    // If this question is not before the switching point, it doesn't break it
    if (currentIndex >= switchIndex) {
      return false;
    }

    // This question is before the switching point
    // Get all non-auto-filled choices for this app before the switch (excluding current question)
    const choicesBeforeSwitch = surveyData.choices.filter(
      choice => choice.app === app &&
                !choice.autoFilled &&
                choice.tokenAmount !== tokenAmount &&
                orderedTokenAmounts.findIndex(amt => amt === choice.tokenAmount) < switchIndex
    );

    // If there are previous choices, check if they all match the expected pattern
    if (choicesBeforeSwitch.length > 0) {
      const expectedOption = choicesBeforeSwitch[0].selectedOption;

      // If current choice doesn't match the pattern, it breaks the switching point
      if (currentChoice !== expectedOption) {
        return true;
      }
    }

    return false;
  };

  const handleSubmit = () => {
    if (selected) {
      // Check if this answer breaks an existing switching point
      const breaksSwitchingPoint = checkIfBreaksSwitchingPoint(selected);

      if (breaksSwitchingPoint) {
        // Clear the switching point and all auto-filled choices
        clearAutoFilledChoices(app);
      }

      // Check if this is a switching point BEFORE adding the choice
      const isSwitch = detectSwitch(selected);

      // Add the current choice
      addChoice({
        id: `${app}-${tokenAmount}-${Date.now()}`,
        app,
        tokenAmount,
        selectedOption: selected,
        timestamp: new Date().toISOString(),
      });

      if (isSwitch) {
        // Set the switching point for confirmation
        setSwitchingPoint(app, tokenAmount, selected);
        // Navigate directly to confirmation screen (not through normal flow)
        onSwitchingPointDetected();
      } else {
        // Normal navigation
        onNext();
      }
    }
  };

  const tokenText = tokenAmount > 0
    ? `${t('choiceQuestion.receive', language)} ${tokenAmount} ${t('choiceQuestion.tokens', language)}`
    : tokenAmount < 0
    ? `${t('choiceQuestion.pay', language)} ${Math.abs(tokenAmount)} ${t('choiceQuestion.tokens', language)}`
    : `${t('choiceQuestion.doNotLimit', language)} ${app}`;

  const notLimitText = tokenAmount > 0
    ? `${t('choiceQuestion.andNotLimit', language)} ${app}`
    : tokenAmount < 0
    ? `${t('choiceQuestion.butNotLimit', language)} ${app}`
    : t('choiceQuestion.maintainTokens', language);

  const tokenValue = tokenAmount * TOKEN_VALUE_COP;
  const tokenValueText = tokenAmount !== 0
    ? `(${t('choiceQuestion.worth', language)} $${Math.abs(tokenValue).toLocaleString()} COP)`
    : '';

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
              <div className="text-lg font-semibold text-gray-700 mb-2">
                {notLimitText}
              </div>
              <div className="text-sm text-gray-600">
                {tokenValueText}
              </div>
              <TokenVisualizer tokenAmount={tokenAmount} />
            </div>
          </button>

          <button
            onClick={() => setSelected('limit')}
            className={`p-6 rounded-xl border-2 transition-all duration-200 ${
              selected === 'limit'
                ? 'border-blue-600 bg-blue-50 shadow-lg'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
          >
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <img src={appLogo} alt={app} className="w-16 h-16" />
              </div>
              <div className="text-xl font-bold text-gray-900 mb-2">
                {t('choiceQuestion.limit', language)} {app}
              </div>
              <div className="text-sm text-gray-600">
                {t('choiceQuestion.limitDescription', language)}
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

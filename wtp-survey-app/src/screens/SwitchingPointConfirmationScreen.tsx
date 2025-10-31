import React from 'react';
import { Button } from '../components/Button';
import { TokenCounter } from '../components/TokenCounter';
import { AppName, TOKEN_AMOUNTS } from '../types/survey';
import { useSurvey } from '../contexts/SurveyContext';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';
import whatsappLogo from '../assets/whatsapp-logo.png';
import tiktokLogo from '../assets/tiktok-logo.png';

interface SwitchingPointConfirmationScreenProps {
  app: AppName;
  onConfirm: () => void;
  onGoBack: () => void;
}

export const SwitchingPointConfirmationScreen: React.FC<SwitchingPointConfirmationScreenProps> = ({
  app,
  onConfirm,
  onGoBack,
}) => {
  const { language } = useLanguage();
  const { surveyData, confirmSwitchingPoint } = useSurvey();

  const switchingPoint = surveyData.switchingPoints[app];
  if (!switchingPoint) {
    // This shouldn't happen, but handle it gracefully
    onGoBack();
    return null;
  }

  const { tokenAmount, switchedTo } = switchingPoint;
  const appLogo = app === 'WhatsApp' ? whatsappLogo : tiktokLogo;

  // Get the order of token amounts based on survey order
  const orderedTokenAmounts = surveyData.tokenOrder === 'ascending'
    ? [...TOKEN_AMOUNTS].reverse()
    : TOKEN_AMOUNTS;

  // Find the index of the switching point
  const switchIndex = orderedTokenAmounts.findIndex(amt => amt === tokenAmount);

  // Get all token amounts after the switching point
  const remainingTokenAmounts = orderedTokenAmounts.slice(switchIndex + 1);

  // Get simplified explanation based on the choice
  const getSimplifiedExplanation = () => {
    if (switchedTo === 'limit') {
      // They chose to limit rather than receive/pay tokens
      if (tokenAmount > 0) {
        // They chose to limit rather than receive positive tokens
        return t('switchingPoint.simplifiedLimitOverReceiveExplanation', language)
          .replace('{app}', app)
          .replace('{tokenAmount}', tokenAmount.toString());
      } else if (tokenAmount < 0) {
        // They chose to limit rather than pay tokens
        return t('switchingPoint.simplifiedLimitExplanation', language)
          .replace('{app}', app)
          .replace('{tokenAmount}', Math.abs(tokenAmount).toString());
      } else {
        // tokenAmount === 0: They chose to limit rather than keep tokens unchanged
        return t('switchingPoint.choseLimitOverZero', language)
          .replace('{app}', app);
      }
    } else {
      // They chose tokens rather than limit
      if (tokenAmount < 0) {
        // They chose to pay tokens rather than limit (ascending order switch)
        return t('switchingPoint.simplifiedPayExplanation', language)
          .replace('{app}', app)
          .replace('{tokenAmount}', Math.abs(tokenAmount).toString());
      } else if (tokenAmount > 0) {
        // They chose to receive tokens rather than limit (descending order switch)
        return t('switchingPoint.simplifiedReceiveExplanation', language)
          .replace('{app}', app)
          .replace('{tokenAmount}', tokenAmount.toString());
      } else {
        // tokenAmount === 0: They chose to keep tokens rather than limit
        return t('switchingPoint.choseZeroOverLimit', language)
          .replace('{app}', app);
      }
    }
  };

  const explanation = getSimplifiedExplanation();

  const handleConfirm = () => {
    confirmSwitchingPoint(app);
    onConfirm();
  };

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
            {t('switchingPoint.title', language)}
          </h1>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
            <p className="text-gray-700 mb-4">
              {explanation}
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                [{t('switchingPoint.autoFillNotice', language)
                  .replace('{count}', remainingTokenAmounts.length.toString())
                  .replace('{app}', app)}]
              </p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-center text-gray-600">
              {t('switchingPoint.confirmQuestion', language)}
            </p>
          </div>

          <div className="flex gap-4">
            <Button onClick={onGoBack} className="flex-1">
              {t('switchingPoint.goBack', language)}
            </Button>
            <Button onClick={handleConfirm} className="flex-1 bg-green-600 hover:bg-green-700">
              {t('switchingPoint.confirm', language)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

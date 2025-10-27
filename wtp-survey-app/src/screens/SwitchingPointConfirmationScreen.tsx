import React from 'react';
import { Button } from '../components/Button';
import { TokenCounter } from '../components/TokenCounter';
import { AppName, TOKEN_VALUE_COP, TOKEN_AMOUNTS } from '../types/survey';
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

  // Format the explanation based on the choice
  const getExplanation = () => {
    if (switchedTo === 'limit') {
      // They chose to limit rather than receive/pay tokens
      if (tokenAmount > 0) {
        // They chose to limit rather than receive positive tokens
        return {
          choice: t('switchingPoint.choseLimitOverReceive', language)
            .replace('{app}', app)
            .replace('{tokenAmount}', tokenAmount.toString())
            .replace('{value}', `$${(tokenAmount * TOKEN_VALUE_COP).toLocaleString()}`),
          implication: t('switchingPoint.implicationLimitDescending', language)
            .replaceAll('{app}', app),
        };
      } else if (tokenAmount < 0) {
        // They chose to limit rather than pay tokens
        return {
          choice: t('switchingPoint.choseLimitOverPay', language)
            .replace('{app}', app)
            .replace('{tokenAmount}', Math.abs(tokenAmount).toString())
            .replace('{value}', `$${(Math.abs(tokenAmount) * TOKEN_VALUE_COP).toLocaleString()}`),
          implication: t('switchingPoint.implicationLimitAscending', language)
            .replace('{app}', app),
        };
      } else {
        // tokenAmount === 0: They chose to limit rather than keep tokens unchanged
        return {
          choice: t('switchingPoint.choseLimitOverZero', language)
            .replace('{app}', app),
          implication: t('switchingPoint.implicationLimitFromZero', language)
            .replace('{app}', app),
        };
      }
    } else {
      // They chose tokens rather than limit
      if (tokenAmount < 0) {
        // They chose to pay tokens rather than limit (ascending order switch)
        return {
          choice: t('switchingPoint.chosePayOverLimit', language)
            .replace('{app}', app)
            .replace('{tokenAmount}', Math.abs(tokenAmount).toString())
            .replace('{value}', `$${(Math.abs(tokenAmount) * TOKEN_VALUE_COP).toLocaleString()}`),
          implication: t('switchingPoint.implicationPayAscending', language)
            .replace('{app}', app),
        };
      } else if (tokenAmount > 0) {
        // They chose to receive tokens rather than limit (descending order switch)
        return {
          choice: t('switchingPoint.choseReceiveOverLimit', language)
            .replace('{app}', app)
            .replace('{tokenAmount}', tokenAmount.toString())
            .replace('{value}', `$${(tokenAmount * TOKEN_VALUE_COP).toLocaleString()}`),
          implication: t('switchingPoint.implicationReceiveDescending', language)
            .replace('{app}', app),
        };
      } else {
        // tokenAmount === 0: They chose to keep tokens rather than limit
        return {
          choice: t('switchingPoint.choseZeroOverLimit', language)
            .replace('{app}', app),
          implication: t('switchingPoint.implicationTokensFromZero', language)
            .replace('{app}', app),
        };
      }
    }
  };

  const explanation = getExplanation();

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
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {t('switchingPoint.yourChoice', language)}
              </h2>
              <p className="text-gray-700">
                {explanation.choice}
              </p>
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {t('switchingPoint.whatThisMeans', language)}
              </h2>
              <p className="text-gray-700">
                {explanation.implication}
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                {t('switchingPoint.autoFillNotice', language)
                  .replace('{count}', remainingTokenAmounts.length.toString())
                  .replace('{app}', app)}
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

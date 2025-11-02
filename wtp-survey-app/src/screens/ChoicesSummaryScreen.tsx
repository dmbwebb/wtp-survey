import React, { useState } from 'react';
import { Button } from '../components/Button';
import { TokenCounter } from '../components/TokenCounter';
import { useSurvey } from '../contexts/SurveyContext';
import { Choice } from '../types/survey';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';
import { AudioPlayer } from '../components/AudioPlayer';
import audioW9 from '../assets/audio_files/w9.mp3';

interface ChoicesSummaryScreenProps {
  onNext: () => void;
}

export const ChoicesSummaryScreen: React.FC<ChoicesSummaryScreenProps> = ({ onNext }) => {
  const { language } = useLanguage();
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [hasUpdatedBalance, setHasUpdatedBalance] = useState(false);
  const { surveyData, selectRandomChoice, updateTokenBalance } = useSurvey();

  const startRandomSelection = () => {
    setIsSelecting(true);
    setHighlightedIndex(0);

    // Animate through choices
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % surveyData.choices.length;
      setHighlightedIndex(index);
    }, 150);

    // Stop after 3 seconds and select final choice
    setTimeout(() => {
      clearInterval(interval);
      const choice = selectRandomChoice();

      // Update token balance immediately if they chose tokens
      // Guard against multiple updates
      if (choice.selectedOption === 'tokens' && !hasUpdatedBalance) {
        updateTokenBalance(choice.tokenAmount);
        setHasUpdatedBalance(true);
      }

      const finalIndex = surveyData.choices.findIndex(c => c.id === choice.id);
      setHighlightedIndex(finalIndex);
      setSelectedChoice(choice);
      setIsSelecting(false);
    }, 3000);
  };

  const getOptionText = (choice: Choice, option: 'tokens' | 'limit') => {
    if (option === 'tokens') {
      return choice.tokenAmount >= 0
        ? `${t('choicesSummary.receive', language)} ${choice.tokenAmount} ${t('choicesSummary.tokens', language)}`
        : `${t('choicesSummary.pay', language)} ${Math.abs(choice.tokenAmount)} ${t('choicesSummary.tokens', language)}`;
    }
    return `${t('choicesSummary.limit', language)} ${choice.app} ${t('choicesSummary.limitDuration', language)}`;
  };

  const OptionBox: React.FC<{
    choice: Choice;
    option: 'tokens' | 'limit';
  }> = ({ choice, option }) => {
    const isSelected = choice.selectedOption === option;

    return (
      <div className={`
        flex-1 p-3 rounded-lg border-2 transition-all
        ${isSelected
          ? 'border-blue-500 bg-blue-50 font-semibold'
          : 'border-gray-200 bg-white'
        }
      `}>
        <div className="flex items-center gap-2">
          {isSelected && <span className="text-blue-600">✓</span>}
          <span className={isSelected ? 'text-gray-900' : 'text-gray-600'}>
            {getOptionText(choice, option)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4">
      <div className="w-full flex justify-end mb-4">
        <TokenCounter />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            {t('choicesSummary.title', language)}
          </h1>
          <AudioPlayer audioSrc={audioW9} />
        </div>

        {!selectedChoice && (
          <p className="text-center text-gray-600 mb-6">
            {isSelecting
              ? t('choicesSummary.selecting', language)
              : t('choicesSummary.instruction', language)}
          </p>
        )}

        <div className="space-y-3 mb-8">
          {surveyData.choices.map((choice, index) => (
            <div
              key={choice.id}
              className={`
                p-4 rounded-lg transition-all duration-200
                ${highlightedIndex === index && isSelecting
                  ? 'bg-yellow-100 border-2 border-yellow-400 shadow-lg scale-105'
                  : highlightedIndex === index && selectedChoice
                  ? 'bg-green-100 border-2 border-green-500 shadow-lg'
                  : 'bg-gray-50 border border-gray-200'
                }
              `}
            >
              <div className="flex gap-3 items-center">
                <div className="flex-shrink-0 w-8 text-center">
                  <span className="text-sm font-semibold text-gray-500">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 flex gap-3">
                  <OptionBox choice={choice} option="tokens" />
                  <div className="flex items-center text-gray-400">
                    <span>{t('common.or', language)}</span>
                  </div>
                  <OptionBox choice={choice} option="limit" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {!isSelecting && !selectedChoice && (
          <Button onClick={startRandomSelection} className="w-full">
            {t('choicesSummary.selectButton', language)}
          </Button>
        )}

        {isSelecting && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-lg font-semibold text-gray-900">
              <span className="animate-pulse text-3xl">🎲</span>
              <span>{t('choicesSummary.selectingLabel', language)}</span>
            </div>
          </div>
        )}

        {!isSelecting && selectedChoice && (
          <div className="text-center">
            <div className="mb-4">
              <span className="text-5xl">✅</span>
            </div>
            <p className="text-xl font-semibold text-gray-900 mb-4">
              {t('choicesSummary.choice', language)}{highlightedIndex + 1} {t('choicesSummary.selectedMessage', language)}
            </p>
            <p className="text-gray-600 mb-6">
              {t('choicesSummary.selectedDescription', language)}
            </p>
            <Button onClick={onNext} className="w-full">
              {t('choicesSummary.continueToResults', language)}
            </Button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

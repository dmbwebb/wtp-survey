import React, { useState } from 'react';
import { Button } from '../components/Button';
import { TokenCounter } from '../components/TokenCounter';
import { useSurvey } from '../contexts/SurveyContext';
import { Choice } from '../types/survey';

interface ChoicesSummaryScreenProps {
  onNext: () => void;
}

export const ChoicesSummaryScreen: React.FC<ChoicesSummaryScreenProps> = ({ onNext }) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
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
      if (choice.selectedOption === 'tokens') {
        updateTokenBalance(choice.tokenAmount);
      }

      const finalIndex = surveyData.choices.findIndex(c => c.id === choice.id);
      setHighlightedIndex(finalIndex);
      setSelectedChoice(choice);
      setIsSelecting(false);
    }, 3000);
  };

  const getOptionText = (choice: Choice, option: 'tokens' | 'block') => {
    if (option === 'tokens') {
      return choice.tokenAmount >= 0
        ? `Receive ${choice.tokenAmount} tokens`
        : `Pay ${Math.abs(choice.tokenAmount)} tokens`;
    }
    return `Block ${choice.app} for 1 week`;
  };

  const OptionBox: React.FC<{
    choice: Choice;
    option: 'tokens' | 'block';
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-24">
      <TokenCounter />
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Your Choices
        </h1>

        {!selectedChoice && (
          <p className="text-center text-gray-600 mb-6">
            {isSelecting
              ? 'Randomly selecting one of your choices...'
              : 'Here are all the choices you made. Click below to randomly select one to implement.'}
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
                    <span>or</span>
                  </div>
                  <OptionBox choice={choice} option="block" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {!isSelecting && !selectedChoice && (
          <Button onClick={startRandomSelection} className="w-full">
            Randomly Select One Choice
          </Button>
        )}

        {isSelecting && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-lg font-semibold text-gray-900">
              <span className="animate-pulse text-3xl">🎲</span>
              <span>Selecting...</span>
            </div>
          </div>
        )}

        {!isSelecting && selectedChoice && (
          <div className="text-center">
            <div className="mb-4">
              <span className="text-5xl">✅</span>
            </div>
            <p className="text-xl font-semibold text-gray-900 mb-4">
              Choice #{highlightedIndex + 1} has been selected!
            </p>
            <p className="text-gray-600 mb-6">
              This is the choice that will be implemented.
            </p>
            <Button onClick={onNext} className="w-full">
              Continue to Results
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Button } from '../components/Button';
import { TokenCounter } from '../components/TokenCounter';
import { useSurvey } from '../contexts/SurveyContext';
import { Choice } from '../types/survey';

interface RandomSelectionScreenProps {
  onNext: () => void;
}

export const RandomSelectionScreen: React.FC<RandomSelectionScreenProps> = ({ onNext }) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { surveyData, selectRandomChoice } = useSurvey();

  const startRandomSelection = () => {
    setIsSelecting(true);

    // Animate through choices
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % surveyData.choices.length;
      setCurrentIndex(index);
    }, 100);

    // Stop after 3 seconds and select final choice
    setTimeout(() => {
      clearInterval(interval);
      const choice = selectRandomChoice();
      setSelectedChoice(choice);
      setIsSelecting(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <TokenCounter />
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Random Selection
        </h1>

        {!isSelecting && !selectedChoice && (
          <div className="text-center mb-8">
            <p className="text-lg text-gray-700 mb-6">
              You have completed all the choice questions. Now we will randomly select one of your choices to implement.
            </p>
            <p className="text-gray-600 mb-8">
              Click the button below to randomly select which choice will be implemented.
            </p>
            <Button onClick={startRandomSelection} className="w-full max-w-md mx-auto">
              Select Random Choice
            </Button>
          </div>
        )}

        {isSelecting && (
          <div className="text-center mb-8">
            <div className="animate-pulse mb-4">
              <div className="text-6xl mb-4">🎲</div>
              <p className="text-xl font-semibold text-gray-900">Selecting...</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
              <p className="text-lg font-semibold text-gray-900 mb-2">
                Choice #{currentIndex + 1}
              </p>
              <p className="text-gray-700">
                {surveyData.choices[currentIndex]?.app} - {surveyData.choices[currentIndex]?.tokenAmount} tokens
              </p>
            </div>
          </div>
        )}

        {!isSelecting && selectedChoice && (
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-xl font-semibold text-gray-900 mb-6">
              Selection Complete!
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <p className="text-lg font-semibold text-gray-900 mb-4">
                Selected Choice:
              </p>
              <div className="text-left space-y-2">
                <p className="text-gray-700">
                  <strong>App:</strong> {selectedChoice.app}
                </p>
                <p className="text-gray-700">
                  <strong>Your choice:</strong>{' '}
                  {selectedChoice.selectedOption === 'tokens'
                    ? `Receive ${selectedChoice.tokenAmount} tokens`
                    : `Block ${selectedChoice.app} for 1 week`}
                </p>
              </div>
            </div>
            <Button onClick={onNext} className="w-full">
              View Results
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

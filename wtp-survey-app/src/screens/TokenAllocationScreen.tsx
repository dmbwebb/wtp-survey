import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { TokenCounter } from '../components/TokenCounter';
import { INITIAL_TOKENS, TOKEN_VALUE_COP } from '../types/survey';

interface TokenAllocationScreenProps {
  onNext: () => void;
}

export const TokenAllocationScreen: React.FC<TokenAllocationScreenProps> = ({ onNext }) => {
  const [showCounter, setShowCounter] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowCounter(true), 500);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {showCounter && <TokenCounter />}
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Your Starting Tokens
        </h1>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-blue-100 rounded-full mb-4">
            <span className="text-5xl font-bold text-blue-600">{INITIAL_TOKENS}</span>
          </div>
          <p className="text-xl text-gray-700">
            You have been given <strong>{INITIAL_TOKENS} tokens</strong>
          </p>
          <p className="text-lg text-gray-600 mt-2">
            (Worth ${(INITIAL_TOKENS * TOKEN_VALUE_COP).toLocaleString()} COP)
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-gray-700">
            Your token balance is displayed in the top right corner. It will update throughout the survey as you make your choices.
          </p>
        </div>
        <Button onClick={onNext} className="w-full">
          Continue
        </Button>
      </div>
    </div>
  );
};

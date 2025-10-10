import React from 'react';
import { INITIAL_TOKENS } from '../types/survey';

interface TokenVisualizerProps {
  tokenAmount: number;
}

export const TokenVisualizer: React.FC<TokenVisualizerProps> = ({ tokenAmount }) => {
  const renderCoins = () => {
    const coins: React.ReactElement[] = [];

    if (tokenAmount < 0) {
      // Paying tokens: show grey coins first, then red coins
      const greyCount = INITIAL_TOKENS + tokenAmount; // e.g., 10 + (-5) = 5
      const redCount = Math.abs(tokenAmount);

      // Add grey coins
      for (let i = 0; i < greyCount; i++) {
        coins.push(
          <div
            key={`grey-${i}`}
            className="w-3 h-3 rounded-full bg-gray-400 border border-gray-500"
          />
        );
      }

      // Add red coins
      for (let i = 0; i < redCount; i++) {
        coins.push(
          <div
            key={`red-${i}`}
            className="w-3 h-3 rounded-full bg-red-500 border border-red-600"
          />
        );
      }
    } else if (tokenAmount > 0) {
      // Receiving tokens: show 10 grey coins, then green coins
      // Add initial grey coins
      for (let i = 0; i < INITIAL_TOKENS; i++) {
        coins.push(
          <div
            key={`grey-${i}`}
            className="w-3 h-3 rounded-full bg-gray-400 border border-gray-500"
          />
        );
      }

      // Add green coins
      for (let i = 0; i < tokenAmount; i++) {
        coins.push(
          <div
            key={`green-${i}`}
            className="w-3 h-3 rounded-full bg-green-500 border border-green-600"
          />
        );
      }
    } else {
      // Zero tokens: just show 10 grey coins
      for (let i = 0; i < INITIAL_TOKENS; i++) {
        coins.push(
          <div
            key={`grey-${i}`}
            className="w-3 h-3 rounded-full bg-gray-400 border border-gray-500"
          />
        );
      }
    }

    return coins;
  };

  const getLabelColor = () => {
    if (tokenAmount < 0) return 'text-red-600';
    if (tokenAmount > 0) return 'text-green-600';
    return 'text-gray-600';
  };

  const getLabel = () => {
    if (tokenAmount < 0) return `${tokenAmount}`;
    if (tokenAmount > 0) return `+${tokenAmount}`;
    return '0';
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-3">
      <div className="flex flex-wrap justify-center gap-1 max-w-[200px]">
        {renderCoins()}
      </div>
      <div className={`text-sm font-bold ${getLabelColor()}`}>
        {getLabel()}
      </div>
    </div>
  );
};

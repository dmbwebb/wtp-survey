import React from 'react';
import { INITIAL_TOKENS } from '../types/survey';

interface TokenVisualizerProps {
  tokenAmount: number;
}

export const TokenVisualizer: React.FC<TokenVisualizerProps> = ({ tokenAmount }) => {
  const renderCoins = () => {
    const rows: React.ReactElement[] = [];
    const firstRowCoins: React.ReactElement[] = [];
    const secondRowCoins: React.ReactElement[] = [];

    if (tokenAmount < 0) {
      // Paying tokens: show grey coins first, then red coins
      const greyCount = INITIAL_TOKENS + tokenAmount; // e.g., 10 + (-5) = 5
      const redCount = Math.abs(tokenAmount);

      // Add grey coins
      for (let i = 0; i < greyCount; i++) {
        firstRowCoins.push(
          <div
            key={`grey-${i}`}
            className="w-3 h-3 rounded-full bg-gray-400 border border-gray-500"
          />
        );
      }

      // Add red coins
      for (let i = 0; i < redCount; i++) {
        firstRowCoins.push(
          <div
            key={`red-${i}`}
            className="w-3 h-3 rounded-full bg-red-500 border border-red-600"
          />
        );
      }

      rows.push(
        <div key="row-1" className="flex gap-1 justify-center">
          {firstRowCoins}
        </div>
      );
    } else if (tokenAmount > 0) {
      // Receiving tokens: show 10 grey coins on first row, then green coins on second row
      // Add initial grey coins (first row)
      for (let i = 0; i < INITIAL_TOKENS; i++) {
        firstRowCoins.push(
          <div
            key={`grey-${i}`}
            className="w-3 h-3 rounded-full bg-gray-400 border border-gray-500"
          />
        );
      }

      // Add green coins (second row)
      for (let i = 0; i < tokenAmount; i++) {
        secondRowCoins.push(
          <div
            key={`green-${i}`}
            className="w-3 h-3 rounded-full bg-green-500 border border-green-600"
          />
        );
      }

      rows.push(
        <div key="row-1" className="flex gap-1 justify-center">
          {firstRowCoins}
        </div>
      );
      rows.push(
        <div key="row-2" className="flex gap-1 justify-center">
          {secondRowCoins}
        </div>
      );
    } else {
      // Zero tokens: just show 10 grey coins
      for (let i = 0; i < INITIAL_TOKENS; i++) {
        firstRowCoins.push(
          <div
            key={`grey-${i}`}
            className="w-3 h-3 rounded-full bg-gray-400 border border-gray-500"
          />
        );
      }

      rows.push(
        <div key="row-1" className="flex gap-1 justify-center">
          {firstRowCoins}
        </div>
      );
    }

    return rows;
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
      <div className="flex flex-col gap-1">
        {renderCoins()}
      </div>
      <div className={`text-sm font-bold ${getLabelColor()}`}>
        {getLabel()}
      </div>
    </div>
  );
};

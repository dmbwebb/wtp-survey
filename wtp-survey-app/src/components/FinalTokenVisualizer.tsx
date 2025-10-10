import React from 'react';

interface FinalTokenVisualizerProps {
  tokenCount: number;
}

export const FinalTokenVisualizer: React.FC<FinalTokenVisualizerProps> = ({ tokenCount }) => {
  const renderCoins = () => {
    const coins: React.ReactElement[] = [];

    // Show all tokens in blue (the participant's final balance)
    for (let i = 0; i < tokenCount; i++) {
      coins.push(
        <div
          key={`token-${i}`}
          className="w-4 h-4 rounded-full bg-blue-500 border-2 border-blue-600"
        />
      );
    }

    return coins;
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-4">
      <div className="flex flex-wrap justify-center gap-1.5 max-w-[280px]">
        {renderCoins()}
      </div>
    </div>
  );
};

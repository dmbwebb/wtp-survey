import React from 'react';
import { APP_VERSION } from '../version';

export const VersionInfo: React.FC = () => {
  return (
    <div className="fixed bottom-16 right-4 text-gray-400 text-sm z-40">
      <span>{APP_VERSION}</span>
    </div>
  );
};

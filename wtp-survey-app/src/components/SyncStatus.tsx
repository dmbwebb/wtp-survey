import React from 'react';
import { useSurvey } from '../contexts/SurveyContext';

export const SyncStatus: React.FC = () => {
  const { syncStatus } = useSurvey();
  const isOnline = navigator.onLine;

  return (
    <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-3 text-sm border border-gray-200 z-50">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="font-medium">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      <div className="space-y-1 text-gray-600">
        <div className="flex justify-between gap-4">
          <span>Synced:</span>
          <span className="font-medium text-green-600">{syncStatus.synced}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Pending:</span>
          <span className="font-medium text-yellow-600">{syncStatus.pending}</span>
        </div>
        {syncStatus.failed > 0 && (
          <div className="flex justify-between gap-4">
            <span>Failed:</span>
            <span className="font-medium text-red-600">{syncStatus.failed}</span>
          </div>
        )}
      </div>

      {syncStatus.lastSuccessfulSync && (
        <div className="mt-2 text-xs text-gray-500">
          Last sync: {new Date(syncStatus.lastSuccessfulSync).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

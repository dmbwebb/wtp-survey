import React, { useState } from 'react';
import { useSurvey } from '../contexts/SurveyContext';
import { Button } from './Button';

export const ManualSyncButton: React.FC = () => {
  const { triggerManualSync, syncStatus } = useSurvey();
  const [isSyncing, setIsSyncing] = useState(false);
  const isOnline = navigator.onLine;

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await triggerManualSync();
      alert('Sync completed successfully!');
    } catch (error) {
      console.error('Sync error:', error);
      alert('Sync failed. Please check internet connection and try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  const buttonLabel = () => {
    if (isSyncing) return 'Syncing...';
    if (syncStatus.pending === 0) return 'All Synced';
    return `Sync Now (${syncStatus.pending})`;
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Button
        onClick={handleSync}
        disabled={isSyncing || !isOnline}
        variant="primary"
        title="Sync all surveys (including in-progress and already-synced) to Firebase"
      >
        {buttonLabel()}
      </Button>
      {!isOnline && (
        <div className="text-xs text-red-600 mt-1 text-center">
          Connect to internet to sync
        </div>
      )}
    </div>
  );
};

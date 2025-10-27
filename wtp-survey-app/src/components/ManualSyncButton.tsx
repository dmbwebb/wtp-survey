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

  if (syncStatus.pending === 0) {
    return null; // Don't show button if nothing to sync
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Button
        onClick={handleSync}
        disabled={isSyncing || !isOnline}
        variant="primary"
      >
        {isSyncing ? 'Syncing...' : `Sync Now (${syncStatus.pending})`}
      </Button>
      {!isOnline && (
        <div className="text-xs text-red-600 mt-1 text-center">
          Connect to internet to sync
        </div>
      )}
    </div>
  );
};

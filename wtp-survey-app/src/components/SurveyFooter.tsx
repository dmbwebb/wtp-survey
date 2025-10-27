import React, { useState } from 'react';
import { useSurvey } from '../contexts/SurveyContext';
import { Button } from './Button';
import { APP_VERSION } from '../version';

export const SurveyFooter: React.FC = () => {
  const { syncStatus, exportAllData, triggerManualSync } = useSurvey();
  const [isExporting, setIsExporting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const isOnline = navigator.onLine;
  const totalSurveys = syncStatus.synced + syncStatus.pending;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportAllData();
      alert('Data exported successfully! Check your downloads folder.');
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

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

  const getSyncButtonLabel = (short: boolean = false) => {
    if (isSyncing) return 'Syncing...';
    if (syncStatus.pending === 0) return short ? 'All Synced' : 'All Synced';
    return short ? `Sync (${syncStatus.pending})` : `Sync Now (${syncStatus.pending})`;
  };

  return (
    <footer className="bg-white border-t border-gray-200 py-3 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Mobile layout - stack vertically */}
        <div className="flex flex-col gap-3 sm:hidden">
          {/* Status row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="font-medium">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <span className="text-green-600">✓ {syncStatus.synced}</span>
              {syncStatus.pending > 0 && <span className="text-yellow-600">⏳ {syncStatus.pending}</span>}
              {syncStatus.failed > 0 && <span className="text-red-600">✗ {syncStatus.failed}</span>}
            </div>
            <span className="text-xs text-gray-400">{APP_VERSION}</span>
          </div>

          {/* Buttons row */}
          <div className="flex gap-2 justify-between">
            <Button
              onClick={handleSync}
              disabled={isSyncing || !isOnline}
              variant="primary"
              className="flex-1 text-sm py-2"
            >
              {getSyncButtonLabel(true)}
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting || totalSurveys === 0}
              variant="secondary"
              className="flex-1 text-sm py-2"
            >
              {isExporting ? 'Exporting...' : `Export (${totalSurveys})`}
            </Button>
          </div>

          {!isOnline && syncStatus.pending > 0 && (
            <div className="text-xs text-red-600 text-center">
              Connect to internet to sync
            </div>
          )}
        </div>

        {/* Desktop layout - single row */}
        <div className="hidden sm:flex items-center justify-between gap-4">
          {/* Left section - Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="font-medium">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            <div className="h-4 w-px bg-gray-300" />
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="text-green-600">Synced: {syncStatus.synced}</span>
              <span className="text-yellow-600">Pending: {syncStatus.pending}</span>
              {syncStatus.failed > 0 && <span className="text-red-600">Failed: {syncStatus.failed}</span>}
            </div>
          </div>

          {/* Center section - Buttons */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSync}
              disabled={isSyncing || !isOnline}
              variant="primary"
              className="text-sm"
            >
              {getSyncButtonLabel(false)}
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting || totalSurveys === 0}
              variant="secondary"
              className="text-sm"
            >
              {isExporting ? 'Exporting...' : `Export Data (${totalSurveys})`}
            </Button>
          </div>

          {/* Right section - Version */}
          <div className="text-sm text-gray-400">
            {APP_VERSION}
          </div>
        </div>

        {/* Offline warning for desktop */}
        {!isOnline && syncStatus.pending > 0 && (
          <div className="hidden sm:block text-xs text-red-600 text-center mt-2">
            Connect to internet to sync
          </div>
        )}
      </div>
    </footer>
  );
};

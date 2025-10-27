import React, { useState } from 'react';
import { useSurvey } from '../contexts/SurveyContext';
import { Button } from './Button';

export const ExportButton: React.FC = () => {
  const { exportAllData, syncStatus } = useSurvey();
  const [isExporting, setIsExporting] = useState(false);

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

  const totalSurveys = syncStatus.synced + syncStatus.pending;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={handleExport}
        disabled={isExporting || totalSurveys === 0}
        variant="secondary"
      >
        {isExporting ? 'Exporting...' : `Export Data (${totalSurveys})`}
      </Button>
    </div>
  );
};

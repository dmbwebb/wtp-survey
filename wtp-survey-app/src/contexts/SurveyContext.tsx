import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SurveyData, Choice, APPS, INITIAL_TOKENS, AppName, TOKEN_AMOUNTS, SyncStatus } from '../types/survey';
import {
  saveToIndexedDB,
  getAllFromIndexedDB,
  updateSyncStatus,
  safeIndexedDBOperation,
  StoredSurvey,
} from '../utils/indexedDB';
import { syncSurveyToFirebase, getDeviceId } from '../utils/firebase';
import { v4 as uuidv4 } from 'uuid';

interface SurveyContextType {
  surveyData: SurveyData;
  currentSurveyId: string;
  syncStatus: SyncStatus;
  setParticipantId: (id: string) => void;
  setComprehensionAnswer: (field: 'tokenValue' | 'rewardType', value: string) => void;
  addChoice: (choice: Choice) => void;
  removeChoice: (app: AppName, tokenAmount: number) => void;
  selectRandomChoice: () => Choice;
  updateTokenBalance: (amount: number) => void;
  completeSurvey: () => Promise<void>;
  resetSurvey: () => Promise<void>;
  setSwitchingPoint: (app: AppName, tokenAmount: number, switchedTo: 'tokens' | 'limit') => void;
  confirmSwitchingPoint: (app: AppName) => void;
  autoFillChoices: (app: AppName) => void;
  clearAutoFilledChoices: (app: AppName) => void;
  hasSwitchingPoint: (app: AppName) => boolean;
  exportAllData: () => Promise<void>;
  triggerManualSync: () => Promise<void>;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const createInitialSurveyData = (): SurveyData => ({
  participantId: '',
  startedAt: new Date().toISOString(),
  appOrder: shuffleArray(APPS),
  tokenOrder: Math.random() < 0.5 ? 'ascending' : 'descending',
  choices: [],
  selectedChoice: null,
  completedAt: null,
  tokenBalance: INITIAL_TOKENS,
  comprehensionAnswers: {
    tokenValue: '',
    rewardType: '',
  },
  switchingPoints: {},
});

export const SurveyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [surveyData, setSurveyData] = useState<SurveyData>(() => {
    const saved = localStorage.getItem('surveyData');
    return saved ? JSON.parse(saved) : createInitialSurveyData();
  });

  const [currentSurveyId, setCurrentSurveyId] = useState<string>(() => {
    const saved = localStorage.getItem('currentSurveyId');
    return saved || uuidv4();
  });

  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    pending: 0,
    synced: 0,
    failed: 0,
    lastSyncAttempt: null,
    lastSuccessfulSync: null,
  });

  // Save to both localStorage and IndexedDB on every change
  useEffect(() => {
    const saveDualStorage = async () => {
      // Save to localStorage (existing behavior)
      localStorage.setItem('surveyData', JSON.stringify(surveyData));
      localStorage.setItem('currentSurveyId', currentSurveyId);

      // Save to IndexedDB (new redundancy)
      const storedSurvey: StoredSurvey = {
        id: currentSurveyId,
        surveyData,
        synced: false,
        syncedAt: null,
        createdAt: surveyData.startedAt,
        deviceId: getDeviceId(),
      };

      await safeIndexedDBOperation(
        () => saveToIndexedDB(storedSurvey),
        undefined
      );
    };

    saveDualStorage();
  }, [surveyData, currentSurveyId]);

  // Load sync status on mount
  useEffect(() => {
    const loadSyncStatus = async () => {
      const allSurveys = await safeIndexedDBOperation(
        () => getAllFromIndexedDB(),
        []
      );

      const pending = allSurveys.filter(s => !s.synced).length;
      const synced = allSurveys.filter(s => s.synced).length;

      setSyncStatus(prev => ({
        ...prev,
        pending,
        synced,
      }));
    };

    loadSyncStatus();
  }, []);

  // Auto-sync when online
  useEffect(() => {
    const handleOnline = async () => {
      console.log('Internet connection detected, attempting auto-sync...');
      await triggerAutoSync();
    };

    window.addEventListener('online', handleOnline);

    // Also try syncing on mount if online
    if (navigator.onLine) {
      handleOnline();
    }

    return () => window.removeEventListener('online', handleOnline);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setParticipantId = (id: string) => {
    setSurveyData(prev => ({ ...prev, participantId: id }));
  };

  const setComprehensionAnswer = (field: 'tokenValue' | 'rewardType', value: string) => {
    setSurveyData(prev => ({
      ...prev,
      comprehensionAnswers: {
        ...prev.comprehensionAnswers,
        [field]: value,
      },
    }));
  };

  const addChoice = (choice: Choice) => {
    setSurveyData(prev => {
      // Check if a choice with the same app and tokenAmount already exists
      const existingIndex = prev.choices.findIndex(
        c => c.app === choice.app && c.tokenAmount === choice.tokenAmount
      );

      if (existingIndex !== -1) {
        // Update existing choice
        const updatedChoices = [...prev.choices];
        updatedChoices[existingIndex] = choice;
        return { ...prev, choices: updatedChoices };
      } else {
        // Add new choice
        return { ...prev, choices: [...prev.choices, choice] };
      }
    });
  };

  const removeChoice = (app: AppName, tokenAmount: number) => {
    setSurveyData(prev => ({
      ...prev,
      choices: prev.choices.filter(
        choice => !(choice.app === app && choice.tokenAmount === tokenAmount)
      ),
    }));
  };

  const selectRandomChoice = (): Choice => {
    const randomIndex = Math.floor(Math.random() * surveyData.choices.length);
    const selected = surveyData.choices[randomIndex];
    setSurveyData(prev => ({ ...prev, selectedChoice: selected }));
    return selected;
  };

  const updateTokenBalance = (amount: number) => {
    setSurveyData(prev => ({ ...prev, tokenBalance: prev.tokenBalance + amount }));
  };

  const completeSurvey = async () => {
    const completedData = {
      ...surveyData,
      completedAt: new Date().toISOString(),
    };

    setSurveyData(completedData);

    // Mark as completed in IndexedDB
    const storedSurvey: StoredSurvey = {
      id: currentSurveyId,
      surveyData: completedData,
      synced: false,
      syncedAt: null,
      createdAt: surveyData.startedAt,
      deviceId: getDeviceId(),
    };

    await safeIndexedDBOperation(
      () => saveToIndexedDB(storedSurvey),
      undefined
    );

    // Try to sync immediately if online (auto-sync only completed surveys)
    if (navigator.onLine) {
      await triggerAutoSync();
    }
  };

  const refreshSyncStatus = async () => {
    const allSurveys = await safeIndexedDBOperation(
      () => getAllFromIndexedDB(),
      []
    );

    const pending = allSurveys.filter(s => !s.synced).length;
    const synced = allSurveys.filter(s => s.synced).length;

    setSyncStatus(prev => ({
      ...prev,
      pending,
      synced,
    }));
  };

  const resetSurvey = async () => {
    // Generate new survey ID
    const newId = uuidv4();

    // Reset survey data
    const newSurveyData = createInitialSurveyData();
    setSurveyData(newSurveyData);

    // Update survey ID in both state and localStorage
    setCurrentSurveyId(newId);
    localStorage.setItem('currentSurveyId', newId);

    // Refresh sync status to show updated counts
    await refreshSyncStatus();
  };

  const exportAllData = async () => {
    // Get all surveys from IndexedDB
    const allSurveys = await safeIndexedDBOperation(
      () => getAllFromIndexedDB(),
      []
    );

    // Create export object
    const exportData = {
      exportedAt: new Date().toISOString(),
      deviceId: getDeviceId(),
      totalSurveys: allSurveys.length,
      syncedSurveys: allSurveys.filter(s => s.synced).length,
      pendingSurveys: allSurveys.filter(s => !s.synced).length,
      surveys: allSurveys,
    };

    // Create downloadable JSON file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wtp-survey-export-${getDeviceId()}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const triggerAutoSync = async () => {
    if (!navigator.onLine) {
      console.warn('Cannot sync: device is offline');
      return;
    }

    setSyncStatus(prev => ({
      ...prev,
      lastSyncAttempt: new Date().toISOString(),
    }));

    try {
      // Get all unsynced surveys
      const allSurveys = await safeIndexedDBOperation(
        () => getAllFromIndexedDB(),
        []
      );

      // Auto-sync only COMPLETED surveys
      const unsyncedSurveys = allSurveys.filter(s => !s.synced && s.surveyData.completedAt);

      console.log(`Auto-syncing ${unsyncedSurveys.length} completed surveys...`);

      let successCount = 0;
      let failCount = 0;

      // Sync each survey
      for (const survey of unsyncedSurveys) {
        try {
          await syncSurveyToFirebase(survey);
          await updateSyncStatus(survey.id, true);
          successCount++;
        } catch (error) {
          console.error(`Failed to sync survey ${survey.id}:`, error);
          failCount++;
        }
      }

      // Update sync status
      const allSurveysAfterSync = await safeIndexedDBOperation(
        () => getAllFromIndexedDB(),
        []
      );

      setSyncStatus({
        pending: allSurveysAfterSync.filter(s => !s.synced).length,
        synced: allSurveysAfterSync.filter(s => s.synced).length,
        failed: failCount,
        lastSyncAttempt: new Date().toISOString(),
        lastSuccessfulSync: successCount > 0 ? new Date().toISOString() : syncStatus.lastSuccessfulSync,
      });

      console.log(`Auto-sync complete: ${successCount} succeeded, ${failCount} failed`);
    } catch (error) {
      console.error('Auto-sync error:', error);
    }
  };

  const triggerManualSync = async () => {
    if (!navigator.onLine) {
      console.warn('Cannot sync: device is offline');
      return;
    }

    setSyncStatus(prev => ({
      ...prev,
      lastSyncAttempt: new Date().toISOString(),
    }));

    try {
      // Get all unsynced surveys
      const allSurveys = await safeIndexedDBOperation(
        () => getAllFromIndexedDB(),
        []
      );

      // Manual sync: sync ALL unsynced surveys (including in-progress)
      const unsyncedSurveys = allSurveys.filter(s => !s.synced);
      const completedCount = unsyncedSurveys.filter(s => s.surveyData.completedAt).length;
      const inProgressCount = unsyncedSurveys.filter(s => !s.surveyData.completedAt).length;

      console.log(`Manual sync: ${completedCount} completed, ${inProgressCount} in-progress surveys...`);

      let successCount = 0;
      let failCount = 0;

      // Sync each survey
      for (const survey of unsyncedSurveys) {
        try {
          await syncSurveyToFirebase(survey);
          await updateSyncStatus(survey.id, true);
          successCount++;
        } catch (error) {
          console.error(`Failed to sync survey ${survey.id}:`, error);
          failCount++;
        }
      }

      // Update sync status
      const allSurveysAfterSync = await safeIndexedDBOperation(
        () => getAllFromIndexedDB(),
        []
      );

      setSyncStatus({
        pending: allSurveysAfterSync.filter(s => !s.synced).length,
        synced: allSurveysAfterSync.filter(s => s.synced).length,
        failed: failCount,
        lastSyncAttempt: new Date().toISOString(),
        lastSuccessfulSync: successCount > 0 ? new Date().toISOString() : syncStatus.lastSuccessfulSync,
      });

      console.log(`Manual sync complete: ${successCount} succeeded, ${failCount} failed`);
    } catch (error) {
      console.error('Manual sync error:', error);
    }
  };

  const setSwitchingPoint = (app: AppName, tokenAmount: number, switchedTo: 'tokens' | 'limit') => {
    setSurveyData(prev => ({
      ...prev,
      switchingPoints: {
        ...prev.switchingPoints,
        [app]: {
          tokenAmount,
          switchedTo,
          confirmed: false,
        },
      },
    }));
  };

  const confirmSwitchingPoint = (app: AppName) => {
    setSurveyData(prev => {
      const switchingPoint = prev.switchingPoints[app];
      if (!switchingPoint) return prev;

      return {
        ...prev,
        switchingPoints: {
          ...prev.switchingPoints,
          [app]: {
            ...switchingPoint,
            confirmed: true,
          },
        },
      };
    });
  };

  const autoFillChoices = (app: AppName) => {
    setSurveyData(prev => {
      const switchingPoint = prev.switchingPoints[app];
      if (!switchingPoint || !switchingPoint.confirmed) return prev;

      // Get the order of token amounts based on survey order
      const orderedTokenAmounts = prev.tokenOrder === 'ascending'
        ? [...TOKEN_AMOUNTS].reverse()
        : TOKEN_AMOUNTS;

      // Find the index of the switching point
      const switchIndex = orderedTokenAmounts.findIndex(amt => amt === switchingPoint.tokenAmount);
      if (switchIndex === -1) return prev;

      // Get all token amounts after the switching point
      const remainingTokenAmounts = orderedTokenAmounts.slice(switchIndex + 1);

      // Create auto-filled choices for remaining token amounts
      const autoFilledChoices: Choice[] = remainingTokenAmounts.map(tokenAmount => ({
        id: `${app}-${tokenAmount}-${Date.now()}-autofilled`,
        app,
        tokenAmount,
        selectedOption: switchingPoint.switchedTo,
        timestamp: new Date().toISOString(),
        autoFilled: true,
      }));

      // Add auto-filled choices to existing choices
      return {
        ...prev,
        choices: [...prev.choices, ...autoFilledChoices],
      };
    });
  };

  const clearAutoFilledChoices = (app: AppName) => {
    setSurveyData(prev => ({
      ...prev,
      choices: prev.choices.filter(choice => !(choice.app === app && choice.autoFilled)),
      switchingPoints: {
        ...prev.switchingPoints,
        [app]: undefined,
      },
    }));
  };

  const hasSwitchingPoint = (app: AppName): boolean => {
    return !!surveyData.switchingPoints[app]?.confirmed;
  };

  return (
    <SurveyContext.Provider
      value={{
        surveyData,
        currentSurveyId,
        syncStatus,
        setParticipantId,
        setComprehensionAnswer,
        addChoice,
        removeChoice,
        selectRandomChoice,
        updateTokenBalance,
        completeSurvey,
        resetSurvey,
        setSwitchingPoint,
        confirmSwitchingPoint,
        autoFillChoices,
        clearAutoFilledChoices,
        hasSwitchingPoint,
        exportAllData,
        triggerManualSync,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
};

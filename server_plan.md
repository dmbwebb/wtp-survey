# Offline-First Survey System Implementation Plan

## Overview

This document outlines the implementation plan for converting the WTP survey application into a robust offline-first system with automatic cloud synchronization, manual data export, and redundant local storage. The system is designed for field deployment on ~50 Android phones conducting surveys in schools with limited or intermittent internet connectivity.

---

## Architecture Goals

1. **Zero data loss**: Multiple redundancy layers to ensure no survey data is lost
2. **Offline-first**: Full survey functionality without internet connection
3. **Automatic sync**: Seamless data upload when internet becomes available
4. **Manual backup**: Export capability as failsafe mechanism
5. **Multi-survey support**: Single phone can collect multiple surveys before syncing

---

## System Architecture

### Data Flow Diagram

```
Student completes survey
         ↓
    [Survey Data]
         ↓
    ┌────┴────┐
    ↓         ↓
localStorage  IndexedDB (redundant storage on phone)
         ↓
    [Sync Queue]
         ↓
    Internet available?
         ↓
    ┌────┴────┐
    Yes       No
     ↓         ↓
  Firebase   Wait & Retry
     ↓
[Cloud Database]
     ↓
Researcher Dashboard
     ↓
Export to CSV/Excel
```

### Storage Layers

**Layer 1: Dual Local Storage**
- Primary: localStorage (current implementation)
- Backup: IndexedDB (new)
- Both updated simultaneously on every data change

**Layer 2: Cloud Database**
- Firebase Firestore for production data
- Automatic sync when internet available
- Persistent queue for failed sync attempts

**Layer 3: Manual Export**
- JSON file download capability
- Contains all surveys (synced + unsynced)
- User-initiated via "Export Data" button

---

## Technical Implementation

### 1. Firebase Setup

#### 1.1 Firebase Project Configuration

**Create Firebase Project:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project: "wtp-survey-production"
3. Enable Firestore Database
4. Enable Authentication (Anonymous auth)
5. Set up security rules (see section 1.3)

**Install Dependencies:**
```bash
cd wtp-survey-app
npm install firebase
```

**Firebase Configuration File:**
Create `src/config/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
```

#### 1.2 Firestore Data Model

**Collection Structure:**
```
surveys/
  ├─ {surveyId}/
  │   ├─ surveyId: string (UUID)
  │   ├─ deviceId: string (unique phone identifier)
  │   ├─ participantId: string
  │   ├─ startedAt: timestamp
  │   ├─ completedAt: timestamp
  │   ├─ appOrder: string[] (e.g., ['TikTok', 'WhatsApp'])
  │   ├─ tokenOrder: string ('ascending' | 'descending')
  │   ├─ tokenBalance: number
  │   ├─ comprehensionAnswers: {
  │   │   tokenValue: string
  │   │   rewardType: string
  │   │ }
  │   ├─ choices: [
  │   │   {
  │   │     id: string
  │   │     app: string
  │   │     tokenAmount: number
  │   │     selectedOption: string ('tokens' | 'block')
  │   │     timestamp: timestamp
  │   │   }
  │   │ ]
  │   ├─ selectedChoice: object (the randomly selected choice)
  │   ├─ syncedAt: timestamp (when uploaded to Firebase)
  │   ├─ version: string (app version number)
```

#### 1.3 Firestore Security Rules

**File: `firestore.rules`**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anonymous authenticated users to write surveys
    match /surveys/{surveyId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null;
      allow update: if request.auth != null &&
                       resource.data.deviceId == request.resource.data.deviceId;
      allow delete: if false; // Prevent accidental deletion
    }

    // Admin-only access for dashboard (implement later)
    match /admin/{document=**} {
      allow read, write: if false; // Configure admin auth later
    }
  }
}
```

**Deploy Rules:**
```bash
firebase deploy --only firestore:rules
```

---

### 2. IndexedDB Implementation

#### 2.1 IndexedDB Utility Functions

Create `src/utils/indexedDB.ts`:

```typescript
import { SurveyData } from '../types/survey';

const DB_NAME = 'WTPSurveyDB';
const DB_VERSION = 1;
const STORE_NAME = 'surveys';

/**
 * Open IndexedDB connection
 */
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        objectStore.createIndex('participantId', 'participantId', { unique: false });
        objectStore.createIndex('synced', 'synced', { unique: false });
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
};

/**
 * Save survey to IndexedDB
 */
export const saveToIndexedDB = async (survey: SurveyData & { id: string; synced: boolean }): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const objectStore = transaction.objectStore(STORE_NAME);

    objectStore.put(survey);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error('IndexedDB save error:', error);
    throw error;
  }
};

/**
 * Get all surveys from IndexedDB
 */
export const getAllFromIndexedDB = async (): Promise<Array<SurveyData & { id: string; synced: boolean }>> => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const objectStore = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = objectStore.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('IndexedDB get all error:', error);
    return [];
  }
};

/**
 * Get unsynced surveys from IndexedDB
 */
export const getUnsyncedFromIndexedDB = async (): Promise<Array<SurveyData & { id: string; synced: boolean }>> => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const objectStore = transaction.objectStore(STORE_NAME);
    const index = objectStore.index('synced');

    return new Promise((resolve, reject) => {
      const request = index.getAll(false);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('IndexedDB get unsynced error:', error);
    return [];
  }
};

/**
 * Update sync status for a survey
 */
export const updateSyncStatus = async (id: string, synced: boolean): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const objectStore = transaction.objectStore(STORE_NAME);

    const request = objectStore.get(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const survey = request.result;
        if (survey) {
          survey.synced = synced;
          survey.syncedAt = synced ? new Date().toISOString() : null;
          objectStore.put(survey);
        }
      };

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error('IndexedDB update sync status error:', error);
    throw error;
  }
};

/**
 * Clear all surveys from IndexedDB (use with caution)
 */
export const clearIndexedDB = async (): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const objectStore = transaction.objectStore(STORE_NAME);

    objectStore.clear();

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error('IndexedDB clear error:', error);
    throw error;
  }
};

/**
 * Get survey by ID
 */
export const getSurveyById = async (id: string): Promise<(SurveyData & { id: string; synced: boolean }) | null> => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const objectStore = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = objectStore.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('IndexedDB get by id error:', error);
    return null;
  }
};
```

#### 2.2 Error Handling & Fallbacks

Add to `src/utils/indexedDB.ts`:

```typescript
/**
 * Test if IndexedDB is available and working
 */
export const isIndexedDBAvailable = (): boolean => {
  try {
    return 'indexedDB' in window && indexedDB !== null;
  } catch {
    return false;
  }
};

/**
 * Safe wrapper for IndexedDB operations
 */
export const safeIndexedDBOperation = async <T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> => {
  if (!isIndexedDBAvailable()) {
    console.warn('IndexedDB not available, using fallback');
    return fallback;
  }

  try {
    return await operation();
  } catch (error) {
    console.error('IndexedDB operation failed:', error);
    return fallback;
  }
};
```

---

### 3. Modified Survey Context with Dual Storage

#### 3.1 Enhanced SurveyContext Types

Update `src/types/survey.ts`:

```typescript
// Add to existing types

export interface StoredSurvey {
  id: string; // UUID for this survey instance
  surveyData: SurveyData;
  synced: boolean;
  syncedAt: string | null;
  createdAt: string;
  deviceId: string;
}

export interface SyncStatus {
  pending: number;
  synced: number;
  failed: number;
  lastSyncAttempt: string | null;
  lastSuccessfulSync: string | null;
}
```

#### 3.2 Update SurveyContext Implementation

Modify `src/contexts/SurveyContext.tsx`:

```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SurveyData, Choice, APPS, INITIAL_TOKENS, StoredSurvey, SyncStatus } from '../types/survey';
import {
  saveToIndexedDB,
  getAllFromIndexedDB,
  updateSyncStatus,
  safeIndexedDBOperation
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
  selectRandomChoice: () => Choice;
  updateTokenBalance: (amount: number) => void;
  completeSurvey: () => void;
  resetSurvey: () => void;
  exportAllData: () => void;
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
});

export const SurveyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [surveyData, setSurveyData] = useState<SurveyData>(() => {
    // Load current survey from localStorage
    const saved = localStorage.getItem('currentSurvey');
    return saved ? JSON.parse(saved) : createInitialSurveyData();
  });

  const [currentSurveyId] = useState<string>(() => {
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
      localStorage.setItem('currentSurvey', JSON.stringify(surveyData));
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
      await triggerManualSync();
    };

    window.addEventListener('online', handleOnline);

    // Also try syncing on mount if online
    if (navigator.onLine) {
      handleOnline();
    }

    return () => window.removeEventListener('online', handleOnline);
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
      const existingIndex = prev.choices.findIndex(
        c => c.app === choice.app && c.tokenAmount === choice.tokenAmount
      );

      if (existingIndex !== -1) {
        const updatedChoices = [...prev.choices];
        updatedChoices[existingIndex] = choice;
        return { ...prev, choices: updatedChoices };
      } else {
        return { ...prev, choices: [...prev.choices, choice] };
      }
    });
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

    // Try to sync immediately if online
    if (navigator.onLine) {
      await triggerManualSync();
    }
  };

  const resetSurvey = () => {
    const newSurveyData = createInitialSurveyData();
    setSurveyData(newSurveyData);
    localStorage.setItem('currentSurveyId', uuidv4());
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

      const unsyncedSurveys = allSurveys.filter(s => !s.synced && s.surveyData.completedAt);

      console.log(`Syncing ${unsyncedSurveys.length} surveys...`);

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

      console.log(`Sync complete: ${successCount} succeeded, ${failCount} failed`);
    } catch (error) {
      console.error('Sync error:', error);
    }
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
        selectRandomChoice,
        updateTokenBalance,
        completeSurvey,
        resetSurvey,
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
```

---

### 4. Firebase Sync Utilities

Create `src/utils/firebase.ts`:

```typescript
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { StoredSurvey } from '../types/survey';
import { version } from '../version';

/**
 * Get or create a unique device ID
 */
export const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('deviceId');

  if (!deviceId) {
    // Generate unique ID based on timestamp and random number
    deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('deviceId', deviceId);
  }

  return deviceId;
};

/**
 * Sync a single survey to Firebase
 */
export const syncSurveyToFirebase = async (survey: StoredSurvey): Promise<void> => {
  try {
    const surveyRef = doc(collection(db, 'surveys'), survey.id);

    const dataToSync = {
      ...survey.surveyData,
      surveyId: survey.id,
      deviceId: survey.deviceId,
      syncedAt: serverTimestamp(),
      version: version,
      // Ensure timestamps are in correct format
      startedAt: new Date(survey.surveyData.startedAt),
      completedAt: survey.surveyData.completedAt ? new Date(survey.surveyData.completedAt) : null,
    };

    await setDoc(surveyRef, dataToSync);

    console.log(`Successfully synced survey ${survey.id} to Firebase`);
  } catch (error) {
    console.error(`Error syncing survey ${survey.id}:`, error);
    throw error;
  }
};

/**
 * Check if Firebase is reachable
 */
export const isFirebaseReachable = async (): Promise<boolean> => {
  try {
    // Try to read from a test collection (will fail if offline or Firebase down)
    const testRef = doc(collection(db, '_test'), 'connectivity');
    await setDoc(testRef, { timestamp: serverTimestamp() });
    return true;
  } catch (error) {
    console.warn('Firebase not reachable:', error);
    return false;
  }
};
```

---

### 5. UI Components

#### 5.1 Sync Status Indicator

Create `src/components/SyncStatus.tsx`:

```typescript
import React from 'react';
import { useSurvey } from '../contexts/SurveyContext';

export const SyncStatus: React.FC = () => {
  const { syncStatus } = useSurvey();
  const isOnline = navigator.onLine;

  return (
    <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-3 text-sm border border-gray-200">
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
```

#### 5.2 Export Button Component

Create `src/components/ExportButton.tsx`:

```typescript
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
    <div className="fixed bottom-4 right-4">
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
```

#### 5.3 Manual Sync Button

Create `src/components/ManualSyncButton.tsx`:

```typescript
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
    <div className="fixed bottom-4 left-4">
      <Button
        onClick={handleSync}
        disabled={isSyncing || !isOnline}
        variant="primary"
      >
        {isSyncing ? 'Syncing...' : `Sync Now (${syncStatus.pending})`}
      </Button>
      {!isOnline && (
        <div className="text-xs text-red-600 mt-1">
          Connect to internet to sync
        </div>
      )}
    </div>
  );
};
```

#### 5.4 Update App.tsx

Modify `src/App.tsx` to include new components:

```typescript
import React, { useState } from 'react';
import { SurveyProvider, useSurvey } from './contexts/SurveyContext';
import { LanguageProvider } from './contexts/LanguageContext';
// ... existing imports ...
import { SyncStatus } from './components/SyncStatus';
import { ExportButton } from './components/ExportButton';
import { ManualSyncButton } from './components/ManualSyncButton';

// ... existing SurveyFlow component ...

function App() {
  return (
    <LanguageProvider>
      <SurveyProvider>
        <SurveyFlow />
        <LanguageToggle />
        <VersionInfo />
        <SyncStatus />
        <ExportButton />
        <ManualSyncButton />
      </SurveyProvider>
    </LanguageProvider>
  );
}

export default App;
```

---

### 6. PWA Configuration

#### 6.1 Service Worker for Offline Support

Create `public/service-worker.js`:

```javascript
const CACHE_NAME = 'wtp-survey-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/css/main.css',
  '/static/js/main.js',
];

// Install service worker and cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Update service worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

#### 6.2 PWA Manifest

Create `public/manifest.json`:

```json
{
  "name": "WTP Survey App",
  "short_name": "WTP Survey",
  "description": "Willingness-to-pay survey for app blocking research",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

#### 6.3 Register Service Worker

Update `src/main.tsx`:

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
```

#### 6.4 Update index.html

Add to `index.html` `<head>`:

```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#3b82f6">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<link rel="apple-touch-icon" href="/icon-192.png">
```

---

### 7. Installation & Dependencies

#### 7.1 Required NPM Packages

```bash
cd wtp-survey-app

# Firebase
npm install firebase

# UUID generation
npm install uuid
npm install --save-dev @types/uuid

# Service worker (if using workbox)
npm install workbox-webpack-plugin
```

#### 7.2 Update package.json Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "deploy": "npm run build && firebase deploy",
    "firebase:init": "firebase init",
    "firebase:deploy:rules": "firebase deploy --only firestore:rules"
  }
}
```

---

### 8. Testing Strategy

#### 8.1 Offline Testing Checklist

- [ ] Complete survey while offline → verify data saved locally
- [ ] Complete 3 surveys offline → verify all saved to localStorage + IndexedDB
- [ ] Go online → verify auto-sync triggers
- [ ] Verify all 3 surveys uploaded to Firebase
- [ ] Export data manually → verify JSON contains all surveys
- [ ] Clear localStorage → verify IndexedDB still has data
- [ ] Restore from IndexedDB to localStorage

#### 8.2 Sync Testing Scenarios

**Scenario 1: Perfect Sync**
1. Complete survey offline
2. Connect to internet
3. Verify auto-sync uploads data
4. Check Firebase console for survey document

**Scenario 2: Interrupted Sync**
1. Complete 5 surveys offline
2. Connect to poor internet (throttle to 3G)
3. Start sync, disconnect mid-sync
4. Verify partial sync completes (some surveys uploaded)
5. Reconnect, verify remaining surveys sync

**Scenario 3: Extended Offline Period**
1. Complete 20 surveys over 2 days (no internet)
2. Export data manually each day (backup)
3. On day 3, connect to internet
4. Verify all 20 surveys sync successfully

**Scenario 4: Data Recovery**
1. Complete survey
2. Simulate localStorage corruption (manually delete)
3. Verify IndexedDB recovery restores data
4. Sync successfully

#### 8.3 Multi-Device Testing

- [ ] Test on Android 10, 11, 12, 13
- [ ] Test on different browsers (Chrome, Firefox, Samsung Internet)
- [ ] Test on low-end devices (2GB RAM)
- [ ] Test with 50 concurrent devices syncing

---

### 9. Deployment Process

#### 9.1 Pre-Deployment Checklist

- [ ] Firebase project created and configured
- [ ] Firestore security rules deployed
- [ ] PWA manifest and service worker configured
- [ ] All dependencies installed
- [ ] Version number updated in `src/version.ts`
- [ ] Build succeeds without errors
- [ ] Offline functionality tested locally

#### 9.2 Deployment Steps

**Step 1: Build Production Bundle**
```bash
cd wtp-survey-app
npm run build
```

**Step 2: Deploy to Hosting**
```bash
# For GitHub Pages
npm run deploy

# For Firebase Hosting (alternative)
firebase deploy --only hosting
```

**Step 3: Deploy Firestore Rules**
```bash
firebase deploy --only firestore:rules
```

**Step 4: Test Deployed Version**
- Visit deployed URL
- Test offline mode (disable internet, navigate app)
- Complete test survey
- Verify sync when reconnected
- Export data manually

#### 9.3 Phone Setup for Field Deployment

**For each of the 50 phones:**

1. **Install Chrome/Browser**
   - Ensure up-to-date Chrome installed
   - Enable JavaScript

2. **Load Survey App**
   - Navigate to deployed URL (e.g., `https://dmbwebb.github.io/wtp-survey/`)
   - Click "Add to Home Screen"
   - App installs as PWA

3. **Configure Settings**
   - Disable browser cache clearing
   - Keep screen on during surveys
   - Enable WiFi auto-connect (for hotel/office sync)

4. **Test Installation**
   - Complete one test survey
   - Verify data saves locally
   - Export data to test export functionality

5. **Assign Device ID**
   - Each phone will auto-generate unique device ID on first use
   - Optionally label phone physically (e.g., "Phone #7")

---

### 10. Field Operations Guide

#### 10.1 Daily Workflow for Survey Staff

**Morning:**
1. Ensure all phones are charged
2. Open survey app on each phone
3. Verify app loads correctly (offline mode works)

**During Surveys:**
1. Hand phone to student
2. Student completes survey (app works offline)
3. After completion, reset for next student (new survey)
4. Repeat for all students

**Evening:**
1. Connect all phones to WiFi
2. Wait for auto-sync to complete (check sync status in app)
3. **IMPORTANT:** Click "Export Data" on each phone as backup
4. Upload exported JSON files to Google Drive folder
5. Verify all surveys synced (check researcher dashboard)

#### 10.2 Troubleshooting Common Issues

**Issue: "Sync Failed" message**
- Solution: Check internet connection, try manual sync button

**Issue: Export button doesn't download file**
- Solution: Check phone storage space, clear downloads folder

**Issue: App won't load offline**
- Solution: Load app once while online (caches resources)

**Issue: Data seems missing**
- Solution: Check IndexedDB recovery, export data manually

**Issue: Phone runs out of storage**
- Solution: Sync data, then optionally clear old synced surveys

---

### 11. Researcher Dashboard (Future Enhancement)

#### 11.1 Dashboard Features (Not in Phase 1)

This section outlines future enhancements for monitoring and data collection:

**Real-time Monitoring:**
- View all surveys in Firebase console
- See which devices have synced recently
- Monitor completion rates

**Data Export:**
- Download all surveys as CSV
- Filter by date, participant ID, device
- Aggregate statistics

**Device Management:**
- View all active devices
- See last sync time per device
- Alert if device hasn't synced in 24 hours

#### 11.2 Accessing Data from Firebase

**Using Firebase Console:**
1. Go to Firebase Console → Firestore Database
2. Navigate to "surveys" collection
3. View individual survey documents
4. Export to JSON or CSV

**Using Firebase Admin SDK (for bulk export):**
```javascript
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

async function exportAllSurveys() {
  const snapshot = await db.collection('surveys').get();
  const surveys = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  console.log(JSON.stringify(surveys, null, 2));
}
```

---

### 12. Security & Privacy Considerations

#### 12.1 Data Protection

**On Device:**
- Data stored in browser storage (not encrypted by default)
- No personal identifying information beyond participant ID
- Local data cleared after successful sync (optional)

**In Transit:**
- All Firebase communication uses HTTPS
- Data encrypted during transmission

**In Cloud:**
- Firebase Firestore provides encryption at rest
- Access controlled by security rules
- Only authenticated users can write surveys

#### 12.2 Participant Privacy

**Recommendations:**
1. Use pseudonymized participant IDs (not names)
2. Do not collect device information beyond anonymous device ID
3. Inform participants data is stored on device and synced to cloud
4. Provide option to export/delete participant data if requested

#### 12.3 IRB Compliance

**Data Collection Notice:**
- Inform participants survey data is stored locally and synced online
- Explain device ID is anonymized
- Clarify data retention policy

**Consent Form Updates:**
- Add language about offline storage and cloud sync
- Mention manual export backup process
- Explain data security measures

---

### 13. Maintenance & Monitoring

#### 13.1 Version Management

When updating app:
1. Update version in `src/version.ts`
2. Update service worker cache name (`CACHE_NAME`)
3. Deploy new version
4. Test on one device before updating all phones

#### 13.2 Monitoring Sync Health

**Weekly:**
- Check Firebase console for survey count
- Verify expected number of surveys received
- Review sync failure logs

**After Each Field Session:**
- Verify all devices synced successfully
- Download manual exports as backup
- Check for any missing participant IDs

#### 13.3 Data Backup Strategy

**Redundancy Layers:**
1. Phone localStorage (primary)
2. Phone IndexedDB (backup)
3. Firebase Firestore (cloud primary)
4. Manual JSON exports (offline backup)
5. Firebase automated backups (disaster recovery)

**Backup Schedule:**
- Real-time: Auto-sync to Firebase when online
- Daily: Manual export from each phone
- Weekly: Export all Firebase data to local storage

---

### 14. Performance Optimization

#### 14.1 Storage Limits

**localStorage:**
- Limit: ~5-10 MB
- Each survey: ~5-10 KB
- Capacity: ~500-1000 surveys per device

**IndexedDB:**
- Limit: ~50 MB minimum (browser dependent)
- Can store 5,000+ surveys

**Recommendation:**
- Clear synced surveys after successful upload (optional)
- Warn user if approaching storage limits

#### 14.2 Sync Optimization

**Batch Syncing:**
- Sync up to 50 surveys per batch
- Wait 100ms between batches (avoid rate limiting)
- Retry failed syncs with exponential backoff

**Network Efficiency:**
- Compress survey data before upload (if needed)
- Use Firebase offline persistence
- Implement delta sync (only new surveys)

---

### 15. Rollback Plan

If issues arise in production:

**Immediate Rollback:**
1. Revert to previous GitHub Pages deployment
2. Phones still have local data (not lost)
3. Manual export still works

**Data Recovery:**
1. All phones have surveys in IndexedDB + localStorage
2. Manual export can be used to collect data
3. Firebase data remains intact (previous syncs preserved)

**Communication Plan:**
1. Notify survey staff of technical issue
2. Switch to manual export mode only
3. Fix issue and redeploy
4. Resume auto-sync

---

## Appendix A: File Structure

```
wtp-survey-app/
├── src/
│   ├── config/
│   │   └── firebase.ts          (new)
│   ├── utils/
│   │   ├── indexedDB.ts         (new)
│   │   └── firebase.ts          (new)
│   ├── contexts/
│   │   ├── SurveyContext.tsx    (modified)
│   │   └── LanguageContext.tsx  (existing)
│   ├── components/
│   │   ├── SyncStatus.tsx       (new)
│   │   ├── ExportButton.tsx     (new)
│   │   ├── ManualSyncButton.tsx (new)
│   │   └── ...                  (existing)
│   ├── types/
│   │   └── survey.ts            (modified)
│   └── App.tsx                  (modified)
├── public/
│   ├── service-worker.js        (new)
│   ├── manifest.json            (new)
│   ├── icon-192.png             (new)
│   └── icon-512.png             (new)
├── firestore.rules              (new)
├── firebase.json                (new)
└── package.json                 (modified)
```

---

## Appendix B: Environment Variables

Create `.env` file (DO NOT commit to git):

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Update `src/config/firebase.ts` to use environment variables:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
```

---

## Appendix C: Cost Estimates

### Firebase Free Tier Limits

**Firestore:**
- Storage: 1 GB
- Document reads: 50,000/day
- Document writes: 20,000/day
- Document deletes: 20,000/day

**Expected Usage (50 phones, 10 surveys/phone/day):**
- Total surveys/day: 500
- Storage per survey: ~10 KB
- Total storage: ~5 MB/day, ~150 MB/month

**Conclusion:** Free tier is MORE than sufficient for this project.

---

## Appendix D: Contact & Support

**Implementation Questions:**
- Review this document
- Check Firebase documentation
- Test locally before deploying

**Production Issues:**
- Check Firebase console logs
- Review browser console errors
- Export data manually as backup

**Future Enhancements:**
- Dashboard development
- Advanced analytics
- Multi-language support expansion

---

## Summary

This implementation plan provides:
1. ✅ **Offline-first architecture** with PWA
2. ✅ **Auto-sync to Firebase** when online
3. ✅ **Manual export** as failsafe
4. ✅ **IndexedDB redundancy** for data protection
5. ✅ **Multi-survey support** on single device
6. ✅ **Zero data loss** through multiple redundancy layers

The system is designed for non-technical field staff, provides maximum data protection, and scales to 50 concurrent devices with minimal operational overhead.

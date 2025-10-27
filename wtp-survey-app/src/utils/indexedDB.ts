import { SurveyData } from '../types/survey';

const DB_NAME = 'WTPSurveyDB';
const DB_VERSION = 1;
const STORE_NAME = 'surveys';

export interface StoredSurvey {
  id: string;
  surveyData: SurveyData;
  synced: boolean;
  syncedAt: string | null;
  createdAt: string;
  deviceId: string;
}

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
        objectStore.createIndex('participantId', 'surveyData.participantId', { unique: false });
        objectStore.createIndex('synced', 'synced', { unique: false });
        objectStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
  });
};

/**
 * Save survey to IndexedDB
 */
export const saveToIndexedDB = async (survey: StoredSurvey): Promise<void> => {
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
export const getAllFromIndexedDB = async (): Promise<StoredSurvey[]> => {
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
export const getUnsyncedFromIndexedDB = async (): Promise<StoredSurvey[]> => {
  try {
    const allSurveys = await getAllFromIndexedDB();
    return allSurveys.filter(survey => !survey.synced);
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
export const getSurveyById = async (id: string): Promise<StoredSurvey | null> => {
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

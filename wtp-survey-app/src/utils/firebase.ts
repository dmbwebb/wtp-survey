import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { StoredSurvey } from './indexedDB';
import { APP_VERSION } from '../version';

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
      version: APP_VERSION,
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
    // Try to write to a test collection (will fail if offline or Firebase down)
    const testRef = doc(collection(db, '_test'), 'connectivity');
    await setDoc(testRef, { timestamp: serverTimestamp() });
    return true;
  } catch (error) {
    console.warn('Firebase not reachable:', error);
    return false;
  }
};

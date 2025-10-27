import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3uhzlt8xEAreucraxJS3nsx__a4d-tq8",
  authDomain: "wtp-survey-production.firebaseapp.com",
  projectId: "wtp-survey-production",
  storageBucket: "wtp-survey-production.firebasestorage.app",
  messagingSenderId: "1050941271087",
  appId: "1:1050941271087:web:dd807bc5973a6c0f57aada"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Sign in anonymously on initialization
signInAnonymously(auth).catch((error) => {
  console.error('Anonymous auth error:', error);
});

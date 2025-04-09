'use client';

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { config } from './config';

// Initialize Firebase
let app;
let analytics;

if (!getApps().length) {
  try {
    app = initializeApp(config.firebase);
    // Analytics działa tylko w przeglądarce
    if (typeof window !== 'undefined') {
      analytics = getAnalytics(app);
    }
    console.log('Firebase zostało zainicjalizowane pomyślnie');
  } catch (error) {
    console.error('Błąd podczas inicjalizacji Firebase:', error);
    throw error;
  }
} else {
  app = getApps()[0];
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export { analytics };
export default app; 
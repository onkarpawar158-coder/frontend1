import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithCredential,
  RecaptchaVerifier,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
} from 'firebase/firestore';

/**
 * ============================================================================
 * FIREBASE CONFIGURATION
 * ============================================================================
 * Paste your Firebase Web App credentials below.
 *
 * HOW TO GET THESE KEYS:
 * 1. Open Firebase Console: https://console.firebase.google.com/
 * 2. Create or select your project (e.g. "bharat-netra").
 * 3. In Project Settings (⚙️) -> General tab -> Under "Your apps", add a Web app (</>).
 * 4. Copy the `firebaseConfig` object and paste its values into the fields below.
 *
 * AUTHENTICATION SETUP (Firebase Console -> Build -> Authentication -> Sign-in method):
 * 1. Phone Provider:
 *    - Click "Phone", toggle "Enable", and click "Save".
 *    - Under "Phone numbers for testing", add:
 *        Phone: +91 9876543210
 *        Verification Code: 4473
 * 2. Google Provider:
 *    - Click "Google", toggle "Enable", choose support email, and click "Save".
 *
 * FIRESTORE DATABASE SETUP (Firebase Console -> Build -> Firestore Database):
 * 1. Click "Create database" -> Start in test mode (or configure security rules).
 * 2. Location: Choose your preferred region (e.g. asia-south1).
 * ============================================================================
 */
export const firebaseConfig = {
  apiKey: "AIzaSyBhc_WYfi8A91crvBnPebajf3-wFeO7gkQ",
  authDomain: "sihproject-47cf8.firebaseapp.com",
  projectId: "sihproject-47cf8",
  storageBucket: "sihproject-47cf8.firebasestorage.app",
  messagingSenderId: "134885355696",
  appId: "1:134885355696:web:d5491ace6543218f944b75",
  measurementId: "G-648ZTQ5YSD",
  // Google OAuth 2.0 Web Client ID from Firebase Console (Auth -> Sign-in Method -> Google -> Web SDK configuration)
  googleWebClientId: "134885355696-krsp6grp876m2nst6eftplkvrdols245.apps.googleusercontent.com",
  // Google OAuth 2.0 Android Client ID for com.sih2026.bharatnetra
  googleAndroidClientId: "134885355696-rdo0bjgbjn6ud6935gacm89ap0gr9rfs.apps.googleusercontent.com",
};

// Check if actual configuration keys have been provided
export const isFirebaseConfigured = () => {
  return (
    Boolean(firebaseConfig.apiKey) &&
    firebaseConfig.apiKey !== "YOUR_API_KEY" &&
    firebaseConfig.apiKey !== "" &&
    Boolean(firebaseConfig.projectId) &&
    firebaseConfig.projectId !== "YOUR_PROJECT_ID"
  );
};

// Initialize Firebase App safely (singleton)
let app = null;
let auth = null;
let db = null;

try {
  if (isFirebaseConfigured()) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

    try {
      if (Platform.OS === 'web') {
        auth = getAuth(app);
      } else {
        auth = initializeAuth(app, {
          persistence: getReactNativePersistence(AsyncStorage),
        });
      }
    } catch (authInitErr) {
      // If auth was already initialized (e.g. hot reload), use existing instance
      auth = getAuth(app);
    }

    db = getFirestore(app);
    console.log('[Firebase] Initialized with persistent auth for project:', firebaseConfig.projectId);
  } else {
    console.warn(
      '[Firebase] Placeholder keys detected in src/config/firebaseConfig.js. ' +
      'App will run in Interactive Demo / Simulation mode until live Firebase keys are added.'
    );
  }
} catch (error) {
  console.error('[Firebase] Initialization error:', error);
}

/**
 * Setup Invisible reCAPTCHA Verifier for Web Phone Auth
 * @param {string} containerId - DOM ID of the container element
 * @returns {RecaptchaVerifier|null}
 */
export const setupRecaptcha = (containerId = 'recaptcha-container') => {
  if (typeof window === 'undefined') return null;

  if (!auth) {
    console.warn('[Firebase] Auth is not initialized. Please configure firebaseConfig.js');
    return null;
  }

  try {
    // If verifier already exists in memory, reuse it
    if (window.recaptchaVerifier) {
      return window.recaptchaVerifier;
    }

    // Ensure container element exists in DOM
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      document.body.appendChild(container);
    } else {
      container.innerHTML = '';
    }

    window.recaptchaVerifier = new RecaptchaVerifier(auth, container, {
      size: 'invisible',
      callback: () => {
        console.log('[Firebase] reCAPTCHA verified successfully.');
      },
      'expired-callback': () => {
        console.warn('[Firebase] reCAPTCHA expired.');
      },
    });

    return window.recaptchaVerifier;
  } catch (error) {
    console.warn('[Firebase] Warning setting up RecaptchaVerifier:', error);
    if (window.recaptchaVerifier) {
      return window.recaptchaVerifier;
    }
    return null;
  }
};

export {
  app,
  auth,
  db,
  getAuth,
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithCredential,
  RecaptchaVerifier,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
};

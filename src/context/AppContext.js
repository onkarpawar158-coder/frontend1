import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEMES } from '../constants/theme';
import { INITIAL_VEHICLES } from '../constants/vehicles';
import { getTranslation } from '../translations';
import {
  auth,
  db,
  onAuthStateChanged,
  signOut,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  isFirebaseConfigured,
} from '../config/firebaseConfig';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // User & Auth State
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedTheme, setSelectedTheme] = useState('dark');
  const [locationPermissionStatus, setLocationPermissionStatus] = useState('pending'); // 'pending' | 'granted'
  const [mockGpsCoordinates, setMockGpsCoordinates] = useState('18.734° N, 73.6578° E');
  const [availableVehicles, setAvailableVehicles] = useState(INITIAL_VEHICLES);
  const [selectedVehicle, setSelectedVehicle] = useState(INITIAL_VEHICLES[2]); // Default: Car
  const [currentOnboardingStep, setCurrentOnboardingStep] = useState(1);

  // Email Notification & Alert Dispatch State
  const [dispatchedEmails, setDispatchedEmails] = useState([]);
  const [lastDispatchedEmail, setLastDispatchedEmail] = useState(null);

  // Listen to Firebase Auth state changes and restore persisted session
  useEffect(() => {
    if (!isFirebaseConfigured() || !auth) {
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          if (db) {
            const userDocRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userDocRef);
            if (userSnap.exists()) {
              const data = userSnap.data();
              setUserProfile(data);
              if (data.name) setUserName(data.name);
              if (data.email) setUserEmail(data.email);
              if (data.phoneNumber) {
                setMobileNumber(data.phoneNumber.replace('+91', '').trim());
              }
            } else {
              const initialProfile = {
                uid: user.uid,
                name: user.displayName || userName || 'Logistics Partner',
                email: user.email || userEmail || '',
                phoneNumber: user.phoneNumber || (mobileNumber ? `+91${mobileNumber}` : ''),
                photoURL: user.photoURL || '',
                provider: user.providerData?.[0]?.providerId || 'email',
                verifiedAt: new Date().toISOString(),
              };
              setUserProfile(initialProfile);
              if (user.email) setUserEmail(user.email);
            }
          }
        } catch (error) {
          console.error('[AppContext] Error fetching Firestore user data:', error);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Save or update user profile in Firestore
   */
  const saveUserProfileToFirestore = async ({
    uid,
    name,
    email,
    phoneNumber,
    photoURL,
    provider = 'email',
  }) => {
    if (!uid) return null;

    const resolvedEmail = email || userEmail || '';
    const resolvedName = name || userName || 'Logistics Partner';

    const dataToSave = {
      uid,
      name: resolvedName,
      email: resolvedEmail,
      phoneNumber: phoneNumber || (mobileNumber ? `+91${mobileNumber}` : ''),
      photoURL: photoURL || '',
      provider,
      updatedAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured() && db) {
      try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            ...dataToSave,
            createdAt: serverTimestamp(),
          });
          console.log('[Firestore] Created new user profile:', uid);
        } else {
          await setDoc(userRef, dataToSave, { merge: true });
          console.log('[Firestore] Updated existing user profile:', uid);
        }
      } catch (err) {
        console.error('[Firestore] Error saving user record:', err);
      }
    }

    setUserProfile(dataToSave);
    if (resolvedName) setUserName(resolvedName);
    if (resolvedEmail) setUserEmail(resolvedEmail);
    if (phoneNumber) {
      setMobileNumber(phoneNumber.replace('+91', '').trim());
    }

    return dataToSave;
  };

  /**
   * Dispatch an Email Alert / Login Notification to the user's verified email address
   */
  const sendEmailAlert = ({ title, type, location, severity = 'normal', desc, to }) => {
    const targetEmail = to || userProfile?.email || userEmail || 'user@bharatnetra.gov.in';
    const newEmail = {
      id: `mail_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      to: targetEmail,
      title: title || 'Bharat Netra Corridor Alert',
      type: type || 'System Advisory',
      location: location || 'North Eastern Region (NER)',
      severity: severity || 'normal',
      desc: desc || '',
      timestamp: new Date().toISOString(),
      status: 'DELIVERED',
    };

    setDispatchedEmails((prev) => [newEmail, ...prev]);
    setLastDispatchedEmail(newEmail);

    // If on web or active network, ping FormSubmit
    if (targetEmail && targetEmail.includes('@') && !targetEmail.endsWith('.internal')) {
      try {
        fetch(`https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            _subject: `[Bharat Netra] ${title}`,
            Application: 'Bharat Netra Emergency & Logistics Portal',
            Recipient: targetEmail,
            Severity: severity.toUpperCase(),
            Location: location,
            Message: desc,
            DispatchedAt: new Date().toLocaleString(),
          }),
        })
          .then((r) => r.json())
          .then((data) => console.log('[EmailService] Outbound email delivered via FormSubmit:', data))
          .catch((err) => console.log('[EmailService] Outbound email network note:', err.message));
      } catch (err) {
        console.warn('[EmailService] Fetch email error:', err);
      }
    }

    return newEmail;
  };

  /**
   * Log out user from Firebase and clear session
   */
  const logout = async () => {
    if (isFirebaseConfigured() && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.error('[Firebase] Sign out error:', e);
      }
    }
    setCurrentUser(null);
    setUserProfile(null);
    setUserName('');
    setUserEmail('');
    setMobileNumber('');
    setDispatchedEmails([]);
    setLastDispatchedEmail(null);
    setConfirmationResult(null);
    resetOnboarding();
  };

  // Toggle Theme between Dark and Light
  const toggleTheme = () => {
    setSelectedTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Add extra vehicle to available vehicles list
  const addVehicleToFleet = (vehicle) => {
    setAvailableVehicles((prev) => {
      const exists = prev.some((v) => v.id === vehicle.id);
      if (exists) return prev;
      return [...prev, vehicle];
    });
    setSelectedVehicle(vehicle);
  };

  // Reset entire onboarding
  const resetOnboarding = () => {
    setUserName('');
    setUserEmail('driver@bharatnetra.gov.in');
    setMobileNumber('');
    setSelectedLanguage('en');
    setSelectedTheme('dark');
    setLocationPermissionStatus('pending');
    setAvailableVehicles(INITIAL_VEHICLES);
    setSelectedVehicle(INITIAL_VEHICLES[2]);
    setCurrentOnboardingStep(1);
    setDispatchedEmails([]);
    setLastDispatchedEmail(null);
  };

  // Current active theme object
  const theme = THEMES[selectedTheme] || THEMES.dark;

  // Translation helper bound to active language
  const t = (key) => getTranslation(selectedLanguage, key);

  return (
    <AppContext.Provider
      value={{
        // Auth & Firebase State
        currentUser,
        setCurrentUser,
        userProfile,
        setUserProfile,
        authLoading,
        confirmationResult,
        setConfirmationResult,
        saveUserProfileToFirestore,
        logout,
        isFirebaseConfigured: isFirebaseConfigured(),

        // User and Settings State
        userName,
        setUserName,
        userEmail,
        setUserEmail,
        mobileNumber,
        setMobileNumber,
        selectedLanguage,
        setSelectedLanguage,
        selectedTheme,
        setSelectedTheme,
        toggleTheme,
        theme,
        locationPermissionStatus,
        setLocationPermissionStatus,
        mockGpsCoordinates,
        setMockGpsCoordinates,
        availableVehicles,
        setAvailableVehicles,
        selectedVehicle,
        setSelectedVehicle,
        addVehicleToFleet,
        currentOnboardingStep,
        setCurrentOnboardingStep,
        resetOnboarding,
        t,

        // Email Alert Routing System
        dispatchedEmails,
        setDispatchedEmails,
        lastDispatchedEmail,
        setLastDispatchedEmail,
        sendEmailAlert,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;

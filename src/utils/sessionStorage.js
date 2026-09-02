import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_STORAGE_KEY = '@bharat_netra_user_session';
const LAST_AUTH_SCREEN_KEY = '@bharat_netra_last_auth_state';

/**
 * Save user authentication session to persistent storage
 * @param {Object} sessionData - { uid, email, name, phoneNumber, photoURL, provider, userProfile }
 */
export const persistUserSession = async (sessionData) => {
  try {
    if (!sessionData) return;
    const serialized = JSON.stringify({
      ...sessionData,
      savedAt: new Date().toISOString(),
    });

    await AsyncStorage.setItem(SESSION_STORAGE_KEY, serialized);

    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(SESSION_STORAGE_KEY, serialized);
    }
  } catch (error) {
    console.warn('[SessionStorage] Error persisting user session:', error);
  }
};

/**
 * Retrieve user authentication session from persistent storage
 * @returns {Promise<Object|null>}
 */
export const getPersistedUserSession = async () => {
  try {
    const data = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }

    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      const webData = window.localStorage.getItem(SESSION_STORAGE_KEY);
      if (webData) {
        return JSON.parse(webData);
      }
    }
  } catch (error) {
    console.warn('[SessionStorage] Error retrieving user session:', error);
  }
  return null;
};

/**
 * Completely clear persisted user authentication session
 */
export const removePersistedUserSession = async () => {
  try {
    await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
    await AsyncStorage.removeItem(LAST_AUTH_SCREEN_KEY);

    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      window.localStorage.removeItem(LAST_AUTH_SCREEN_KEY);
    }
  } catch (error) {
    console.warn('[SessionStorage] Error removing user session:', error);
  }
};

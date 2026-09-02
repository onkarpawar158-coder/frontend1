import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  Animated,
  Dimensions,
  Image,
  ActivityIndicator,
  Easing,
  Keyboard,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useApp } from '../context/AppContext';
import { RADIUS, SPACING } from '../constants/theme';
import {
  app,
  auth,
  getAuth,
  firebaseConfig,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
  setupRecaptcha,
  isFirebaseConfigured,
} from '../config/firebaseConfig';

// Initialize Native Google Sign-In with Web Client ID for Firebase Auth token verification
if (Platform.OS !== 'web') {
  try {
    GoogleSignin.configure({
      webClientId: firebaseConfig.googleWebClientId,
      offlineAccess: false,
    });
  } catch (initErr) {
    console.warn('[GoogleSignin] Init note:', initErr);
  }
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Official Multi-Color Google Brand Logo
const OfficialGoogleIcon = ({ size = 20 }) => {
  if (Platform.OS === 'web') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{ marginRight: 12, flexShrink: 0 }}
      >
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        />
      </svg>
    );
  }
  return (
    <Image
      source={require('../assets/google_icon.png')}
      style={{ width: size, height: size, marginRight: 12 }}
      resizeMode="contain"
    />
  );
};

export const SignInScreen = ({ navigation }) => {
  const {
    userName,
    setUserName,
    userEmail,
    setUserEmail,
    mobileNumber,
    setMobileNumber,
    toggleTheme,
    selectedTheme,
    saveUserProfileToFirestore,
    confirmationResult,
    setConfirmationResult,
    sendEmailAlert,
    t,
  } = useApp();

  const isDark = selectedTheme === 'dark';

  // Email & Password States
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [resetStatus, setResetStatus] = useState({ type: '', message: '' });

  // Loading States
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // Reset fields on screen focus
  useFocusEffect(
    useCallback(() => {
      setInputEmail('');
      setInputPassword('');
      setEmailError('');
      setPasswordError('');
      setResetStatus({ type: '', message: '' });
      setShowPassword(false);
      setIsSigningIn(false);
      setIsGoogleLoading(false);
      setIsResettingPassword(false);
    }, [])
  );

  // Welcome Heading Entrance Animations
  const welcomeFadeAnim = useRef(new Animated.Value(0)).current;
  const welcomeSlideAnim = useRef(new Animated.Value(-12)).current;
  const welcomeScaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(welcomeFadeAnim, {
        toValue: 1,
        duration: 1300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
      Animated.timing(welcomeSlideAnim, {
        toValue: 0,
        duration: 1300,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: true,
      }),
      Animated.timing(welcomeScaleAnim, {
        toValue: 1,
        duration: 1300,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  /**
   * Primary Email + Password Sign In Handler
   */
  const handleSignInWithEmail = async () => {
    Keyboard.dismiss();
    const cleanEmail = inputEmail.trim();
    const rawPassword = inputPassword;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    if (!cleanEmail) {
      setEmailError(t('emailRequired') || 'Please enter your email address');
      isValid = false;
    } else if (!emailRegex.test(cleanEmail)) {
      setEmailError('Please enter a valid email address (e.g. driver@bharatnetra.gov.in)');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!rawPassword || rawPassword.length < 6) {
      setPasswordError(t('passwordRequired') || 'Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!isValid) return;

    setIsSigningIn(true);
    setPasswordError('');
    setEmailError('');

    // Derive display name from email username
    const rawName = cleanEmail.split('@')[0];
    const derivedName =
      rawName
        .replace(/[._]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase()) || 'Logistics Partner';

    try {
      const activeAuth = auth || (app ? getAuth(app) : null);
      if (!isFirebaseConfigured() || !activeAuth || typeof signInWithEmailAndPassword !== 'function') {
        throw new Error('Firebase authentication is not configured.');
      }

      // 1. Smart Authentication: Try Sign In first, or auto-create account for new users
      let userCredential = null;
      try {
        userCredential = await signInWithEmailAndPassword(activeAuth, cleanEmail, rawPassword);
      } catch (signInErr) {
        // If user doesn't exist yet, automatically register them as a new user
        if (
          signInErr.code === 'auth/user-not-found' ||
          signInErr.code === 'auth/invalid-credential' ||
          signInErr.code === 'auth/invalid-login-credentials'
        ) {
          try {
            userCredential = await createUserWithEmailAndPassword(activeAuth, cleanEmail, rawPassword);
          } catch (signUpErr) {
            // If the email is already in use with a different password, preserve the original error
            if (signUpErr.code === 'auth/email-already-in-use') {
              throw signInErr;
            } else {
              throw signUpErr;
            }
          }
        } else {
          throw signInErr;
        }
      }

      const user = userCredential.user;

      // 2. Safely sync user profile without blocking or rejecting a valid login
      try {
        await saveUserProfileToFirestore({
          uid: user.uid,
          name: user.displayName || derivedName,
          email: user.email || cleanEmail,
          provider: 'email',
        });
      } catch (dbErr) {
        console.warn('[SignIn] Firestore profile sync note:', dbErr.message);
      }

      setUserName(user.displayName || derivedName);
      setUserEmail(user.email || cleanEmail);

      // Dispatch Simple Login Confirmation Email to User
      if (typeof sendEmailAlert === 'function') {
        sendEmailAlert({
          title: 'Successful Login to Bharat Netra',
          type: 'Login Notification',
          location: 'NER Geotagged Gateway (Guwahati Hub)',
          severity: 'normal',
          desc: `Hello ${derivedName},\n\nYou have successfully logged in to your Bharat Netra account (${cleanEmail}) on ${new Date().toLocaleString()}.\n\nYour live vehicle tracking, corridor hazard notifications, and route safety advisories are now active for your trip.\n\nSafe journeys,\nTeam Bharat Netra`,
          to: cleanEmail,
        });
      }

      setInputEmail('');
      setInputPassword('');
      navigation.navigate('ProfileLanguage');
    } catch (firebaseErr) {
      console.log('[EmailAuth] Authentication note:', firebaseErr.code, firebaseErr.message);
      let errorMsg = 'Incorrect email or password. Please try again.';
      if (
        firebaseErr.code === 'auth/wrong-password' ||
        firebaseErr.code === 'auth/invalid-credential' ||
        firebaseErr.code === 'auth/user-not-found' ||
        firebaseErr.code === 'auth/invalid-login-credentials'
      ) {
        errorMsg = 'Incorrect email or password. Please try again.';
      } else if (firebaseErr.code === 'auth/operation-not-allowed') {
        errorMsg = 'Email/Password sign-in is disabled in Firebase Console.';
      } else if (firebaseErr.code === 'auth/too-many-requests') {
        errorMsg = 'Too many failed login attempts. Please try again later.';
      } else if (firebaseErr.code === 'auth/user-disabled') {
        errorMsg = 'This account has been disabled.';
      } else if (firebaseErr.code === 'auth/invalid-email') {
        errorMsg = 'Please enter a valid email address.';
      } else if (firebaseErr.code === 'auth/network-request-failed') {
        errorMsg = 'Network error. Please check your internet connection.';
      } else if (firebaseErr.message) {
        errorMsg = firebaseErr.message;
      }
      setPasswordError(errorMsg);
    } finally {
      setIsSigningIn(false);
    }
  };

  /**
   * Forgot Password Handler -> Sends password reset link via Firebase Auth
   */
  const handleForgotPassword = async () => {
    Keyboard.dismiss();
    const cleanEmail = (inputEmail || '').trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setPasswordError('');
    setResetStatus({ type: '', message: '' });

    if (!cleanEmail) {
      const msg = 'Please enter your email address.';
      setEmailError(msg);
      setResetStatus({ type: 'error', message: msg });
      return;
    }

    if (!emailRegex.test(cleanEmail)) {
      const msg = 'Please enter a valid email address.';
      setEmailError(msg);
      setResetStatus({ type: 'error', message: msg });
      return;
    }

    setEmailError('');
    setIsResettingPassword(true);

    try {
      const activeAuth = auth || (app ? getAuth(app) : null);
      if (!isFirebaseConfigured() || !activeAuth || typeof sendPasswordResetEmail !== 'function') {
        throw new Error('Firebase authentication is not configured.');
      }

      await sendPasswordResetEmail(activeAuth, cleanEmail);
      setResetStatus({
        type: 'success',
        message: 'Password reset email sent. Please check your inbox.',
      });
    } catch (error) {
      console.log('[ForgotPassword] Error note:', error.code, error.message);
      let errorMsg = 'Failed to send password reset email. Please try again.';
      if (error.code === 'auth/user-not-found') {
        setResetStatus({
          type: 'success',
          message: 'Password reset email sent. Please check your inbox.',
        });
        return;
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = 'Please enter a valid email address.';
        setEmailError(errorMsg);
      } else if (error.code === 'auth/too-many-requests') {
        errorMsg = 'Too many requests. Please try again later.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMsg = 'Network error. Please check your internet connection.';
      } else if (error.message) {
        errorMsg = error.message;
      }
      setResetStatus({
        type: 'error',
        message: errorMsg,
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  /**
   * Google Sign-In Handler -> Opens Official Android Google Account Chooser & Authenticates via Firebase
   */
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setPasswordError('');
    setEmailError('');

    try {
      if (!isFirebaseConfigured() || !auth) {
        throw new Error('Firebase authentication is not configured.');
      }

      if (Platform.OS === 'web') {
        if (typeof signInWithPopup === 'function') {
          const provider = new GoogleAuthProvider();
          provider.setCustomParameters({ prompt: 'select_account' });
          const result = await signInWithPopup(auth, provider);
          await handleFirebaseGoogleSuccess(result.user);
        }
      } else {
        // 1. Verify Google Play Services is available on device
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

        // 2. Open official Android Google Account Chooser bottom sheet
        const signInResult = await GoogleSignin.signIn();
        const idToken = signInResult?.data?.idToken || signInResult?.idToken;

        if (!idToken) {
          throw new Error('Could not retrieve Google ID Token from device.');
        }

        // 3. Authenticate with Firebase using the Google ID Token credential
        const credential = GoogleAuthProvider.credential(idToken);
        const userCredential = await signInWithCredential(auth, credential);
        await handleFirebaseGoogleSuccess(userCredential.user);
      }
    } catch (error) {
      console.log('[GoogleAuth] Google Sign-In note:', error.code || error.message);
      if (
        error.code === statusCodes?.SIGN_IN_CANCELLED ||
        error.code === '12501' ||
        error.code === 'auth/popup-closed-by-user' ||
        error.code === 'auth/cancelled-popup-request'
      ) {
        // User closed or dismissed the account picker
        return;
      } else if (error.code === statusCodes?.PLAY_SERVICES_NOT_AVAILABLE) {
        setPasswordError('Google Play Services is not available or outdated on this device.');
      } else if (error.code === statusCodes?.IN_PROGRESS) {
        // In progress
        return;
      } else {
        setPasswordError(error.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  /**
   * Handle Authenticated Google User from Firebase
   */
  const handleFirebaseGoogleSuccess = async (user) => {
    try {
      await saveUserProfileToFirestore({
        uid: user.uid,
        name: user.displayName || 'Google User',
        email: user.email || '',
        photoURL: user.photoURL || '',
        provider: 'google',
      });
    } catch (err) {
      console.warn('[GoogleAuth] Profile sync note:', err.message);
    }

    if (user.email) setUserEmail(user.email);
    if (user.displayName) setUserName(user.displayName);

    // Dispatch Simple Login Email for Google user
    if (typeof sendEmailAlert === 'function' && user.email) {
      sendEmailAlert({
        title: 'Google Sign-in Confirmed: Session Active',
        type: 'Google Login',
        location: 'NER Geotagged Gateway (Guwahati Hub)',
        severity: 'normal',
        desc: `Hello ${user.displayName || 'User'},\n\nYour Google login to Bharat Netra (${user.email}) was successful on ${new Date().toLocaleString()}.\n\nLive corridor alerts and route advisories are now active.\n\nTeam Bharat Netra`,
        to: user.email,
      });
    }

    navigation.navigate('ProfileLanguage');
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Invisible reCAPTCHA container for Web */}
      {Platform.OS === 'web' && (
        <div id="recaptcha-container" />
      )}

      {/* Space-Themed Earth Background */}
      <Image
        source={require('../assets/login_bg.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Subtle ambient lighting vignette */}
      <View style={styles.ambientVignette} pointerEvents="none" />

      <SafeAreaView style={styles.safeArea}>
        {/* Top Navigation Bar: Back Arrow on Left, Theme Toggle on Right */}
        <View style={styles.topNavBar}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => navigation.goBack()}
            style={styles.navSquareBtn}
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={toggleTheme}
            style={styles.navSquareBtn}
            accessibilityLabel="Toggle dark/night mode"
          >
            <Ionicons
              name={isDark ? 'moon' : 'sunny'}
              size={18}
              color={isDark ? '#38BDF8' : '#F59E0B'}
            />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Prominent Bold Animated Heading: Welcome */}
            <Animated.View
              style={[
                styles.headingContainer,
                {
                  opacity: welcomeFadeAnim,
                  transform: [
                    { translateX: welcomeSlideAnim },
                    { scale: welcomeScaleAnim },
                  ],
                },
              ]}
            >
              <Text style={styles.welcomeHeading}>Welcome</Text>
            </Animated.View>

            {/* Glassmorphic Centered Card with Neon Blue Outline */}
            <View style={styles.glassCard}>
              {/* 1. EMAIL ADDRESS Field */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
                <View
                  style={[
                    styles.inputContainer,
                    emailFocused && styles.inputFocused,
                    emailError ? styles.inputError : null,
                  ]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={19}
                    color="#CBD5E1"
                    style={styles.inputLeftIcon}
                  />
                  <TextInput
                    value={inputEmail}
                    onChangeText={(text) => {
                      setInputEmail(text);
                      if (emailError) setEmailError('');
                    }}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    placeholder={t('enterEmailPlaceholder') || "Enter your email"}
                    placeholderTextColor="#64748B"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="off"
                    textContentType="none"
                    style={styles.textInputField}
                  />
                </View>
                {emailError ? (
                  <Text style={styles.errorText}>{emailError}</Text>
                ) : null}
              </View>

              {/* 2. PASSWORD Field */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>PASSWORD</Text>
                <View
                  style={[
                    styles.inputContainer,
                    passwordFocused && styles.inputFocused,
                    passwordError ? styles.inputError : null,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={19}
                    color="#CBD5E1"
                    style={styles.inputLeftIcon}
                  />
                  <TextInput
                    value={inputPassword}
                    onChangeText={(text) => {
                      setInputPassword(text);
                      if (passwordError) setPasswordError('');
                    }}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    placeholder="Enter your password (min. 6 chars)"
                    placeholderTextColor="#64748B"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="current-password"
                    textContentType="password"
                    style={[styles.textInputField, { paddingRight: 36 }]}
                  />
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.passwordEyeBtn}
                    accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={19}
                      color="#94A3B8"
                    />
                  </TouchableOpacity>
                </View>
                {passwordError ? (
                  <Text style={styles.errorText}>{passwordError}</Text>
                ) : null}

                {/* Forgot Password Link */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleForgotPassword}
                  disabled={isResettingPassword}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  style={styles.forgotPasswordContainer}
                  accessibilityLabel="Forgot Password"
                >
                  <Text style={styles.forgotPasswordText}>
                    {isResettingPassword ? 'Sending reset email...' : 'Forgot Password?'}
                  </Text>
                </TouchableOpacity>

                {/* Reset Status Feedback (Success or Error) */}
                {resetStatus.message ? (
                  <View
                    style={[
                      styles.resetStatusBox,
                      resetStatus.type === 'success'
                        ? styles.resetStatusSuccessBox
                        : styles.resetStatusErrorBox,
                    ]}
                  >
                    <Ionicons
                      name={
                        resetStatus.type === 'success'
                          ? 'checkmark-circle'
                          : 'alert-circle'
                      }
                      size={14}
                      color={resetStatus.type === 'success' ? '#10B981' : '#EF4444'}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={[
                        styles.resetStatusText,
                        {
                          color:
                            resetStatus.type === 'success' ? '#10B981' : '#EF4444',
                        },
                      ]}
                    >
                      {resetStatus.message}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* 3. Primary Action Button: SIGN IN & CONTINUE → */}
              <TouchableOpacity
                activeOpacity={0.84}
                onPress={handleSignInWithEmail}
                disabled={isSigningIn}
                style={[
                  styles.primaryActionButton,
                  isSigningIn && { opacity: 0.8 },
                ]}
              >
                {isSigningIn ? (
                  <View style={styles.buttonLoaderRow}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={[styles.primaryActionText, { marginLeft: 8 }]}>
                      SIGNING IN...
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.primaryActionText}>
                    SIGN IN & CONTINUE →
                  </Text>
                )}
              </TouchableOpacity>

              {/* 4. Divider with Centered Blue "OR" Badge */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <View style={styles.orBadge}>
                  <Text style={styles.orBadgeText}>OR</Text>
                </View>
                <View style={styles.dividerLine} />
              </View>

              {/* 5. Social Login Button: Continue with Google */}
              <TouchableOpacity
                activeOpacity={0.84}
                onPress={handleGoogleSignIn}
                disabled={isGoogleLoading}
                style={[
                  styles.socialLoginButton,
                  isGoogleLoading && { opacity: 0.8 },
                ]}
              >
                {isGoogleLoading ? (
                  <ActivityIndicator size="small" color="#38BDF8" />
                ) : (
                  <>
                    <OfficialGoogleIcon size={20} />
                    <Text style={styles.socialLoginText}>
                      Continue with Google
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02040A',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  ambientVignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 4, 10, 0.25)',
    zIndex: 2,
  },
  safeArea: {
    flex: 1,
    zIndex: 10,
  },
  topNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 12,
    paddingBottom: 8,
    zIndex: 20,
  },
  navSquareBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          cursor: 'pointer',
        }
      : {}),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 28,
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  headingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 22,
    width: '100%',
  },
  welcomeHeading: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.2,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif-black',
      web: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      default: 'sans-serif',
    }),
    textShadowColor: 'rgba(56, 189, 248, 0.85)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 18,
  },
  glassCard: {
    width: '100%',
    maxWidth: 350,
    borderRadius: 20,
    backgroundColor: 'rgba(9, 15, 30, 0.72)',
    borderWidth: 1.2,
    borderColor: 'rgba(56, 189, 248, 0.42)',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 20,
    marginTop: 10,
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }
      : {}),
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 28,
    elevation: 12,
  },
  fieldGroup: {
    marginBottom: 13,
    width: '100%',
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    borderRadius: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    overflow: 'hidden',
  },
  inputFocused: {
    borderColor: 'rgba(56, 189, 248, 0.85)',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  inputLeftIcon: {
    marginRight: 9,
  },
  textInputField: {
    flex: 1,
    height: '100%',
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
    paddingVertical: 0,
    outlineStyle: 'none',
  },
  passwordEyeBtn: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 8,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
  },
  countryCodePrefix: {
    paddingRight: 10,
    justifyContent: 'center',
  },
  countryCodeText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },
  verticalDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    marginRight: 10,
  },
  mobileNumberInput: {
    flex: 1,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 3,
    marginLeft: 4,
  },
  primaryActionButton: {
    width: '100%',
    height: 46,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.65,
    shadowRadius: 16,
    elevation: 8,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  buttonLoaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 13,
    position: 'relative',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  orBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#1E40AF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    marginHorizontal: 8,
  },
  orBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  socialLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 46,
    borderRadius: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
  },
  socialLoginText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  // Modal / Bottom Sheet
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 18, 0.65)',
  },
  bottomSheetContainer: {
    borderRadius: 24,
    borderWidth: 1.2,
    borderColor: 'rgba(56, 189, 248, 0.42)',
    backgroundColor: 'rgba(9, 15, 30, 0.76)',
    width: '100%',
    maxWidth: 390,
    alignSelf: 'center',
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }
      : {}),
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 16,
  },
  sheetHandleWrapper: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 20,
    alignItems: 'center',
  },
  sheetHeaderGroup: {
    alignItems: 'center',
    marginBottom: 12,
  },
  lockCircleBadge: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  sheetTitle: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: 0.3,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  sheetSubtitle: {
    fontSize: 12.5,
    textAlign: 'center',
    color: '#94A3B8',
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 7,
    marginBottom: 12,
    width: '100%',
  },
  otpBox: {
    borderRadius: 10,
    borderWidth: 1.5,
    backgroundColor: 'rgba(6, 11, 24, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxInput: {
    fontWeight: '800',
    textAlign: 'center',
    width: '100%',
    height: '100%',
    color: '#FFFFFF',
    outlineStyle: 'none',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  errorBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
  dashedAutoFillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1.2,
    borderColor: '#38BDF8',
    borderStyle: 'dashed',
    gap: 5,
    marginBottom: 12,
  },
  dashedAutoFillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38BDF8',
  },
  resendContainer: {
    marginBottom: 14,
  },
  resendCountdownText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  resendActiveText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#38BDF8',
    textDecorationLine: 'underline',
  },
  verifyBtn: {
    width: '100%',
    height: 44,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 5,
  },
  verifyBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  editMobileBtn: {
    paddingVertical: 4,
  },
  editMobileBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  successWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    width: '100%',
  },
  successCircleOuter: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    borderWidth: 2,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 20,
    elevation: 8,
  },
  successCircleInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  successSubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
  // Google Account Chooser Styles
  googleSheetContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
  },
  googleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  googleHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  googleHeaderSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 1,
  },
  googleCloseBtn: {
    padding: 6,
  },
  googleDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 10,
  },
  googleAccountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 12,
  },
  googleAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  googleAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  googleAccountInfo: {
    flex: 1,
  },
  googleAccountName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  googleAccountEmail: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 1,
  },
  customGoogleForm: {
    paddingVertical: 6,
  },
  customGoogleField: {
    marginBottom: 14,
  },
  customGoogleLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 6,
  },
  customGoogleInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 18, 35, 0.85)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }
      : {}),
  },
  customGoogleInput: {
    flex: 1,
    height: '100%',
    fontSize: 13.5,
    color: '#FFFFFF',
    fontWeight: '500',
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  },
  googleErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  customGoogleErrorText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },
  customGoogleBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  customGoogleBackBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customGoogleBackBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#94A3B8',
  },
  customGoogleSubmitBtn: {
    flex: 2.2,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#1A73E8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  customGoogleSubmitBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  googleFooter: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  googleFooterText: {
    fontSize: 11,
    color: '#8E9AA8',
    lineHeight: 15,
    textAlign: 'center',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 6,
    marginBottom: 4,
    paddingVertical: 4,
    paddingHorizontal: 2,
    zIndex: 10,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
  },
  forgotPasswordText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  resetStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 4,
    marginBottom: 4,
  },
  resetStatusSuccessBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  resetStatusErrorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  resetStatusText: {
    fontSize: 11.5,
    fontWeight: '600',
    flex: 1,
  },
});

export default SignInScreen;

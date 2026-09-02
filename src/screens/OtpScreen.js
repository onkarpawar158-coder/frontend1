import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { HeaderBar } from '../components/HeaderBar';
import { useApp } from '../context/AppContext';
import { RADIUS, SPACING } from '../constants/theme';

export const OtpScreen = ({ navigation }) => {
  const {
    theme,
    userName,
    userEmail,
    confirmationResult,
    saveUserProfileToFirestore,
    t,
  } = useApp();

  const isRealFirebaseSession = Boolean(confirmationResult);
  const [otp, setOtp] = useState(['4', '4', '7', '3']);
  const otpLength = 4;
  const [errorMessage, setErrorMessage] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Countdown timer effect
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleOtpChange = (text, index) => {
    const cleanChar = text.slice(-1).replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = cleanChar;
    setOtp(newOtp);
    if (errorMessage) setErrorMessage('');

    if (cleanChar && index < otpLength - 1) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleAutoFill = () => {
    setOtp(['4', '4', '7', '3']);
    setErrorMessage('');
    inputRefs[otpLength - 1].current?.focus();
  };

  const handleVerify = async () => {
    const enteredOtp = otp.slice(0, otpLength).join('');
    if (enteredOtp.length < otpLength) {
      setErrorMessage(`Please enter full ${otpLength}-digit code`);
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');

    try {
      if (enteredOtp === '4473' || enteredOtp.length >= 4) {
        await saveUserProfileToFirestore({
          uid: `email_demo_${Date.now()}`,
          name: userName,
          email: userEmail || 'driver@bharatnetra.gov.in',
          provider: 'email',
        });
        navigation.navigate('ProfileLanguage');
      } else {
        setErrorMessage('Invalid OTP! Please enter 4473');
      }
    } catch (err) {
      console.error('[OtpScreen] Verification error:', err);
      setErrorMessage(err.message || 'Invalid or expired OTP');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = () => {
    if (canResend) {
      navigation.navigate('SignIn');
    }
  };

  const displayTargetEmail = userEmail || 'driver@bharatnetra.gov.in';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.mode === 'dark' ? '#070C18' : theme.background }]}>
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.mode === 'dark' ? '#070C18' : theme.background}
      />

      <HeaderBar
        showBack={true}
        showThemeToggle={true}
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Simulated Email Notification Banner */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleAutoFill}
            style={[
              styles.smsNotificationBanner,
              {
                backgroundColor: theme.mode === 'dark' ? '#0E1726' : '#EFF6FF',
                borderColor: theme.mode === 'dark' ? '#1E2E4E' : '#93C5FD',
              },
            ]}
          >
            <View style={styles.smsHeaderRow}>
              <View style={styles.smsIconTitle}>
                <Ionicons name="mail-unread" size={18} color="#06B6D4" />
                <Text style={[styles.smsSourceText, { color: theme.mode === 'dark' ? '#94A3B8' : '#475569' }]}>
                  INBOX • BHARAT–NETRA
                </Text>
              </View>

              <View style={styles.autoFillPill}>
                <Text style={styles.autoFillPillText}>Tap to Auto-fill ⚡</Text>
              </View>
            </View>

            <Text style={[styles.smsBodyText, { color: theme.mode === 'dark' ? '#CBD5E1' : '#1E293B' }]}>
              {`Verification code sent to ${displayTargetEmail}. Valid for 10 minutes (Demo Code: 4473).`}
            </Text>
          </TouchableOpacity>

          {/* Main Centered Verification Card */}
          <View
            style={[
              styles.mainCard,
              {
                backgroundColor: theme.mode === 'dark' ? '#121A29' : '#FFFFFF',
                borderColor: theme.mode === 'dark' ? '#1E2E4E' : '#E2E8F0',
              },
            ]}
          >
            {/* Mail Icon Circle */}
            <View style={styles.lockCircleBadge}>
              <Ionicons name="mail" size={24} color="#38BDF8" />
            </View>

            {/* Headings */}
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
              Verify Email OTP
            </Text>
            <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
              Enter the verification code sent to
            </Text>
            <Text style={[styles.mobileNumberText, { color: theme.textPrimary }]}>
              {displayTargetEmail}
            </Text>

            {/* Dynamic OTP Boxes */}
            <View style={styles.otpBoxesContainer}>
              {Array.from({ length: otpLength }).map((_, index) => {
                const digit = otp[index] || '';
                const isFilled = digit.length > 0;
                return (
                  <View
                    key={index}
                    style={[
                      styles.otpBoxWrapper,
                      {
                        width: 58,
                        height: 62,
                        borderColor: errorMessage
                          ? theme.error
                          : isFilled
                          ? '#2563EB'
                          : theme.mode === 'dark'
                          ? '#1E2E4E'
                          : '#CBD5E1',
                        backgroundColor: theme.mode === 'dark' ? '#0B111E' : '#F8FAFC',
                      },
                    ]}
                  >
                    <TextInput
                      ref={inputRefs[index]}
                      value={digit}
                      onChangeText={(text) => handleOtpChange(text, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      selectTextOnFocus
                      style={[
                        styles.otpInput,
                        {
                          fontSize: 26,
                          color: theme.textPrimary,
                        },
                      ]}
                    />
                  </View>
                );
              })}
            </View>

            {/* Error Message */}
            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={14} color={theme.error} />
                <Text style={[styles.errorText, { color: theme.error }]}>
                  {errorMessage}
                </Text>
              </View>
            ) : null}

            {/* Dashed Auto-fill OTP Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleAutoFill}
              style={[
                styles.dashedAutoFillBtn,
                {
                  borderColor: '#2563EB',
                },
              ]}
            >
              <Feather name="clipboard" size={14} color="#3B82F6" />
              <Text style={styles.dashedAutoFillText}>
                Auto-fill Email OTP (4473)
              </Text>
            </TouchableOpacity>

            {/* Resend Code Timer */}
            <View style={styles.resendRow}>
              {canResend ? (
                <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
                  <Text style={styles.resendActiveLink}>Resend Code</Text>
                </TouchableOpacity>
              ) : (
                <Text style={[styles.resendTimerText, { color: theme.textSecondary }]}>
                  Resend code in <Text style={{ color: theme.textPrimary, fontWeight: '700' }}>{timer}s</Text>
                </Text>
              )}
            </View>

            {/* Verify & Proceed Button */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleVerify}
              disabled={isVerifying}
              style={[styles.verifyProceedBtn, isVerifying && { opacity: 0.8 }]}
            >
              {isVerifying ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.verifyProceedText}>Verify Email & Proceed →</Text>
              )}
            </TouchableOpacity>

            {/* Edit Email Address */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('SignIn')}
              style={styles.editMobileLink}
            >
              <Text style={[styles.editMobileText, { color: theme.textSecondary }]}>
                Edit email address
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xxl,
  },
  smsNotificationBanner: {
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
  },
  smsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  smsIconTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  smsSourceText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  autoFillPill: {
    backgroundColor: '#0F2B48',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#0284C7',
  },
  autoFillPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#38BDF8',
  },
  smsBodyText: {
    fontSize: 12,
    lineHeight: 17,
  },
  mainCard: {
    borderRadius: RADIUS.xl * 1.2,
    borderWidth: 1.5,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  lockCircleBadge: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.full,
    backgroundColor: '#1E3A5F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    marginBottom: 2,
  },
  mobileNumberText: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: SPACING.lg,
  },
  otpBoxesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: SPACING.lg,
    width: '100%',
  },
  otpBoxWrapper: {
    borderRadius: RADIUS.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpInput: {
    fontWeight: '800',
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.md,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dashedAutoFillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    gap: 6,
    marginBottom: SPACING.lg,
  },
  dashedAutoFillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3B82F6',
  },
  resendRow: {
    marginBottom: SPACING.xl,
  },
  resendTimerText: {
    fontSize: 13,
  },
  resendActiveLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
  verifyProceedBtn: {
    width: '100%',
    height: 54,
    borderRadius: RADIUS.lg,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  verifyProceedText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  editMobileLink: {
    paddingVertical: 4,
  },
  editMobileText: {
    fontSize: 13,
    fontWeight: '500',
  },
});

export default OtpScreen;

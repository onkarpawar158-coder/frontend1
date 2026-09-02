import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { RADIUS, SPACING } from '../constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const LocationPermissionSheet = ({
  visible,
  onClose,
  onAllow,
  onDeny,
}) => {
  const { theme, t } = useApp();
  const [selectedAccuracy, setSelectedAccuracy] = useState('precise'); // 'precise' | 'approximate'

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT * 0.6)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT * 0.6,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  const handleGrant = (mode) => {
    if (onAllow) {
      onAllow({ mode, accuracy: selectedAccuracy });
    }
  };

  const handleDeny = () => {
    if (onDeny) {
      onDeny();
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleDeny}
    >
      <View style={styles.overlayContainer}>
        {/* Dimmed translucent backdrop */}
        <TouchableWithoutFeedback onPress={handleDeny}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                backgroundColor: 'rgba(2, 6, 18, 0.65)',
                opacity: fadeAnim,
              },
            ]}
          />
        </TouchableWithoutFeedback>

        {/* Animated Glassmorphic Bottom Sheet */}
        <Animated.View
          style={[
            styles.sheetCard,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Top Grab Handle */}
          <View style={styles.sheetHandleWrapper}>
            <View style={styles.sheetHandle} />
          </View>

          {/* Top Blue Glowing Location Pin Icon */}
          <View style={styles.topIconWrapper}>
            <View style={styles.iconGlowBadge}>
              <Ionicons name="location-sharp" size={26} color="#38BDF8" />
            </View>
          </View>

          {/* Question Title */}
          <Text style={styles.questionTitle}>
            {t('allowLocationAccessQuestion') || "Allow Bharat Netra to access this device's location?"}
          </Text>

          {/* Two Map Preview Choices: Precise vs Approximate */}
          <View style={styles.mapOptionsRow}>
            {/* Precise Circle */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedAccuracy('precise')}
              style={styles.mapOptionCol}
            >
              <View
                style={[
                  styles.mapCircleWrapper,
                  selectedAccuracy === 'precise' && styles.mapCircleActive,
                ]}
              >
                {/* SVG/Vector styled detailed grid */}
                <View style={styles.gridMap}>
                  {/* Grid lines */}
                  <View style={[styles.gridLine, { top: '25%', left: 0, right: 0 }]} />
                  <View style={[styles.gridLine, { top: '50%', left: 0, right: 0 }]} />
                  <View style={[styles.gridLine, { top: '75%', left: 0, right: 0 }]} />
                  <View style={[styles.gridLineVert, { left: '25%', top: 0, bottom: 0 }]} />
                  <View style={[styles.gridLineVert, { left: '50%', top: 0, bottom: 0 }]} />
                  <View style={[styles.gridLineVert, { left: '75%', top: 0, bottom: 0 }]} />

                  {/* Diagonal street lines */}
                  <View style={[styles.diagLine, { transform: [{ rotate: '35deg' }] }]} />
                  <View style={[styles.diagLine, { transform: [{ rotate: '-45deg' }] }]} />

                  {/* Small landmark dots */}
                  <View style={[styles.landmarkDot, { top: 20, left: 22, backgroundColor: '#F59E0B' }]} />
                  <View style={[styles.landmarkDot, { top: 24, right: 20, backgroundColor: '#38BDF8' }]} />
                  <View style={[styles.landmarkDot, { bottom: 20, left: 26, backgroundColor: '#818CF8' }]} />

                  {/* Center Blue Location Marker with Radar Halo */}
                  <View style={styles.preciseMarkerHalo}>
                    <Ionicons name="location-sharp" size={22} color="#38BDF8" />
                    <View style={styles.markerBaseDot} />
                  </View>
                </View>
              </View>
              <Text
                style={[
                  styles.optionLabel,
                  selectedAccuracy === 'precise' ? styles.optionLabelActive : styles.optionLabelInactive,
                ]}
              >
                {t('precise') || 'Precise'}
              </Text>
            </TouchableOpacity>

            {/* Approximate Circle */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedAccuracy('approximate')}
              style={styles.mapOptionCol}
            >
              <View
                style={[
                  styles.mapCircleWrapper,
                  selectedAccuracy === 'approximate' && styles.mapCircleActive,
                ]}
              >
                {/* SVG/Vector styled regional map */}
                <View style={styles.regionalMap}>
                  {/* Thick Golden Arterial Highway Lines */}
                  <View style={[styles.highwayCurveOne]} />
                  <View style={[styles.highwayCurveTwo]} />
                  <View style={[styles.highwayMinorOne]} />
                  <View style={[styles.highwayMinorTwo]} />

                  {/* Highway Interstate Shields */}
                  <View style={[styles.shieldBadge, { top: 40, left: 14 }]}>
                    <View style={styles.shieldRed} />
                    <View style={styles.shieldBlue} />
                  </View>
                  <View style={[styles.shieldBadge, { bottom: 16, left: 28 }]}>
                    <View style={styles.shieldRed} />
                    <View style={styles.shieldBlue} />
                  </View>
                </View>
              </View>
              <Text
                style={[
                  styles.optionLabel,
                  selectedAccuracy === 'approximate' ? styles.optionLabelActive : styles.optionLabelInactive,
                ]}
              >
                {t('approximate') || 'Approximate'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Action List with Matching Bordered Glass Buttons */}
          <View style={styles.actionsList}>
            {/* 1. While using the app (Primary highlighted button with blue background & cyan border) */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleGrant('while_using')}
              style={styles.actionBtnPrimary}
            >
              <Text style={styles.actionBtnPrimaryText}>
                {t('whileUsingApp') || 'While using the app'}
              </Text>
            </TouchableOpacity>

            {/* 2. Only this time (Secondary translucent glass button with cyan border) */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleGrant('only_this_time')}
              style={styles.actionBtnSecondary}
            >
              <Text style={styles.actionBtnSecondaryText}>
                {t('onlyThisTime') || 'Only this time'}
              </Text>
            </TouchableOpacity>

            {/* 3. Don't allow (Subtle glass button with soft border) */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleDeny}
              style={styles.actionBtnTertiary}
            >
              <Text style={styles.actionBtnTertiaryText}>
                {t('dontAllow') || "Don't allow"}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetCard: {
    backgroundColor: 'rgba(9, 15, 30, 0.82)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 34 : 22,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    borderTopWidth: 1.5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.38)',
    elevation: 32,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }
      : {}),
  },
  sheetHandleWrapper: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  sheetHandle: {
    width: 38,
    height: 4.5,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  topIconWrapper: {
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlowBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(56, 189, 248, 0.16)',
    borderWidth: 1.2,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 4,
  },
  questionTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 6,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  mapOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 22,
    marginBottom: 18,
    width: '100%',
  },
  mapOptionCol: {
    alignItems: 'center',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
  },
  mapCircleWrapper: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: 'rgba(10, 16, 32, 0.8)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  mapCircleActive: {
    borderColor: '#38BDF8',
    borderWidth: 2.5,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.75,
    shadowRadius: 12,
    elevation: 8,
  },
  gridMap: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0F172A',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridLine: {
    position: 'absolute',
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.22)',
  },
  gridLineVert: {
    position: 'absolute',
    width: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.22)',
  },
  diagLine: {
    position: 'absolute',
    width: 130,
    height: 1.5,
    backgroundColor: 'rgba(148, 163, 184, 0.3)',
  },
  landmarkDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  preciseMarkerHalo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerBaseDot: {
    width: 10,
    height: 3.5,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    opacity: 0.9,
    marginTop: -3,
  },
  regionalMap: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0F172A',
    position: 'relative',
  },
  highwayCurveOne: {
    position: 'absolute',
    top: 20,
    left: -10,
    width: 110,
    height: 2.5,
    backgroundColor: '#FDE047',
    transform: [{ rotate: '-25deg' }],
  },
  highwayCurveTwo: {
    position: 'absolute',
    top: 46,
    left: 8,
    width: 100,
    height: 3,
    backgroundColor: '#FDE047',
    transform: [{ rotate: '38deg' }],
  },
  highwayMinorOne: {
    position: 'absolute',
    top: 8,
    left: 40,
    width: 70,
    height: 1.5,
    backgroundColor: '#E2E8F0',
    transform: [{ rotate: '70deg' }],
  },
  highwayMinorTwo: {
    position: 'absolute',
    top: 36,
    left: -12,
    width: 60,
    height: 1.5,
    backgroundColor: '#E2E8F0',
    transform: [{ rotate: '-50deg' }],
  },
  shieldBadge: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 2,
    overflow: 'hidden',
  },
  shieldRed: {
    height: 3.5,
    backgroundColor: '#EF4444',
  },
  shieldBlue: {
    height: 5.5,
    backgroundColor: '#2563EB',
  },
  optionLabel: {
    fontSize: 13,
    letterSpacing: 0.2,
  },
  optionLabelActive: {
    color: '#38BDF8',
    fontWeight: '800',
  },
  optionLabelInactive: {
    color: '#94A3B8',
    fontWeight: '600',
  },
  actionsList: {
    width: '100%',
    gap: 8,
    marginTop: 2,
  },
  actionBtnPrimary: {
    width: '100%',
    height: 46,
    borderRadius: 13,
    backgroundColor: '#2563EB',
    borderWidth: 1.2,
    borderColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 5,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
  },
  actionBtnPrimaryText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  actionBtnSecondary: {
    width: '100%',
    height: 44,
    borderRadius: 13,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderWidth: 1.2,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web'
      ? {
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }
      : {}),
  },
  actionBtnSecondaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E2E8F0',
    letterSpacing: 0.2,
  },
  actionBtnTertiary: {
    width: '100%',
    height: 42,
    borderRadius: 13,
    backgroundColor: 'rgba(15, 23, 42, 0.38)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
  },
  actionBtnTertiaryText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#94A3B8',
    letterSpacing: 0.2,
  },
});

export default LocationPermissionSheet;

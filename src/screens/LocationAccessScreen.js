import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { HeaderBar } from '../components/HeaderBar';
import { useApp } from '../context/AppContext';
import { RADIUS, SPACING } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const LocationAccessScreen = ({ navigation }) => {
  const {
    theme,
    mockGpsCoordinates,
    setLocationPermissionStatus,
  } = useApp();

  const [loading, setLoading] = useState(false);

  const handleAllowLocation = () => {
    setLoading(true);
    setTimeout(() => {
      setLocationPermissionStatus('granted');
      navigation.navigate('VehicleSelection', { showLocationToast: true });
    }, 400);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#070C18' }]}>
      <StatusBar barStyle="light-content" backgroundColor="#070C18" />

      {/* Header Bar */}
      <HeaderBar
        showBack={true}
        showThemeToggle={true}
        title="Profile & Language"
        onBackPress={() => navigation.goBack()}
      />

      {/* Darkened Backdrop / Modal Overlay */}
      <View style={styles.overlayContainer}>
        {/* Centered Modern Permission Card */}
        <View style={styles.modalCard}>
          {/* Circular Pin Badge */}
          <View style={styles.pinBadgeWrapper}>
            <Ionicons name="location" size={28} color="#2563EB" />
          </View>

          {/* Heading */}
          <Text style={styles.modalHeading}>
            Allow Location Access
          </Text>

          {/* Explanation Text */}
          <Text style={styles.modalDescription}>
            Bharat Netra requires your device location to provide real-time geotagged routing, perimeter surveillance, and emergency response.
          </Text>

          {/* Allow Location Button */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleAllowLocation}
            style={styles.allowLocationBtn}
          >
            <MaterialCommunityIcons
              name="crosshairs-gps"
              size={20}
              color="#FFFFFF"
              style={styles.crosshairIcon}
            />
            <Text style={styles.allowLocationBtnText}>
              Allow Location
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(4, 8, 20, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#121A29',
    borderColor: '#1E2E4E',
    borderWidth: 1.5,
    borderRadius: RADIUS.xl * 1.3,
    padding: SPACING.xl,
    alignItems: 'center',
    elevation: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  pinBadgeWrapper: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.full,
    backgroundColor: '#162846',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  modalHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 13.5,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.xs,
  },
  allowLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 54,
    borderRadius: RADIUS.lg,
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    gap: 8,
  },
  crosshairIcon: {},
  allowLocationBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default LocationAccessScreen;

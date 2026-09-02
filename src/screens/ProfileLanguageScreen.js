import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LocationPermissionSheet } from '../components/LocationPermissionSheet';
import { useApp } from '../context/AppContext';
import { RADIUS } from '../constants/theme';

export const LANGUAGES_GRID = [
  { id: 'en', native: 'English', sub: 'Default' },
  { id: 'hi', native: 'हिन्दी', sub: 'Hindi' },
  { id: 'as', native: 'অসমীয়া', sub: 'Assamese' },
  { id: 'bn', native: 'বাংলা', sub: 'Bengali' },
  { id: 'mni', native: 'মৈতৈলোন্', sub: 'Manipuri' },
  { id: 'brx', native: 'बड़ो', sub: 'Bodo' },
];

export const VEHICLE_LIST = [
  {
    id: 'bicycle',
    name: 'Bicycle',
    emoji: '🚲',
    buttonEmoji: '🚲',
    image: require('../assets/vehicle_bicycle.jpg'),
  },
  {
    id: 'two_wheeler',
    name: 'Two-wheeler',
    emoji: '🛵',
    buttonEmoji: '🛵',
    image: require('../assets/vehicle_two_wheeler.jpg'),
  },
  {
    id: 'car',
    name: 'Car',
    emoji: '🚗',
    buttonEmoji: '🛻',
    image: require('../assets/vehicle_car.jpg'),
  },
  {
    id: 'truck',
    name: 'Truck',
    emoji: '🚚',
    buttonEmoji: '🚚',
    image: require('../assets/vehicle_truck.jpg'),
  },
];

export const ProfileLanguageScreen = ({ navigation }) => {
  const {
    userName,
    userProfile,
    selectedLanguage,
    setSelectedLanguage,
    selectedVehicle,
    setSelectedVehicle,
    locationPermissionStatus,
    setLocationPermissionStatus,
    toggleTheme,
    selectedTheme,
    t,
  } = useApp();

  const isDark = selectedTheme === 'dark';
  const displayName = userProfile?.name || userName || 'Onkar Pawar';

  const [showLocationSheet, setShowLocationSheet] = useState(false);

  const activeVehicle =
    selectedVehicle ||
    VEHICLE_LIST.find((v) => v.id === 'car') ||
    VEHICLE_LIST[2];

  // -------------------------------------------------------------
  // Animations for Distinct Staggered Modular Sections
  // -------------------------------------------------------------
  const navFadeAnim = useRef(new Animated.Value(0)).current;
  const navSlideAnim = useRef(new Animated.Value(-12)).current;

  const langFadeAnim = useRef(new Animated.Value(0)).current;
  const langSlideAnim = useRef(new Animated.Value(-16)).current;

  const vehicleFadeAnim = useRef(new Animated.Value(0)).current;
  const vehicleSlideAnim = useRef(new Animated.Value(24)).current;

  const trustFadeAnim = useRef(new Animated.Value(0)).current;
  const trustSlideAnim = useRef(new Animated.Value(18)).current;

  const buttonFadeAnim = useRef(new Animated.Value(0)).current;
  const buttonSlideAnim = useRef(new Animated.Value(20)).current;
  const buttonScaleAnim = useRef(new Animated.Value(0.94)).current;

  // Interactive scale bounces for selected items
  const vehicleScaleAnim = useRef(new Animated.Value(1)).current;
  const langScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Staggered sequential entrance for separate modules
    Animated.parallel([
      // 1. Navigation Header
      Animated.parallel([
        Animated.timing(navFadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(navSlideAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      // 2. Language Module (Slides in first)
      Animated.sequence([
        Animated.delay(100),
        Animated.parallel([
          Animated.timing(langFadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.spring(langSlideAnim, {
            toValue: 0,
            friction: 7,
            tension: 50,
            useNativeDriver: true,
          }),
        ]),
      ]),

      // 3. Vehicle Module (Slides in separately with spring effect)
      Animated.sequence([
        Animated.delay(240),
        Animated.parallel([
          Animated.timing(vehicleFadeAnim, {
            toValue: 1,
            duration: 650,
            useNativeDriver: true,
          }),
          Animated.spring(vehicleSlideAnim, {
            toValue: 0,
            friction: 6.5,
            tension: 45,
            useNativeDriver: true,
          }),
        ]),
      ]),

      // 4. Trust Info Card
      Animated.sequence([
        Animated.delay(360),
        Animated.parallel([
          Animated.timing(trustFadeAnim, {
            toValue: 1,
            duration: 550,
            useNativeDriver: true,
          }),
          Animated.spring(trustSlideAnim, {
            toValue: 0,
            friction: 8,
            tension: 55,
            useNativeDriver: true,
          }),
        ]),
      ]),

      // 5. Elevated Continue Button
      Animated.sequence([
        Animated.delay(440),
        Animated.parallel([
          Animated.timing(buttonFadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(buttonSlideAnim, {
            toValue: 0,
            friction: 7,
            tension: 50,
            useNativeDriver: true,
          }),
          Animated.spring(buttonScaleAnim, {
            toValue: 1,
            friction: 6,
            tension: 60,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, []);

  const handleSelectLanguage = (langId) => {
    setSelectedLanguage(langId);
    Animated.sequence([
      Animated.timing(langScaleAnim, {
        toValue: 0.96,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(langScaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    Animated.sequence([
      Animated.timing(vehicleScaleAnim, {
        toValue: 1.14,
        duration: 110,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(vehicleScaleAnim, {
        toValue: 1.0,
        friction: 4,
        tension: 70,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleContinue = () => {
    if (locationPermissionStatus === 'granted') {
      navigation.navigate('LocationRoute');
    } else {
      setShowLocationSheet(true);
    }
  };

  const handleAllowLocation = ({ mode, accuracy }) => {
    setLocationPermissionStatus('granted');
    setShowLocationSheet(false);
    navigation.navigate('LocationRoute');
  };

  const handleDenyLocation = () => {
    setShowLocationSheet(false);
    navigation.navigate('LocationRoute');
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Space-Themed Earth Background with atmospheric limb */}
      <Image
        source={require('../assets/login_bg.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Subtle ambient lighting vignette */}
      <View style={styles.ambientVignette} pointerEvents="none" />

      <SafeAreaView style={styles.safeArea}>
        {/* Animated Top Navigation Bar */}
        <Animated.View
          style={[
            styles.topNavBar,
            {
              opacity: navFadeAnim,
              transform: [{ translateY: navSlideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => navigation.goBack()}
            style={styles.navSquareBtn}
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Centered User Profile Badge */}
          <View style={styles.userProfilePill}>
            <View style={styles.userAvatarFallback}>
              <Text style={styles.userAvatarInitials}>
                {displayName ? displayName.charAt(0).toUpperCase() : 'O'}
              </Text>
            </View>
            <View style={styles.userTextInfo}>
              <Text style={styles.userNameHeader} numberOfLines={1}>
                {displayName}
              </Text>
              <View style={styles.verifiedRow}>
                <Ionicons name="shield-checkmark" size={12} color="#00E5FF" />
                <Text style={styles.userStatusSubtitle}>Verified Driver</Text>
              </View>
            </View>
          </View>

          {/* Theme Toggle Button */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={toggleTheme}
            style={styles.navSquareBtn}
            accessibilityLabel="Toggle theme"
          >
            <Ionicons
              name={isDark ? 'moon' : 'sunny'}
              size={18}
              color={isDark ? '#38BDF8' : '#F59E0B'}
            />
          </TouchableOpacity>
        </Animated.View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainContentWrapper}>
            {/* ========================================================= */}
            {/* 1. SELECT LANGUAGE SECTION (Upper Distinct Module)        */}
            {/* ========================================================= */}
            <Animated.View
              style={[
                styles.moduleCard,
                {
                  opacity: langFadeAnim,
                  transform: [
                    { translateY: langSlideAnim },
                    { scale: langScaleAnim },
                  ],
                },
              ]}
            >
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionIconBadge}>
                  <Ionicons name="globe-outline" size={18} color="#00A3FF" />
                </View>
                <Text style={styles.sectionTitle}>
                  {t('selectLanguage') || 'Select Language'}
                </Text>
              </View>

              {/* 2 Rows x 3 Columns Language Grid */}
              <View style={styles.languagesGrid}>
                {LANGUAGES_GRID.map((lang) => {
                  const isSelected = selectedLanguage === lang.id;
                  return (
                    <TouchableOpacity
                      key={lang.id}
                      activeOpacity={0.82}
                      onPress={() => handleSelectLanguage(lang.id)}
                      style={[
                        styles.langChip,
                        isSelected && styles.langChipSelected,
                      ]}
                    >
                      {isSelected && (
                        <View style={styles.langCheckBadge}>
                          <Ionicons name="checkmark" size={11} color="#FFFFFF" />
                        </View>
                      )}
                      <Text
                        style={[
                          styles.langNativeText,
                          isSelected && styles.langNativeTextSelected,
                        ]}
                      >
                        {lang.native}
                      </Text>
                      <Text
                        style={[
                          styles.langSubText,
                          isSelected && styles.langSubTextSelected,
                        ]}
                      >
                        {lang.sub}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Animated.View>

            {/* ========================================================= */}
            {/* 2. SELECT YOUR VEHICLE SECTION (Separate Lower Module)   */}
            {/* Moved slightly downward with distinct floating animation */}
            {/* ========================================================= */}
            <Animated.View
              style={[
                styles.moduleCard,
                styles.vehicleModuleSpacing,
                {
                  opacity: vehicleFadeAnim,
                  transform: [{ translateY: vehicleSlideAnim }],
                },
              ]}
            >
              <View style={styles.sectionHeaderRow}>
                <View style={[styles.sectionIconBadge, { backgroundColor: 'rgba(16, 185, 129, 0.16)', borderColor: 'rgba(16, 185, 129, 0.35)' }]}>
                  <Ionicons name="car-outline" size={19} color="#10B981" />
                </View>
                <Text style={styles.sectionTitle}>
                  {t('selectVehicle') || 'Select Your Vehicle'}
                </Text>
              </View>

              {/* 4 Vehicles Horizontal Row Grid */}
              <View style={styles.vehiclesRowGrid}>
                {VEHICLE_LIST.map((vehicle) => {
                  const isSelected = activeVehicle.id === vehicle.id;
                  const vehicleLabel = t(vehicle.id) || vehicle.name;

                  return (
                    <TouchableOpacity
                      key={vehicle.id}
                      activeOpacity={0.84}
                      onPress={() => handleSelectVehicle(vehicle)}
                      style={styles.vehicleItem}
                    >
                      <Animated.View
                        style={[
                          styles.vehiclePhotoCircle,
                          isSelected && styles.vehiclePhotoCircleActive,
                          isSelected && {
                            transform: [{ scale: vehicleScaleAnim }],
                          },
                        ]}
                      >
                        <Image
                          source={vehicle.image}
                          style={styles.vehiclePhotoImg}
                          resizeMode="cover"
                        />
                        {isSelected && (
                          <View style={styles.vehicleCheckBadge}>
                            <Ionicons
                              name="checkmark"
                              size={12}
                              color="#FFFFFF"
                            />
                          </View>
                        )}
                      </Animated.View>

                      <View
                        style={[
                          styles.vehicleLabelPill,
                          isSelected && styles.vehicleLabelPillActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.vehicleLabelText,
                            isSelected && styles.vehicleLabelTextActive,
                          ]}
                          numberOfLines={1}
                        >
                          {vehicleLabel}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Animated.View>

            {/* ========================================================= */}
            {/* 3. PRIMARY ACTION BUTTON                                  */}
            {/* ========================================================= */}
            <Animated.View
              style={[
                styles.buttonContainer,
                {
                  opacity: buttonFadeAnim,
                  transform: [
                    { translateY: buttonSlideAnim },
                    { scale: buttonScaleAnim },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={handleContinue}
                style={styles.continueButton}
              >
                <Text style={styles.continueButtonText}>
                  {t('continueWith') || 'CONTINUE WITH'}{' '}
                  {(t(activeVehicle.id) || activeVehicle.name).toUpperCase()}{' '}
                  {activeVehicle.buttonEmoji || activeVehicle.emoji || '🚗'} →
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Location Permission Sheet Modal */}
      <LocationPermissionSheet
        visible={showLocationSheet}
        onClose={() => setShowLocationSheet(false)}
        onAllow={handleAllowLocation}
        onDeny={handleDenyLocation}
      />
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
  },
  ambientVignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 18, 0.42)',
  },
  safeArea: {
    flex: 1,
    zIndex: 2,
  },
  topNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 6 : 10,
    paddingBottom: 8,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  navSquareBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(10, 18, 35, 0.75)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web'
      ? {
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }
      : {}),
  },
  userProfilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 16, 32, 0.85)',
    borderWidth: 1.2,
    borderColor: 'rgba(0, 132, 255, 0.45)',
    borderRadius: 24,
    paddingVertical: 5,
    paddingHorizontal: 14,
    gap: 10,
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }
      : {}),
    shadowColor: '#0084FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  userAvatarFallback: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4A3B32',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  userAvatarInitials: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  userTextInfo: {
    flexDirection: 'column',
  },
  userNameHeader: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  userStatusSubtitle: {
    color: '#00E5FF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 20, // Slightly below from the top bar
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
  },
  mainContentWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  moduleCard: {
    width: '100%',
    borderRadius: 22,
    backgroundColor: 'rgba(6, 12, 26, 0.44)', // Clean premium transparency
    borderWidth: 1.2,
    borderColor: 'rgba(56, 189, 248, 0.22)',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: 10,
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }
      : {}),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 4,
  },
  vehicleModuleSpacing: {
    marginTop: 18,
    borderColor: 'rgba(16, 185, 129, 0.24)',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 122, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  languagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    width: '100%',
  },
  langChip: {
    width: '31%',
    height: 68,
    borderRadius: 15,
    backgroundColor: 'rgba(10, 18, 35, 0.48)', // Transparent frosted chip
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.09)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    position: 'relative',
    ...(Platform.OS === 'web'
      ? {
          cursor: 'pointer',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }
      : {}),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  langChipSelected: {
    borderColor: '#0080FF',
    borderWidth: 1.8,
    backgroundColor: 'rgba(0, 70, 180, 0.28)',
    shadowColor: '#0080FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.65,
    shadowRadius: 14,
    elevation: 8,
  },
  langNativeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F1F5F9',
    marginBottom: 2,
    textAlign: 'center',
  },
  langNativeTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  langSubText: {
    fontSize: 11,
    color: '#8E9AA8',
    textAlign: 'center',
    fontWeight: '500',
  },
  langSubTextSelected: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  langCheckBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: '#0080FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehiclesRowGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 2,
    marginTop: 4,
  },
  vehicleItem: {
    alignItems: 'center',
    width: '23%',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
  },
  vehiclePhotoCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    overflow: 'hidden',
    marginBottom: 9,
    position: 'relative',
    backgroundColor: '#080E1E',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  vehiclePhotoCircleActive: {
    borderColor: '#0080FF',
    borderWidth: 2.8,
    shadowColor: '#0080FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 16,
    elevation: 12,
  },
  vehiclePhotoImg: {
    width: '100%',
    height: '100%',
  },
  vehicleCheckBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0080FF',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleLabelPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(10, 18, 35, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }
      : {}),
  },
  vehicleLabelPillActive: {
    backgroundColor: 'rgba(0, 60, 180, 0.45)',
    borderColor: '#0080FF',
    borderWidth: 1.5,
    shadowColor: '#0080FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  vehicleLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E9AA8',
    textAlign: 'center',
  },
  vehicleLabelTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  trustCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderRadius: 16,
    backgroundColor: 'rgba(8, 15, 30, 0.76)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginTop: 22,
    marginBottom: 6,
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }
      : {}),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  trustColumn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 4,
  },
  trustIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustTextContainer: {
    flex: 1,
  },
  trustTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.1,
    marginBottom: 2,
  },
  trustSubtitle: {
    fontSize: 8.5,
    color: '#8E9AA8',
    lineHeight: 11.5,
  },
  trustDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 12,
    marginBottom: Platform.OS === 'ios' ? 24 : 18,
  },
  continueButton: {
    width: '100%',
    height: 52,
    borderRadius: 16,
    backgroundColor: '#0062FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0062FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.65,
    shadowRadius: 14,
    elevation: 8,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
});

export default ProfileLanguageScreen;

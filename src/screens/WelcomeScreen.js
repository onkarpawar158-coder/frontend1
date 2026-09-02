import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RADIUS, SPACING } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Natural aspect ratio of the map image (approx 3:4 portrait)
const MAP_ASPECT_RATIO = 736 / 946;

// Plain text characters for staggered letter-by-letter animation
const BHARAT_CHARS = ['B', 'H', 'A', 'R', 'A', 'T'];
const NETRA_CHARS = ['ने', 'त्र'];

export const WelcomeScreen = ({ navigation }) => {
  // Staggered animated values for each letter in "BHARAT"
  const bharatAnimations = useRef(
    BHARAT_CHARS.map(() => new Animated.Value(0))
  ).current;

  // Staggered animated values for each character in "नेत्र"
  const netraAnimations = useRef(
    NETRA_CHARS.map(() => new Animated.Value(0))
  ).current;

  // Gentle continuous breathing pulse and float for the title after entrance
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  // Button entrance animation
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    // 1. Dynamic kinetic spring letter animation for BHARAT
    const bharatSequence = bharatAnimations.map((anim, index) =>
      Animated.spring(anim, {
        toValue: 1,
        friction: 5,
        tension: 60,
        delay: index * 80,
        useNativeDriver: true,
      })
    );

    // 2. Dynamic kinetic spring letter animation for नेत्र
    const netraSequence = netraAnimations.map((anim, index) =>
      Animated.spring(anim, {
        toValue: 1,
        friction: 4.5,
        tension: 50,
        delay: index * 120,
        useNativeDriver: true,
      })
    );

    // Smooth, clean entrance timeline (no continuous loop/movement)
    Animated.sequence([
      Animated.parallel(bharatSequence),
      Animated.parallel(netraSequence),
      Animated.parallel([
        Animated.timing(buttonFadeAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(buttonScaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* FULL INDIA MAP CONTAINED IN SCREEN WITHOUT CROPPING */}
      <View style={styles.mapCenterContainer} pointerEvents="box-none">
        <View style={styles.mapAspectRatioBox}>
          <Image
            source={require('../assets/india_map.jpg')}
            style={styles.mapImage}
            resizeMode="contain"
          />

          {/* CLEAN STATIC PIN AT EXACT NORTH-EASTERN REGION MIDPOINT */}
          <View style={styles.nerCenterPinAnchor} pointerEvents="none">
            <Image
              source={require('../assets/ner_pin.png')}
              style={styles.nerPinImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Top Spacer */}
        <View style={styles.topSpacer} />

        {/* CENTER APP NAME: METALLIC SILVER & SCULPTED GOLDEN LOGO AS IN PHOTO */}
        <View style={styles.centerTitleContainer} pointerEvents="box-none">
          {/* Subtle Ambient Golden Flare behind logo */}
          <View style={styles.ambientFlare} pointerEvents="none" />

          {/* Line 1: BHARAT (Metallic Titanium/Chrome Aesthetic) */}
          <View style={styles.lettersRow}>
            {BHARAT_CHARS.map((char, index) => {
              const anim = bharatAnimations[index];
              return (
                <Animated.Text
                  key={`bharat-${index}`}
                  style={[
                    styles.letterBharat,
                    {
                      opacity: anim,
                    },
                  ]}
                >
                  {char}
                </Animated.Text>
              );
            })}
          </View>

          {/* Line 2: नेत्र (Sculpted Golden Calligraphic Devanagari) */}
          <View style={styles.lettersRow}>
            {NETRA_CHARS.map((char, index) => {
              const anim = netraAnimations[index];
              return (
                <Animated.Text
                  key={`netra-${index}`}
                  style={[
                    styles.letterNetra,
                    {
                      opacity: anim,
                    },
                  ]}
                >
                  {char}
                </Animated.Text>
              );
            })}
          </View>
        </View>

        {/* BOTTOM SECTION: ONLY GET STARTED BUTTON */}
        <View style={styles.bottomContainer}>
          <Animated.View
            style={[
              styles.buttonWrapper,
              {
                opacity: buttonFadeAnim,
                transform: [{ scale: buttonScaleAnim }],
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={handleGetStarted}
              style={styles.getStartedBtn}
            >
              <Text style={styles.getStartedText}>GET STARTED</Text>
              <View style={styles.arrowCircle}>
                <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
    overflow: 'hidden',
  },
  mapCenterContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#030712',
    zIndex: 1,
  },
  mapAspectRatioBox: {
    width: '100%',
    height: '100%',
    maxWidth: SCREEN_HEIGHT * MAP_ASPECT_RATIO,
    maxHeight: SCREEN_WIDTH / MAP_ASPECT_RATIO,
    aspectRatio: MAP_ASPECT_RATIO,
    position: 'relative',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  // Precise Static Pin Anchor at North Eastern Region Midpoint (x: 82.2%, y: 39%)
  nerCenterPinAnchor: {
    position: 'absolute',
    left: '82.2%',
    top: '39.0%',
    transform: [{ translateX: -20 }, { translateY: -48 }],
    zIndex: 10,
  },
  nerPinImage: {
    width: 40,
    height: 52,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingTop: Platform?.OS === 'android' ? StatusBar.currentHeight || 36 : 16,
    paddingBottom: Platform?.OS === 'ios' ? 38 : 30,
    zIndex: 20,
  },
  topSpacer: {
    height: 10,
  },
  centerTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    position: 'relative',
    marginTop: 6,
  },
  ambientFlare: {
    position: 'absolute',
    top: '38%',
    width: 140,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(245, 158, 11, 0.32)',
    ...(Platform.OS === 'web'
      ? {
          filter: 'blur(28px)',
          WebkitFilter: 'blur(28px)',
        }
      : {}),
    zIndex: 1,
  },
  lettersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  letterBharat: {
    fontSize: SCREEN_WIDTH < 380 ? 34 : 42,
    fontWeight: '900',
    color: '#E2E8F0',
    letterSpacing: 4.5,
    fontFamily: Platform.select({
      ios: 'Arial-BoldMT',
      android: 'sans-serif-black',
      web: '"Montserrat", "Arial Black", "Outfit", -apple-system, sans-serif',
      default: 'sans-serif',
    }),
    textShadowColor: 'rgba(0, 0, 0, 0.95)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
    marginHorizontal: 1.5,
    zIndex: 2,
  },
  letterNetra: {
    fontSize: SCREEN_WIDTH < 380 ? 40 : 50,
    fontWeight: '900',
    color: '#E5A93C', // Antique Gold / Saffron as in photo
    letterSpacing: 2,
    marginTop: -4,
    fontFamily: Platform.select({
      ios: 'KohinoorDevanagari-Bold',
      android: 'sans-serif-black',
      web: '"Rozha One", "Tiro Devanagari Marathi", "Yantramanav", "Mukta", sans-serif',
      default: 'sans-serif',
    }),
    textShadowColor: 'rgba(217, 119, 6, 0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 18,
    marginHorizontal: 2,
    zIndex: 2,
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'ios' ? 44 : 36,
  },
  buttonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    paddingHorizontal: 34,
    borderRadius: RADIUS.full,
    backgroundColor: '#1D4ED8',
    borderWidth: 1.5,
    borderColor: '#93C5FD',
    gap: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 12,
  },
  getStartedText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  arrowCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default WelcomeScreen;

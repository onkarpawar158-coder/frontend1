import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HeaderBar } from '../components/HeaderBar';
import { useApp } from '../context/AppContext';
import { RADIUS, SPACING } from '../constants/theme';

export const VEHICLE_LIST = [
  {
    id: 'bicycle',
    name: 'Bicycle',
    emoji: '🚲',
    image: require('../assets/vehicle_bicycle.jpg'),
  },
  {
    id: 'two_wheeler',
    name: 'Two-wheeler',
    emoji: '🛵',
    image: require('../assets/vehicle_two_wheeler.jpg'),
  },
  {
    id: 'car',
    name: 'Car',
    emoji: '🚗',
    image: require('../assets/vehicle_car.jpg'),
  },
  {
    id: 'truck',
    name: 'Truck',
    emoji: '🚚',
    image: require('../assets/vehicle_truck.jpg'),
  },
];

export const VehicleSelectionScreen = ({ route, navigation }) => {
  const {
    theme,
    selectedVehicle,
    setSelectedVehicle,
    mockGpsCoordinates,
    t,
  } = useApp();

  const [currentSelected, setCurrentSelected] = useState(
    selectedVehicle?.id || 'car'
  );
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    // Keep location granted banner visible
  }, []);

  const handleSelect = (vehicle) => {
    setCurrentSelected(vehicle.id);
    setSelectedVehicle(vehicle);
  };

  const handleContinue = () => {
    navigation.navigate('LocationRoute');
  };

  const activeVehicleObj =
    VEHICLE_LIST.find((v) => v.id === currentSelected) || VEHICLE_LIST[2];

  const getVehicleName = (vehicle) => {
    return t(vehicle.id) || vehicle.name;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.mode === 'dark' ? '#070C18' : theme.background }]}>
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.mode === 'dark' ? '#070C18' : theme.background}
      />

      {/* Top Location Access Granted Green Banner */}
      {showToast && (
        <View style={styles.topToastContainer}>
          <View style={styles.toastCard}>
            <View style={styles.toastIconWrapper}>
              <Ionicons name="checkmark-circle" size={26} color="#10B981" />
            </View>
            <View style={styles.toastTextWrapper}>
              <Text style={styles.toastTitle}>{t('locationCalibrated') || 'Location Access Granted ✓'}</Text>
              <Text style={styles.toastSubtitle}>
                Live GPS: {mockGpsCoordinates || '18.7337° N, 73.6577° E'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Header Bar with Title */}
      <HeaderBar
        showBack={true}
        showThemeToggle={true}
        title={t('vehicleMode') || 'Vehicle Mode'}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title & Subtitle */}
        <View style={styles.titleSection}>
          <Text style={[styles.mainTitle, { color: theme.textPrimary }]}>
            {t('selectVehicle')}
          </Text>
          <Text style={[styles.subTitle, { color: theme.textSecondary }]}>
            {t('vehicleSubtitle')}
          </Text>
        </View>

        {/* 2x2 Grid of Vehicle Cards */}
        <View style={styles.gridContainer}>
          {VEHICLE_LIST.map((vehicle) => {
            const isSelected = currentSelected === vehicle.id;
            const vehicleLabel = getVehicleName(vehicle);

            return (
              <TouchableOpacity
                key={vehicle.id}
                activeOpacity={0.85}
                onPress={() => handleSelect(vehicle)}
                style={[
                  styles.vehicleCard,
                  {
                    backgroundColor: theme.mode === 'dark' ? '#121A29' : '#FFFFFF',
                    borderColor: isSelected
                      ? '#2563EB'
                      : (theme.mode === 'dark' ? '#1E2E4E' : '#E2E8F0'),
                  },
                  isSelected && styles.vehicleCardSelected,
                ]}
              >
                {/* Circular Photo Thumbnail */}
                <View style={styles.imageCircleWrapper}>
                  <Image
                    source={vehicle.image}
                    style={styles.vehicleImage}
                    resizeMode="cover"
                  />
                </View>

                {/* Vehicle Label */}
                <Text style={[styles.vehicleLabel, { color: theme.textPrimary }]}>
                  {vehicleLabel}
                </Text>

                {/* Selected Check Badge */}
                {isSelected && (
                  <View style={styles.selectedBadge}>
                    <Ionicons name="checkmark-circle" size={22} color="#2563EB" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Continue Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handleContinue}
          style={styles.continueBtn}
        >
          <Text style={styles.continueBtnText}>
            {t('continueWith')} {getVehicleName(activeVehicleObj).toUpperCase()} {activeVehicleObj.emoji} →
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topToastContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xs,
  },
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#062B20',
    borderColor: '#10B981',
    borderWidth: 1.5,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    gap: 12,
  },
  toastIconWrapper: {},
  toastTextWrapper: {
    flex: 1,
  },
  toastTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#34D399',
    marginBottom: 2,
  },
  toastSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D1FAE5',
    letterSpacing: 0.3,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: 110,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 13,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  vehicleCard: {
    width: '47.5%',
    height: 175,
    borderRadius: RADIUS.xl * 1.2,
    borderWidth: 1.5,
    padding: SPACING.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleCardSelected: {
    borderWidth: 2,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  imageCircleWrapper: {
    width: 84,
    height: 84,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: '#1E2E4E',
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  vehicleLabel: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.full,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xl + 14 : SPACING.lg + 12,
  },
  continueBtn: {
    width: '100%',
    height: 54,
    borderRadius: RADIUS.lg,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  continueBtnText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default VehicleSelectionScreen;


import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RADIUS, SPACING } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * MapComponent
 * 
 * Modular Map Visual Layer.
 * When you provide your actual map separately, simply replace or embed
 * your map canvas inside this component.
 * 
 * Props:
 * - mode: 'safe_route' | 'tracking' | 'weather' | 'alerts' | 'default'
 * - mapType: 'default' | 'satellite' | 'terrain'
 * - startingLocation: string
 * - destination: string
 * - activeAlerts: Array
 * - trackingUnits: Array
 * - weatherData: Object
 * - onMarkerPress: Function
 * - onMapPress: Function
 */
export const MapComponent = ({
  mode = 'safe_route',
  mapType = 'default',
  startingLocation = 'Your location',
  destination = 'Babbi Daa Punjabi Restaurant',
  activeAlerts = [],
  trackingUnits = [],
  weatherData = null,
  onMarkerPress,
  onMapPress,
}) => {
  const isSatellite = mapType === 'satellite';

  return (
    <View style={[styles.mapContainer, isSatellite && styles.mapSatelliteBg]}>
      {/* 1. Natural Vector Landmass Simulation */}
      <View style={styles.mapBackground}>
        {/* Water bodies */}
        <View style={[styles.waterBody, isSatellite && { backgroundColor: '#1E3A8A', opacity: 0.9 }]} />
        <View style={[styles.waterStream, isSatellite && { backgroundColor: '#1E3A8A', opacity: 0.9 }]} />

        {/* Forest / Greenery patches */}
        <View style={[styles.forestPatchOne, isSatellite && { backgroundColor: '#14532D', opacity: 0.8 }]} />
        <View style={[styles.forestPatchTwo, isSatellite && { backgroundColor: '#14532D', opacity: 0.7 }]} />

        {/* Arterial Road Networks */}
        <View style={[styles.roadRailway, isSatellite && { backgroundColor: '#475569' }]} />
        <View style={[styles.roadExpressway, isSatellite && { backgroundColor: '#38BDF8' }]} />
        <View style={[styles.roadMainHwy, isSatellite && { backgroundColor: '#CBD5E1', borderColor: '#94A3B8' }]} />
        <View style={styles.roadSecondaryOne} />
        <View style={styles.roadSecondaryTwo} />

        {/* Geographical Town / Corridor Labels */}
        <View style={[styles.mapLabelChip, { top: '48%', right: '26%' }]}>
          <Text style={[styles.mapTownText, isSatellite && { color: '#F8FAFC' }]}>Vadgaon</Text>
          <Text style={[styles.mapTownSubText, isSatellite && { color: '#CBD5E1' }]}>वडगाव</Text>
        </View>
        <View style={[styles.mapLabelChip, { bottom: '26%', right: '22%' }]}>
          <Text style={[styles.mapTownText, isSatellite && { color: '#F8FAFC' }]}>Urse</Text>
          <Text style={[styles.mapTownSubText, isSatellite && { color: '#CBD5E1' }]}>उर्से</Text>
        </View>
        <View style={[styles.mapLabelChip, { top: '22%', left: '16%' }]}>
          <Text style={[styles.mapTownText, isSatellite && { color: '#F8FAFC' }]}>Talegaon</Text>
          <Text style={[styles.mapTownSubText, isSatellite && { color: '#CBD5E1' }]}>तळेगाव</Text>
        </View>

        {/* POI Landmarks */}
        <View style={[styles.poiBadge, { bottom: '38%', left: '8%' }]}>
          <View style={[styles.poiIconBox, { backgroundColor: '#A855F7' }]}>
            <Ionicons name="image" size={12} color="#FFFFFF" />
          </View>
          <Text style={[styles.poiText, isSatellite && { color: '#E2E8F0' }]}>Aibai Mata Waterfalls</Text>
        </View>

        <View style={[styles.poiBadge, { bottom: '10%', left: '44%' }]}>
          <View style={[styles.poiIconBox, { backgroundColor: '#F97316' }]}>
            <Ionicons name="restaurant" size={12} color="#FFFFFF" />
          </View>
          <Text style={[styles.poiText, isSatellite && { color: '#E2E8F0' }]}>Samspire The Mushroom Cafe</Text>
        </View>

        {/* ======================================================== */}
        {/* 🛣️ MODE: SAFE ROUTE / STANDARD (User Safe Corridor) */}
        {/* ======================================================== */}
        {(mode === 'safe_route' || mode === 'default') && (
          <View style={styles.routeContainer} pointerEvents="box-none">
            {/* Safe Corridor Glow underlay (Green safety aura) */}
            <View style={styles.safeCorridorGlow} />

            {/* Smooth Connected Route Path */}
            <View style={styles.routeSegment1} />
            <View style={styles.routeSegment2} />
            <View style={styles.routeSegment3} />
            <View style={styles.routeSegment4} />
            <View style={styles.routeSegment5} />

            {/* Destination Marker (Red Pin with white shadow halo) */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onMarkerPress && onMarkerPress('destination')}
              style={styles.destinationPinWrapper}
            >
              <View style={styles.pinCircleBase} />
              <Ionicons name="location" size={38} color="#EA4335" />
              <View style={styles.destinationCallout}>
                <Text style={styles.calloutText} numberOfLines={1}>
                  {destination || 'Destination'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Starting Origin Marker (Blue Pulsing Target Ring) */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onMarkerPress && onMarkerPress('origin')}
              style={styles.originMarkerWrapper}
            >
              <View style={styles.originPulseOuter} />
              <View style={styles.originMarkerInner} />
            </TouchableOpacity>

            {/* Floating Estimated Route Time Chip with Safe Route Shield */}
            <View style={styles.routeDurationBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#10B981" />
              <Text style={styles.routeDurationText}>14 min (Safe Route)</Text>
            </View>
          </View>
        )}

        {/* ======================================================== */}
        {/* 🚨 MODE: AUTHORITY LIVE TRACKING */}
        {/* ======================================================== */}
        {mode === 'tracking' && (
          <View style={styles.trackingOverlay} pointerEvents="box-none">
            {/* Tracking Radar Waves */}
            <View style={[styles.radarCircle, { top: '35%', left: '30%' }]} />
            <View style={[styles.radarCircleSmall, { top: '38%', left: '33%' }]} />

            {/* Patrol Unit 1 (Active NDRF Vehicle) */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => onMarkerPress && onMarkerPress('unit_01')}
              style={[styles.patrolMarker, { top: '36%', left: '38%' }]}
            >
              <View style={styles.patrolPill}>
                <View style={styles.patrolDotGreen} />
                <Text style={styles.patrolText}>Patrol 01 • Fast Response</Text>
              </View>
              <View style={styles.patrolVehicleIconBox}>
                <Ionicons name="car" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            {/* Patrol Unit 2 (Road Clearance Unit) */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => onMarkerPress && onMarkerPress('unit_02')}
              style={[styles.patrolMarker, { top: '55%', left: '58%' }]}
            >
              <View style={styles.patrolPill}>
                <View style={styles.patrolDotBlue} />
                <Text style={styles.patrolText}>Unit 04 • Highway Patrol</Text>
              </View>
              <View style={[styles.patrolVehicleIconBox, { backgroundColor: '#0284C7' }]}>
                <MaterialCommunityIcons name="tow-truck" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            {/* Checkpoint Station Marker */}
            <View style={[styles.checkpointMarker, { top: '48%', left: '20%' }]}>
              <View style={styles.checkpointIcon}>
                <Ionicons name="shield" size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.checkpointLabel}>Checkpoint Alpha</Text>
            </View>
          </View>
        )}

        {/* ======================================================== */}
        {/* 🌦️ MODE: WEATHER RADAR MAP OVERLAY */}
        {/* ======================================================== */}
        {mode === 'weather' && (
          <View style={styles.weatherOverlay} pointerEvents="box-none">
            {/* Precipitation Clouds Simulation */}
            <View style={styles.rainCloudZone1} />
            <View style={styles.rainCloudZone2} />

            {/* Live Weather Station Badges */}
            <View style={[styles.weatherBadgeOnMap, { top: '32%', left: '22%' }]}>
              <Ionicons name="rainy" size={18} color="#0284C7" />
              <View>
                <Text style={styles.weatherTempText}>22°C</Text>
                <Text style={styles.weatherCondText}>Moderate Rain • 4.2mm/h</Text>
              </View>
            </View>

            <View style={[styles.weatherBadgeOnMap, { bottom: '30%', right: '18%' }]}>
              <Ionicons name="partly-sunny" size={18} color="#F59E0B" />
              <View>
                <Text style={styles.weatherTempText}>26°C</Text>
                <Text style={styles.weatherCondText}>Clear Visibility</Text>
              </View>
            </View>

            {/* Landslide Risk Zone Indicator */}
            <View style={[styles.hazardZoneBadge, { top: '58%', left: '42%' }]}>
              <Ionicons name="warning" size={14} color="#EF4444" />
              <Text style={styles.hazardZoneText}>High Landslide Risk Zone</Text>
            </View>
          </View>
        )}

        {/* ======================================================== */}
        {/* ⚠️ ACTIVE GEOTAGGED ALERTS / NOTIFICATIONS ON MAP */}
        {/* ======================================================== */}
        {(activeAlerts || []).map((alert, idx) => (
          <TouchableOpacity
            key={alert.id || idx}
            activeOpacity={0.85}
            onPress={() => onMarkerPress && onMarkerPress(alert)}
            style={[
              styles.geotaggedAlertPin,
              {
                top: alert.top || `${38 + (idx * 14)}%`,
                left: alert.left || `${35 + (idx * 20)}%`,
              },
            ]}
          >
            <View
              style={[
                styles.alertPinCircle,
                alert.severity === 'high' ? styles.alertPinHigh : styles.alertPinMedium,
              ]}
            >
              <Ionicons
                name={alert.icon || 'warning'}
                size={16}
                color="#FFFFFF"
              />
            </View>
            <View style={styles.alertCallout}>
              <Text style={styles.alertCalloutTitle} numberOfLines={1}>
                {alert.title}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F3EFE7', // Natural landmass cream
    overflow: 'hidden',
  },
  mapSatelliteBg: {
    backgroundColor: '#0F172A',
  },
  mapBackground: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },

  /* Water bodies */
  waterBody: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 240,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#A5D6F7',
    opacity: 0.85,
  },
  waterStream: {
    position: 'absolute',
    bottom: 80,
    left: -40,
    width: '130%',
    height: 16,
    backgroundColor: '#A5D6F7',
    transform: [{ rotate: '-8deg' }],
    opacity: 0.8,
  },

  /* Forest Patches */
  forestPatchOne: {
    position: 'absolute',
    bottom: 20,
    left: '15%',
    width: 150,
    height: 95,
    borderRadius: 48,
    backgroundColor: '#C8E6C9',
    opacity: 0.55,
  },
  forestPatchTwo: {
    position: 'absolute',
    top: '32%',
    left: -20,
    width: 110,
    height: 130,
    borderRadius: 55,
    backgroundColor: '#C8E6C9',
    opacity: 0.5,
  },

  /* Roads */
  roadRailway: {
    position: 'absolute',
    top: '36%',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#94A3B8',
    transform: [{ rotate: '12deg' }],
  },
  roadExpressway: {
    position: 'absolute',
    bottom: '22%',
    left: -20,
    right: -20,
    height: 5,
    backgroundColor: '#60A5FA',
    transform: [{ rotate: '-10deg' }],
  },
  roadMainHwy: {
    position: 'absolute',
    top: '44%',
    left: -40,
    right: -40,
    height: 8,
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    transform: [{ rotate: '18deg' }],
  },
  roadSecondaryOne: {
    position: 'absolute',
    top: '25%',
    left: '20%',
    width: 6,
    height: '60%',
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '-35deg' }],
  },
  roadSecondaryTwo: {
    position: 'absolute',
    top: '15%',
    left: '45%',
    width: 4.5,
    height: '70%',
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '25deg' }],
  },

  /* Labels */
  mapLabelChip: {
    position: 'absolute',
    alignItems: 'center',
  },
  mapTownText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  mapTownSubText: {
    fontSize: 11,
    color: '#64748B',
  },
  poiBadge: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  poiIconBox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  poiText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#475569',
    maxWidth: 130,
  },

  /* Route Segments */
  routeContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  safeCorridorGlow: {
    position: 'absolute',
    top: '32%',
    left: '10%',
    width: '78%',
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    transform: [{ rotate: '12deg' }],
  },
  routeSegment1: {
    position: 'absolute',
    top: '34.5%',
    left: '12%',
    width: 80,
    height: 7,
    backgroundColor: '#3B82F6',
    borderRadius: 4,
    transform: [{ rotate: '8deg' }],
    elevation: 3,
  },
  routeSegment2: {
    position: 'absolute',
    top: '37%',
    left: '25%',
    width: 110,
    height: 7,
    backgroundColor: '#2563EB',
    borderRadius: 4,
    transform: [{ rotate: '18deg' }],
    elevation: 3,
  },
  routeSegment3: {
    position: 'absolute',
    top: '43%',
    left: '46%',
    width: 100,
    height: 7.5,
    backgroundColor: '#1D4ED8',
    borderRadius: 4,
    transform: [{ rotate: '42deg' }],
    elevation: 3,
  },
  routeSegment4: {
    position: 'absolute',
    top: '50%',
    left: '64%',
    width: 80,
    height: 7.5,
    backgroundColor: '#1E40AF',
    borderRadius: 4,
    transform: [{ rotate: '10deg' }],
    elevation: 3,
  },
  routeSegment5: {
    position: 'absolute',
    top: '52.5%',
    left: '80%',
    width: 65,
    height: 7.5,
    backgroundColor: '#1E3A8A',
    borderRadius: 4,
    transform: [{ rotate: '-25deg' }],
    elevation: 3,
  },
  destinationPinWrapper: {
    position: 'absolute',
    top: '30%',
    left: '11%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    zIndex: 20,
  },
  pinCircleBase: {
    position: 'absolute',
    bottom: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  destinationCallout: {
    position: 'absolute',
    top: -26,
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    maxWidth: 150,
  },
  calloutText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  originMarkerWrapper: {
    position: 'absolute',
    top: '51%',
    right: '8%',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    zIndex: 20,
  },
  originPulseOuter: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  originMarkerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563EB',
  },
  routeDurationBadge: {
    position: 'absolute',
    top: '54%',
    right: '20%',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 15,
  },
  routeDurationText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },

  /* Authority Live Tracking Styles */
  trackingOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  radarCircle: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1.5,
    borderColor: 'rgba(37, 99, 235, 0.35)',
    backgroundColor: 'rgba(37, 99, 235, 0.06)',
  },
  radarCircleSmall: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: 'rgba(37, 99, 235, 0.5)',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  patrolMarker: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 30,
  },
  patrolPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    gap: 5,
    marginBottom: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  patrolDotGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  patrolDotBlue: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
  },
  patrolText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '700',
  },
  patrolVehicleIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  checkpointMarker: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 25,
  },
  checkpointIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  checkpointLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#064E3B',
    marginTop: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },

  /* Weather Overlay Styles */
  weatherOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  rainCloudZone1: {
    position: 'absolute',
    top: '25%',
    left: '15%',
    width: 180,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(2, 132, 199, 0.22)',
    borderWidth: 1.5,
    borderColor: 'rgba(2, 132, 199, 0.4)',
  },
  rainCloudZone2: {
    position: 'absolute',
    top: '45%',
    right: '10%',
    width: 140,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(14, 165, 233, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
  },
  weatherBadgeOnMap: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    zIndex: 25,
  },
  weatherTempText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  weatherCondText: {
    fontSize: 9.5,
    color: '#475569',
    fontWeight: '600',
  },
  hazardZoneBadge: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 5,
    zIndex: 25,
  },
  hazardZoneText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#B91C1C',
  },

  /* Geotagged Alerts */
  geotaggedAlertPin: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 35,
  },
  alertPinCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  alertPinHigh: {
    backgroundColor: '#EF4444',
  },
  alertPinMedium: {
    backgroundColor: '#F59E0B',
  },
  alertCallout: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
    maxWidth: 120,
  },
  alertCalloutTitle: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
});

export default MapComponent;

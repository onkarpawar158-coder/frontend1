import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
  FontAwesome5,
} from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { RADIUS, SPACING } from '../constants/theme';
import { MapComponent } from '../components/MapComponent';
import { DrawerMenu } from '../components/DrawerMenu';
import { BottomNavBar } from '../components/BottomNavBar';
import { LANGUAGES } from '../translations';
import { VEHICLE_LIST } from './ProfileLanguageScreen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const LocationRouteScreen = ({ navigation }) => {
  const {
    theme,
    userName,
    setUserName,
    userEmail,
    setUserEmail,
    mobileNumber,
    setMobileNumber,
    currentUser,
    userProfile,
    saveUserProfileToFirestore,
    selectedVehicle,
    setSelectedVehicle,
    selectedLanguage,
    setSelectedLanguage,
    selectedTheme,
    toggleTheme,
    mockGpsCoordinates,
    logout,
    sendEmailAlert,
    dispatchedEmails,
    lastDispatchedEmail,
    setLastDispatchedEmail,
    t,
  } = useApp();

  // Navigation & View States
  const [activeRole, setActiveRole] = useState('USER'); // 'USER' | 'AUTHORITY'
  const [activeMenuItem, setActiveMenuItem] = useState('safe_route'); // 'safe_route' | 'live_tracking' | 'field_report' | 'alert'
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'weather' | 'notification' | 'profile'
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mapType, setMapType] = useState('default'); // 'default' | 'satellite'

  // Route Planning Inputs
  const [startingLocation, setStartingLocation] = useState('Your location');
  const [destination, setDestination] = useState('Babbi Daa Punjabi Restaurant');

  // Active Map Alerts Data (Connected with Notification & Email Routing)
  const [activeAlerts, setActiveAlerts] = useState([
    {
      id: 'alt_1',
      title: 'Landslide Warning (NH-6)',
      type: 'Landslide',
      severity: 'high',
      location: 'NH-6 Km 42 • Vadgaon Bypass',
      desc: 'Partial debris on northbound lane. Single lane traffic operational. Proceed with extreme caution.',
      time: '12 min ago',
      icon: 'warning',
      top: '42%',
      left: '30%',
      isEmailSent: true,
    },
    {
      id: 'alt_2',
      title: 'Waterlogging & Flood Advisory',
      type: 'Flood',
      severity: 'medium',
      location: 'Urse Bridge Overpass',
      desc: '1.5 ft standing water reported near bridge curvature. Low-clearance vehicles advised to divert.',
      time: '34 min ago',
      icon: 'water',
      top: '56%',
      left: '60%',
      isEmailSent: true,
    },
    {
      id: 'alt_3',
      title: 'Safe Corridor Active',
      type: 'Safe Route',
      severity: 'low',
      location: 'Talegaon Expressway',
      desc: 'Designated hazard-free green corridor cleared by NER logistics patrol.',
      time: '1 hour ago',
      icon: 'shield-checkmark',
      top: '24%',
      left: '48%',
      isEmailSent: true,
    },
  ]);

  // Saved Places State (Profile -> Saved Places)
  const [savedPlaces, setSavedPlaces] = useState([
    { id: 'sp_1', title: 'Home Base', address: 'Guwahati Logistics Hub, Assam', icon: 'home' },
    { id: 'sp_2', title: 'Work Depot', address: 'Shillong Distribution Terminal, Meghalaya', icon: 'briefcase' },
    { id: 'sp_3', title: 'Babbi Daa Restaurant', address: 'Old NH-4 Bypass, Vadgaon', icon: 'restaurant' },
  ]);
  const [newPlaceTitle, setNewPlaceTitle] = useState('');
  const [newPlaceAddress, setNewPlaceAddress] = useState('');
  const [showAddPlaceModal, setShowAddPlaceModal] = useState(false);

  // Field Report Form State (Authority -> Field Report)
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('Landslide');
  const [reportLocation, setReportLocation] = useState('NH-6 Vadgaon Ridge, Sector 4');
  const [reportDesc, setReportDesc] = useState('');
  const [reportHasPhoto, setReportHasPhoto] = useState(false);
  const [reportSuccessToast, setReportSuccessToast] = useState('');

  // Authority Alert Creator Modal (Authority -> Alert)
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [newAlertTitle, setNewAlertTitle] = useState('');
  const [newAlertType, setNewAlertType] = useState('Road blockage');
  const [newAlertLocation, setNewAlertLocation] = useState('Talegaon Expressway Jn');
  const [newAlertSeverity, setNewAlertSeverity] = useState('high'); // 'high' | 'medium'
  const [newAlertDesc, setNewAlertDesc] = useState('');

  // Profile Edit State
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editName, setEditName] = useState(userName || userProfile?.name || '');
  const [editEmail, setEditEmail] = useState(userEmail || userProfile?.email || '');
  const [editPhone, setEditPhone] = useState(mobileNumber || userProfile?.phoneNumber || '');

  // Logout Confirm Modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Notification Filter
  const [notificationFilter, setNotificationFilter] = useState('All');

  const displayName = userName || userProfile?.name || 'Logistics Partner';
  const displayEmail = userEmail || userProfile?.email || (userName ? `${userName.toLowerCase().replace(/\s+/g, '')}@bharatnetra.gov.in` : 'partner@bharatnetra.gov.in');
  const displayMobile = mobileNumber ? `+91 ${mobileNumber}` : (userProfile?.phoneNumber || '');

  // Swap Locations in User Route Input
  const handleSwapLocations = () => {
    const temp = startingLocation;
    setStartingLocation(destination);
    setDestination(temp);
  };

  // Recenter GPS
  const handleRecenter = () => {
    setStartingLocation(`Your location (${mockGpsCoordinates || '18.734° N, 73.658° E'})`);
  };

  // Select Tab
  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'home') {
      // Home default: Safe route map
      setActiveRole('USER');
      setActiveMenuItem('safe_route');
    }
  };

  // Handle drawer role selection
  const handleSelectRole = (role) => {
    setActiveRole(role);
  };

  // Handle drawer item selection
  const handleSelectMenuItem = (item) => {
    setActiveMenuItem(item);
    if (item === 'safe_route') {
      setActiveRole('USER');
      setActiveTab('home');
    } else if (item === 'live_tracking') {
      setActiveRole('AUTHORITY');
      setActiveTab('home');
    } else if (item === 'field_report') {
      setActiveRole('AUTHORITY');
      setShowReportModal(true);
    } else if (item === 'alert') {
      setActiveRole('AUTHORITY');
      setShowAlertModal(true);
    }
  };

  // Submit Field Report -> Dispatches confirmation to user email
  const handleSubmitFieldReport = () => {
    if (!reportDesc.trim()) {
      alert('Please enter a description for the field report.');
      return;
    }
    const newReportAlert = {
      id: `report_${Date.now()}`,
      title: `Field Report: ${reportType}`,
      type: reportType,
      severity: reportType === 'Landslide' || reportType === 'Flood' ? 'high' : 'medium',
      location: reportLocation,
      desc: reportDesc,
      time: 'Just now',
      icon: reportType === 'Flood' ? 'water' : 'warning',
      top: '46%',
      left: '52%',
      isEmailSent: true,
    };

    // Dispatch email copy to verified user email
    if (typeof sendEmailAlert === 'function') {
      sendEmailAlert({
        title: `Field Report: ${reportType}`,
        type: reportType,
        location: reportLocation,
        severity: 'medium',
        desc: `Your field report for ${reportLocation} has been registered and synced to NER Control Hub.`,
      });
    }

    setActiveAlerts((prev) => [newReportAlert, ...prev]);
    setShowReportModal(false);
    setReportDesc('');
    setReportHasPhoto(false);
    setReportSuccessToast(`✓ Field Report submitted & confirmation sent to ${displayEmail}!`);
    setTimeout(() => setReportSuccessToast(''), 5000);
  };

  // Create & Broadcast Alert -> Dispatches emergency email to user email
  const handleBroadcastAlert = () => {
    if (!newAlertTitle.trim()) {
      alert('Please provide an Alert Title');
      return;
    }
    const newAlertObj = {
      id: `alert_${Date.now()}`,
      title: newAlertTitle,
      type: newAlertType,
      severity: newAlertSeverity,
      location: newAlertLocation,
      desc: newAlertDesc || 'Official emergency broadcast from Regional Control.',
      time: 'Just now',
      icon: 'megaphone',
      top: '38%',
      left: '44%',
      isEmailSent: true,
    };

    // Dispatch live emergency email notification to verified user email
    if (typeof sendEmailAlert === 'function') {
      sendEmailAlert({
        title: newAlertTitle,
        type: newAlertType,
        location: newAlertLocation,
        severity: newAlertSeverity,
        desc: newAlertDesc || 'Official emergency corridor alert from NER Regional Control.',
      });
    }

    setActiveAlerts((prev) => [newAlertObj, ...prev]);
    setShowAlertModal(false);
    setNewAlertTitle('');
    setNewAlertDesc('');
    setReportSuccessToast(`🚨 Alert broadcasted & Emergency Email dispatched to ${displayEmail}!`);
    setTimeout(() => setReportSuccessToast(''), 5000);
  };

  // Dispatch individual alert to user email
  const handleSendSingleAlertEmail = (alertItem) => {
    if (typeof sendEmailAlert === 'function') {
      sendEmailAlert({
        title: alertItem.title,
        type: alertItem.type,
        location: alertItem.location,
        severity: alertItem.severity,
        desc: alertItem.desc,
      });
    }
    setReportSuccessToast(`✉️ Alert details dispatched to ${displayEmail}!`);
    setTimeout(() => setReportSuccessToast(''), 4000);
  };

  // Add Saved Place
  const handleAddSavedPlace = () => {
    if (!newPlaceTitle.trim() || !newPlaceAddress.trim()) {
      alert('Please provide title and address.');
      return;
    }
    const newPlace = {
      id: `sp_${Date.now()}`,
      title: newPlaceTitle,
      address: newPlaceAddress,
      icon: 'location',
    };
    setSavedPlaces((prev) => [...prev, newPlace]);
    setNewPlaceTitle('');
    setNewPlaceAddress('');
    setShowAddPlaceModal(false);
  };

  // Delete Saved Place
  const handleDeleteSavedPlace = (id) => {
    setSavedPlaces((prev) => prev.filter((p) => p.id !== id));
  };

  // Save Profile Changes
  const handleSaveProfile = async () => {
    if (editName.trim()) setUserName(editName.trim());
    if (editEmail.trim()) setUserEmail(editEmail.trim());
    if (editPhone.trim()) setMobileNumber(editPhone.trim());
    await saveUserProfileToFirestore({
      uid: currentUser?.uid || `user_${Date.now()}`,
      name: editName.trim(),
      email: editEmail.trim(),
      phoneNumber: editPhone.trim(),
      provider: 'email',
    });
    setShowEditProfileModal(false);
    setReportSuccessToast(`✓ Profile updated & Email synced: ${editEmail.trim()}`);
    setTimeout(() => setReportSuccessToast(''), 4000);
  };

  // Confirm Logout
  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }],
    });
  };

  // Determine Map Mode
  const getMapMode = () => {
    if (activeTab === 'weather') return 'weather';
    if (activeTab === 'notification') return 'alerts';
    if (activeRole === 'AUTHORITY' && activeMenuItem === 'live_tracking') return 'tracking';
    return 'safe_route';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#070C18' }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ========================================================= */}
      {/* 🗺️ CENTRAL MAP CANVAS (Modular MapComponent) */}
      {/* ========================================================= */}
      <MapComponent
        mode={getMapMode()}
        mapType={mapType}
        startingLocation={startingLocation}
        destination={destination}
        activeAlerts={activeAlerts}
        onMarkerPress={(marker) => {
          if (marker?.title) {
            alert(`📍 ${marker.title}\n\nLocation: ${marker.location}\n\n${marker.desc}`);
          }
        }}
      />

      {/* ========================================================= */}
      {/* 🧭 TOP FLOATING HEADER BAR WITH HAMBURGER (☰) */}
      {/* ========================================================= */}
      <View style={styles.topHeaderContainer}>
        {/* Top Control Bar Row */}
        <View style={styles.topControlRow}>
          {/* Three-Line Menu (Hamburger Icon) */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setDrawerOpen(true)}
            style={styles.hamburgerBtn}
            accessibilityLabel="Open Menu"
          >
            <Ionicons name="menu" size={24} color="#0F172A" />
          </TouchableOpacity>

          {/* Active Mode / Role Indicator Pill */}
          <View style={styles.roleHeaderPill}>
            <View
              style={[
                styles.roleStatusDot,
                { backgroundColor: activeRole === 'AUTHORITY' ? '#F59E0B' : '#10B981' },
              ]}
            />
            <Text style={styles.roleHeaderText}>
              {activeRole === 'AUTHORITY'
                ? `AUTHORITY • ${activeMenuItem.replace('_', ' ').toUpperCase()}`
                : 'USER • SAFE ROUTE'}
            </Text>
          </View>

          {/* Right Floating Actions (Layers toggle & Vehicle Mode) */}
          <View style={styles.headerRightActions}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setMapType((prev) => (prev === 'default' ? 'satellite' : 'default'))}
              style={styles.headerSquareBtn}
            >
              <Ionicons
                name={mapType === 'satellite' ? 'earth' : 'layers'}
                size={19}
                color="#0F172A"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ========================================================= */}
        {/* 🛣️ USER FLOW: SAFE ROUTE SEARCH BOX (Visible in Home tab) */}
        {/* ========================================================= */}
        {activeTab === 'home' && activeRole === 'USER' && (
          <View style={styles.floatingRouteCard}>
            {/* Left Timeline Dots */}
            <View style={styles.routeCardLeftCol}>
              <View style={styles.blueDotWrapper}>
                <View style={styles.blueDotInner} />
              </View>
              <View style={styles.verticalDottedConnector}>
                <View style={styles.connectorDot} />
                <View style={styles.connectorDot} />
                <View style={styles.connectorDot} />
              </View>
              <Ionicons name="location-outline" size={18} color="#EA4335" />
            </View>

            {/* Middle Text Inputs */}
            <View style={styles.routeCardCenterCol}>
              <View style={styles.locationInputRow}>
                <TextInput
                  value={startingLocation}
                  onChangeText={setStartingLocation}
                  placeholder="Choose starting point"
                  placeholderTextColor="#94A3B8"
                  style={styles.locationTextInput}
                />
              </View>

              <View style={styles.routeInnerDivider} />

              <View style={styles.locationInputRow}>
                <TextInput
                  value={destination}
                  onChangeText={setDestination}
                  placeholder="Choose destination (Safe Route)"
                  placeholderTextColor="#94A3B8"
                  style={[styles.locationTextInput, styles.destinationTextBold]}
                />
              </View>
            </View>

            {/* Right Swap & Options */}
            <View style={styles.routeCardRightCol}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleRecenter()}
                style={styles.iconActionBtn}
              >
                <MaterialCommunityIcons name="crosshairs-gps" size={18} color="#2563EB" />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleSwapLocations}
                style={styles.iconActionBtn}
              >
                <Ionicons name="swap-vertical" size={19} color="#475569" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Authority Quick Actions Bar (When Authority Mode Active) */}
        {activeTab === 'home' && activeRole === 'AUTHORITY' && (
          <View style={styles.authorityToolbarCard}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowReportModal(true)}
              style={[styles.authorityToolBtn, { backgroundColor: '#10B981' }]}
            >
              <Ionicons name="add-circle" size={16} color="#FFFFFF" />
              <Text style={styles.authorityToolBtnText}>New Field Report</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowAlertModal(true)}
              style={[styles.authorityToolBtn, { backgroundColor: '#EF4444' }]}
            >
              <Ionicons name="megaphone" size={15} color="#FFFFFF" />
              <Text style={styles.authorityToolBtnText}>Broadcast Alert</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Success Notification Banner */}
      {reportSuccessToast ? (
        <View style={styles.toastBanner}>
          <Text style={styles.toastBannerText}>{reportSuccessToast}</Text>
        </View>
      ) : null}

      {/* Floating GPS Recenter Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleRecenter}
        style={styles.floatingGpsBtn}
      >
        <View style={styles.gpsTargetRing}>
          <View style={styles.gpsTargetDot} />
        </View>
      </TouchableOpacity>

      {/* ========================================================= */}
      {/* 🌦️ TAB 2: WEATHER VIEW OVERLAY */}
      {/* ========================================================= */}
      {activeTab === 'weather' && (
        <View style={styles.weatherSheetContainer}>
          <View style={[styles.weatherCard, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
            <View style={styles.weatherCardHeader}>
              <View style={styles.weatherHeaderLeft}>
                <Ionicons name="rainy" size={28} color="#0284C7" />
                <View>
                  <Text style={[styles.weatherLocationTitle, { color: theme.textPrimary }]}>
                    Northeast Weather Radar
                  </Text>
                  <Text style={[styles.weatherSub, { color: theme.textSecondary }]}>
                    Live Monsoon & Landslide Risk Index
                  </Text>
                </View>
              </View>
              <View style={styles.tempBadge}>
                <Text style={styles.tempText}>22°C</Text>
              </View>
            </View>

            <View style={styles.weatherMetricsRow}>
              <View style={[styles.metricBox, { backgroundColor: theme.mode === 'dark' ? '#0E1726' : '#F1F5F9' }]}>
                <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Precipitation</Text>
                <Text style={[styles.metricValue, { color: '#0284C7' }]}>4.2 mm/hr</Text>
              </View>
              <View style={[styles.metricBox, { backgroundColor: theme.mode === 'dark' ? '#0E1726' : '#F1F5F9' }]}>
                <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Landslide Risk</Text>
                <Text style={[styles.metricValue, { color: '#EF4444' }]}>Moderate ⚠️</Text>
              </View>
              <View style={[styles.metricBox, { backgroundColor: theme.mode === 'dark' ? '#0E1726' : '#F1F5F9' }]}>
                <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Road Visibility</Text>
                <Text style={[styles.metricValue, { color: '#10B981' }]}>3.8 km (Good)</Text>
              </View>
            </View>

            <View style={styles.weatherWarningBox}>
              <Ionicons name="information-circle" size={16} color="#F59E0B" />
              <Text style={styles.weatherWarningText}>
                Active rainfall across Vadgaon-Urse ghats. Safe routing algorithm has adjusted speeds to 40 km/h.
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* ========================================================= */}
      {/* 🔔 TAB 3: NOTIFICATION VIEW OVERLAY ("from map") */}
      {/* ========================================================= */}
      {activeTab === 'notification' && (
        <View style={styles.notificationSheetContainer}>
          <View style={[styles.notificationCard, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
            <View style={styles.notifHeaderRow}>
              <View style={styles.notifTitleGroup}>
                <Ionicons name="notifications" size={20} color="#2563EB" />
                <View>
                  <Text style={[styles.notifMainTitle, { color: theme.textPrimary }]}>
                    Map Alerts & Notifications
                  </Text>
                  <Text style={{ fontSize: 11, color: '#10B981', fontWeight: '700', marginTop: 2 }}>
                    📧 Synced to: {displayEmail}
                  </Text>
                </View>
              </View>
              <View style={styles.notifCountBadge}>
                <Text style={styles.notifCountText}>{activeAlerts.length} Active</Text>
              </View>
            </View>

            {/* Filter Pills */}
            <View style={styles.notifFilterRow}>
              {['All', 'Landslide', 'Flood', 'Safe Route'].map((f) => (
                <TouchableOpacity
                  key={f}
                  onPress={() => setNotificationFilter(f)}
                  style={[
                    styles.notifFilterPill,
                    notificationFilter === f && styles.notifFilterPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.notifFilterText,
                      notificationFilter === f && styles.notifFilterTextActive,
                    ]}
                  >
                    {f}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Notifications List */}
            <ScrollView style={styles.notifScroll} showsVerticalScrollIndicator={false}>
              {activeAlerts
                .filter((a) => notificationFilter === 'All' || a.type.toLowerCase().includes(notificationFilter.toLowerCase()))
                .map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.notifItemBox,
                      {
                        backgroundColor: theme.mode === 'dark' ? '#0E1726' : '#F8FAFC',
                        borderColor: item.severity === 'high' ? 'rgba(239, 68, 68, 0.4)' : theme.surfaceBorder,
                      },
                    ]}
                  >
                    <View style={styles.notifItemTop}>
                      <View style={styles.notifIconTitle}>
                        <View
                          style={[
                            styles.notifItemIconCircle,
                            { backgroundColor: item.severity === 'high' ? '#EF4444' : '#2563EB' },
                          ]}
                        >
                          <Ionicons name={item.icon || 'warning'} size={14} color="#FFFFFF" />
                        </View>
                        <View>
                          <Text style={[styles.notifItemTitle, { color: theme.textPrimary }]}>
                            {item.title}
                          </Text>
                          <Text style={[styles.notifItemLocation, { color: theme.textSecondary }]}>
                            📍 {item.location}
                          </Text>
                        </View>
                      </View>
                      <View style={{ alignItems: 'flex-end', gap: 4 }}>
                        <Text style={[styles.notifItemTime, { color: theme.textMuted }]}>{item.time}</Text>
                        <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, borderWidth: 0.8, borderColor: 'rgba(16, 185, 129, 0.4)' }}>
                          <Text style={{ fontSize: 9.5, color: '#10B981', fontWeight: '800' }}>✉️ Email Sent</Text>
                        </View>
                      </View>
                    </View>

                    <Text style={[styles.notifItemDesc, { color: theme.textSecondary }]}>
                      {item.desc}
                    </Text>

                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                      <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={() => {
                          setActiveTab('home');
                          setDestination(item.location);
                        }}
                        style={[styles.viewOnMapBtn, { flex: 1 }]}
                      >
                        <Text style={styles.viewOnMapText}>View on Map 🗺️</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={() => handleSendSingleAlertEmail(item)}
                        style={[styles.viewOnMapBtn, { backgroundColor: 'rgba(56, 189, 248, 0.15)', borderColor: 'rgba(56, 189, 248, 0.4)', flex: 1 }]}
                      >
                        <Text style={[styles.viewOnMapText, { color: '#38BDF8' }]}>Send to Email 📧</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* ========================================================= */}
      {/* 👤 TAB 4: PROFILE VIEW OVERLAY (User Info, Saved Places, Setting, Log Out) */}
      {/* ========================================================= */}
      {activeTab === 'profile' && (
        <View style={styles.profileSheetContainer}>
          <ScrollView
            contentContainerStyle={styles.profileScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* 1. USER INFO CARD */}
            <View style={[styles.profileSectionCard, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionHeaderTitleGroup}>
                  <Ionicons name="person-circle" size={20} color="#2563EB" />
                  <Text style={[styles.profileSectionTitle, { color: theme.textPrimary }]}>
                    User Info
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowEditProfileModal(true)}
                  style={styles.editProfileBtn}
                >
                  <Feather name="edit-2" size={13} color="#2563EB" />
                  <Text style={styles.editProfileText}>Edit</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.userInfoGrid}>
                <View style={styles.profileFieldRow}>
                  <Text style={[styles.profileFieldLabel, { color: theme.textSecondary }]}>Name:</Text>
                  <Text style={[styles.profileFieldValue, { color: theme.textPrimary }]}>{displayName}</Text>
                </View>
                <View style={styles.profileFieldRow}>
                  <Text style={[styles.profileFieldLabel, { color: theme.textSecondary }]}>Email (Verified):</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 }}>
                    <Text style={[styles.profileFieldValue, { color: theme.textPrimary }]} numberOfLines={1}>{displayEmail}</Text>
                    <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, borderWidth: 0.8, borderColor: '#10B981' }}>
                      <Text style={{ fontSize: 9.5, color: '#10B981', fontWeight: '800' }}>✓ Verified</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.profileFieldRow}>
                  <Text style={[styles.profileFieldLabel, { color: theme.textSecondary }]}>Email Alerts:</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#10B981' }} />
                    <Text style={[styles.profileFieldValue, { color: '#10B981', fontWeight: '700' }]}>Active (Live Dispatch)</Text>
                  </View>
                </View>
                <View style={styles.profileFieldRow}>
                  <Text style={[styles.profileFieldLabel, { color: theme.textSecondary }]}>Vehicle Mode:</Text>
                  <Text style={[styles.profileFieldValue, { color: '#2563EB', fontWeight: '800' }]}>
                    {selectedVehicle?.emoji || '🚗'} {selectedVehicle?.name || 'Car'}
                  </Text>
                </View>
              </View>
            </View>

            {/* 2. SAVED PLACES CARD */}
            <View style={[styles.profileSectionCard, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionHeaderTitleGroup}>
                  <Ionicons name="bookmark" size={19} color="#10B981" />
                  <Text style={[styles.profileSectionTitle, { color: theme.textPrimary }]}>
                    Saved Places
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowAddPlaceModal(true)}
                  style={styles.addPlaceBtn}
                >
                  <Ionicons name="add" size={16} color="#10B981" />
                  <Text style={styles.addPlaceText}>Add Place</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.savedPlacesList}>
                {savedPlaces.map((place) => (
                  <View
                    key={place.id}
                    style={[styles.savedPlaceItem, { backgroundColor: theme.mode === 'dark' ? '#0E1726' : '#F8FAFC', borderColor: theme.surfaceBorder }]}
                  >
                    <View style={styles.savedPlaceLeft}>
                      <View style={styles.savedPlaceIconBox}>
                        <Ionicons name={place.icon || 'location'} size={15} color="#2563EB" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.savedPlaceTitle, { color: theme.textPrimary }]}>
                          {place.title}
                        </Text>
                        <Text style={[styles.savedPlaceAddress, { color: theme.textSecondary }]} numberOfLines={1}>
                          {place.address}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.savedPlaceActions}>
                      <TouchableOpacity
                        onPress={() => {
                          setDestination(place.address);
                          setActiveTab('home');
                        }}
                        style={styles.routePlaceBtn}
                      >
                        <Ionicons name="navigate" size={13} color="#FFFFFF" />
                        <Text style={styles.routePlaceBtnText}>Route</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteSavedPlace(place.id)}
                        style={styles.deletePlaceBtn}
                      >
                        <Ionicons name="trash-outline" size={15} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* 3. SETTING CARD */}
            <View style={[styles.profileSectionCard, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionHeaderTitleGroup}>
                  <Ionicons name="settings" size={19} color="#F59E0B" />
                  <Text style={[styles.profileSectionTitle, { color: theme.textPrimary }]}>
                    Setting
                  </Text>
                </View>
              </View>

              {/* Theme Toggle Row */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={toggleTheme}
                style={styles.settingRow}
              >
                <View style={styles.settingRowLeft}>
                  <Ionicons name={selectedTheme === 'dark' ? 'moon' : 'sunny'} size={18} color="#2563EB" />
                  <Text style={[styles.settingRowText, { color: theme.textPrimary }]}>
                    Display Theme: {selectedTheme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}
                  </Text>
                </View>
                <Text style={styles.settingChangeLink}>Switch</Text>
              </TouchableOpacity>

              {/* Language Selector Row */}
              <View style={styles.settingLanguageRow}>
                <Text style={[styles.settingSubLabel, { color: theme.textSecondary }]}>
                  App Language ({LANGUAGES.find((l) => l.id === selectedLanguage)?.name || 'English'}):
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.langPillsScroll}>
                  {LANGUAGES.map((l) => (
                    <TouchableOpacity
                      key={l.id}
                      onPress={() => setSelectedLanguage(l.id)}
                      style={[
                        styles.settingLangPill,
                        selectedLanguage === l.id && styles.settingLangPillActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.settingLangPillText,
                          selectedLanguage === l.id && styles.settingLangPillTextActive,
                        ]}
                      >
                        {l.nativeName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Live Geotag Status */}
              <View style={styles.settingGpsStatusBox}>
                <Ionicons name="navigate-circle" size={16} color="#10B981" />
                <Text style={styles.settingGpsText}>
                  GPS Grid: {mockGpsCoordinates || '18.734° N, 73.658° E'} (Calibrated)
                </Text>
              </View>
            </View>

            {/* 4. LOG OUT CARD */}
            <View style={[styles.profileSectionCard, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder, marginBottom: 40 }]}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setShowLogoutModal(true)}
                style={styles.logoutBtn}
              >
                <Ionicons name="log-out" size={18} color="#EF4444" />
                <Text style={styles.logoutBtnText}>Log Out Session</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}

      {/* ========================================================= */}
      {/* 🧭 THREE-LINE HAMBURGER SIDE DRAWER (USER & AUTHORITY) */}
      {/* ========================================================= */}
      <DrawerMenu
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeRole={activeRole}
        onSelectRole={handleSelectRole}
        activeItem={activeMenuItem}
        onSelectItem={handleSelectMenuItem}
      />

      {/* ========================================================= */}
      {/* 📊 BOTTOM NAVIGATION BAR (Home, Weather, Notification, Profile) */}
      {/* ========================================================= */}
      <BottomNavBar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        notificationCount={activeAlerts.length}
      />

      {/* ========================================================= */}
      {/* 📝 MODAL: AUTHORITY FIELD REPORT SUBMISSION */}
      {/* ========================================================= */}
      <Modal visible={showReportModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                📝 Submit Field Report
              </Text>
              <TouchableOpacity onPress={() => setShowReportModal(false)}>
                <Ionicons name="close" size={22} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Report Type Selector */}
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Report Type</Text>
              <View style={styles.typeChipsRow}>
                {['Landslide', 'Road blocked', 'Flood', 'Accident', 'Damaged road', 'Other'].map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setReportType(t)}
                    style={[
                      styles.typeChip,
                      reportType === t && styles.typeChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeChipText,
                        reportType === t && styles.typeChipTextActive,
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Location */}
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Location / Road Section</Text>
              <TextInput
                value={reportLocation}
                onChangeText={setReportLocation}
                placeholder="e.g. NH-6 Km 44, Vadgaon"
                placeholderTextColor="#94A3B8"
                style={[styles.modalInput, { backgroundColor: theme.mode === 'dark' ? '#0F172A' : '#F1F5F9', color: theme.textPrimary }]}
              />

              {/* Description */}
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Incident Description</Text>
              <TextInput
                value={reportDesc}
                onChangeText={setReportDesc}
                placeholder="Describe the roadblock, landslide volume, or severity..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                style={[styles.modalInputArea, { backgroundColor: theme.mode === 'dark' ? '#0F172A' : '#F1F5F9', color: theme.textPrimary }]}
              />

              {/* Photo Simulation */}
              <TouchableOpacity
                onPress={() => setReportHasPhoto(!reportHasPhoto)}
                style={[
                  styles.photoUploadBox,
                  reportHasPhoto && styles.photoUploadBoxActive,
                ]}
              >
                <Ionicons
                  name={reportHasPhoto ? 'checkmark-circle' : 'camera-outline'}
                  size={20}
                  color={reportHasPhoto ? '#10B981' : '#2563EB'}
                />
                <Text style={[styles.photoUploadText, { color: reportHasPhoto ? '#10B981' : theme.textPrimary }]}>
                  {reportHasPhoto ? 'Incident Photo Attached ✓' : 'Attach Photo / Site Image'}
                </Text>
              </TouchableOpacity>

              {/* Submit Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleSubmitFieldReport}
                style={styles.modalSubmitBtn}
              >
                <Text style={styles.modalSubmitBtnText}>Submit Field Report →</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ========================================================= */}
      {/* 🚨 MODAL: AUTHORITY ALERT BROADCASTER */}
      {/* ========================================================= */}
      <Modal visible={showAlertModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: '#EF4444' }]}>
                🚨 Create & Broadcast Alert
              </Text>
              <TouchableOpacity onPress={() => setShowAlertModal(false)}>
                <Ionicons name="close" size={22} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Alert Title */}
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Alert Title</Text>
              <TextInput
                value={newAlertTitle}
                onChangeText={setNewAlertTitle}
                placeholder="e.g. Flash Flood Advisory on Ghat Bypass"
                placeholderTextColor="#94A3B8"
                style={[styles.modalInput, { backgroundColor: theme.mode === 'dark' ? '#0F172A' : '#F1F5F9', color: theme.textPrimary }]}
              />

              {/* Alert Type */}
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Alert Category</Text>
              <View style={styles.typeChipsRow}>
                {['Road blockage', 'Flood warning', 'Landslide warning', 'Accident', 'Emergency'].map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setNewAlertType(t)}
                    style={[
                      styles.typeChip,
                      newAlertType === t && styles.typeChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeChipText,
                        newAlertType === t && styles.typeChipTextActive,
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Severity Selector */}
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Severity Level</Text>
              <View style={styles.severityRow}>
                <TouchableOpacity
                  onPress={() => setNewAlertSeverity('high')}
                  style={[
                    styles.severityBtn,
                    newAlertSeverity === 'high' && { backgroundColor: '#EF4444', borderColor: '#EF4444' },
                  ]}
                >
                  <Text style={[styles.severityBtnText, newAlertSeverity === 'high' && { color: '#FFFFFF' }]}>
                    🔴 High (Red Alert)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setNewAlertSeverity('medium')}
                  style={[
                    styles.severityBtn,
                    newAlertSeverity === 'medium' && { backgroundColor: '#F59E0B', borderColor: '#F59E0B' },
                  ]}
                >
                  <Text style={[styles.severityBtnText, newAlertSeverity === 'medium' && { color: '#FFFFFF' }]}>
                    🟡 Medium (Advisory)
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Location */}
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Target Location Coordinates/Area</Text>
              <TextInput
                value={newAlertLocation}
                onChangeText={setNewAlertLocation}
                placeholder="e.g. Vadgaon - Urse Expressway Junction"
                placeholderTextColor="#94A3B8"
                style={[styles.modalInput, { backgroundColor: theme.mode === 'dark' ? '#0F172A' : '#F1F5F9', color: theme.textPrimary }]}
              />

              {/* Description */}
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Warning Details</Text>
              <TextInput
                value={newAlertDesc}
                onChangeText={setNewAlertDesc}
                placeholder="Specific guidance for drivers and field units..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={2}
                style={[styles.modalInputArea, { backgroundColor: theme.mode === 'dark' ? '#0F172A' : '#F1F5F9', color: theme.textPrimary }]}
              />

              {/* Broadcast Action */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleBroadcastAlert}
                style={[styles.modalSubmitBtn, { backgroundColor: '#EF4444' }]}
              >
                <Text style={styles.modalSubmitBtnText}>Broadcast Alert to All Users 📢</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ========================================================= */}
      {/* 📌 MODAL: ADD SAVED PLACE */}
      {/* ========================================================= */}
      <Modal visible={showAddPlaceModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                Add Saved Place
              </Text>
              <TouchableOpacity onPress={() => setShowAddPlaceModal(false)}>
                <Ionicons name="close" size={22} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Place Label / Title</Text>
            <TextInput
              value={newPlaceTitle}
              onChangeText={setNewPlaceTitle}
              placeholder="e.g. Shillong Fuel Depot"
              placeholderTextColor="#94A3B8"
              style={[styles.modalInput, { backgroundColor: theme.mode === 'dark' ? '#0F172A' : '#F1F5F9', color: theme.textPrimary }]}
            />

            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Full Address / Landmark</Text>
            <TextInput
              value={newPlaceAddress}
              onChangeText={setNewPlaceAddress}
              placeholder="e.g. NH-40, Police Bazaar, Shillong"
              placeholderTextColor="#94A3B8"
              style={[styles.modalInput, { backgroundColor: theme.mode === 'dark' ? '#0F172A' : '#F1F5F9', color: theme.textPrimary }]}
            />

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleAddSavedPlace}
              style={[styles.modalSubmitBtn, { backgroundColor: '#10B981', marginTop: 16 }]}
            >
              <Text style={styles.modalSubmitBtnText}>Save Location ✓</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========================================================= */}
      {/* ✏️ MODAL: EDIT USER PROFILE */}
      {/* ========================================================= */}
      <Modal visible={showEditProfileModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                Edit User Info
              </Text>
              <TouchableOpacity onPress={() => setShowEditProfileModal(false)}>
                <Ionicons name="close" size={22} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Full Name</Text>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Your Name"
              placeholderTextColor="#94A3B8"
              style={[styles.modalInput, { backgroundColor: theme.mode === 'dark' ? '#0F172A' : '#F1F5F9', color: theme.textPrimary }]}
            />

            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Email Address</Text>
            <TextInput
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="name@email.com"
              placeholderTextColor="#94A3B8"
              style={[styles.modalInput, { backgroundColor: theme.mode === 'dark' ? '#0F172A' : '#F1F5F9', color: theme.textPrimary }]}
            />

            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Mobile Number</Text>
            <TextInput
              value={editPhone}
              onChangeText={setEditPhone}
              placeholder="10-digit mobile number"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              style={[styles.modalInput, { backgroundColor: theme.mode === 'dark' ? '#0F172A' : '#F1F5F9', color: theme.textPrimary }]}
            />

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSaveProfile}
              style={[styles.modalSubmitBtn, { marginTop: 16 }]}
            >
              <Text style={styles.modalSubmitBtnText}>Save Profile Changes ✓</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========================================================= */}
      {/* 🚪 MODAL: LOG OUT CONFIRMATION */}
      {/* ========================================================= */}
      <Modal visible={showLogoutModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder, alignItems: 'center' }]}>
            <View style={styles.logoutIconCircle}>
              <Ionicons name="log-out" size={26} color="#EF4444" />
            </View>

            <Text style={[styles.modalTitle, { color: theme.textPrimary, textAlign: 'center', marginBottom: 6 }]}>
              Confirm Log Out
            </Text>
            <Text style={[styles.logoutSubText, { color: theme.textSecondary }]}>
              Are you sure you want to end your active Bharat Netra logistics session?
            </Text>

            <View style={styles.logoutModalBtnsRow}>
              <TouchableOpacity
                onPress={() => setShowLogoutModal(false)}
                style={[styles.cancelBtn, { borderColor: theme.surfaceBorder }]}
              >
                <Text style={[styles.cancelBtnText, { color: theme.textPrimary }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmLogout}
                style={styles.confirmLogoutBtn}
              >
                <Text style={styles.confirmLogoutBtnText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },

  /* Top Navigation & Controls */
  topHeaderContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 28,
    left: 14,
    right: 14,
    zIndex: 100,
  },
  topControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  hamburgerBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 6,
  },
  roleHeaderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    gap: 7,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  roleStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  roleHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerSquareBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 6,
  },

  /* User Route Floating Card */
  floatingRouteCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: '#E2E8F0',
  },
  routeCardLeftCol: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    width: 26,
  },
  blueDotWrapper: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blueDotInner: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#2563EB',
  },
  verticalDottedConnector: {
    height: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  connectorDot: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.5,
    backgroundColor: '#CBD5E1',
  },
  routeCardCenterCol: {
    flex: 1,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  locationInputRow: {
    height: 32,
    justifyContent: 'center',
  },
  locationTextInput: {
    fontSize: 13.5,
    color: '#1E293B',
    fontWeight: '500',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  destinationTextBold: {
    fontWeight: '700',
  },
  routeInnerDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 3,
  },
  routeCardRightCol: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
    width: 30,
  },
  iconActionBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Authority Toolbar */
  authorityToolbarCard: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  authorityToolBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: RADIUS.md,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  authorityToolBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  /* Floating GPS Button */
  floatingGpsBtn: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 90,
  },
  gpsTargetRing: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsTargetDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },

  /* Toast Banner */
  toastBanner: {
    position: 'absolute',
    top: 135,
    left: 20,
    right: 20,
    backgroundColor: '#062B20',
    borderColor: '#10B981',
    borderWidth: 1.5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    zIndex: 150,
  },
  toastBannerText: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },

  /* Weather View Overlay */
  weatherSheetContainer: {
    position: 'absolute',
    top: 140,
    left: 14,
    right: 14,
    zIndex: 95,
  },
  weatherCard: {
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  weatherCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  weatherHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  weatherLocationTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  weatherSub: {
    fontSize: 11,
    fontWeight: '500',
  },
  tempBadge: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.md,
  },
  tempText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  weatherMetricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: SPACING.xs,
  },
  metricBox: {
    flex: 1,
    padding: 8,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '800',
  },
  weatherWarningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    padding: 8,
    borderRadius: RADIUS.md,
    gap: 6,
    marginTop: 8,
  },
  weatherWarningText: {
    fontSize: 11,
    color: '#D97706',
    flex: 1,
    lineHeight: 15,
  },

  /* Notification View Overlay */
  notificationSheetContainer: {
    position: 'absolute',
    top: 140,
    bottom: 74,
    left: 14,
    right: 14,
    zIndex: 95,
  },
  notificationCard: {
    flex: 1,
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  notifHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  notifTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notifMainTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  notifCountBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  notifCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  notifFilterRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: SPACING.sm,
  },
  notifFilterPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
  },
  notifFilterPillActive: {
    backgroundColor: '#2563EB',
  },
  notifFilterText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  notifFilterTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  notifScroll: {
    flex: 1,
  },
  notifItemBox: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.sm + 2,
    marginBottom: 8,
  },
  notifItemTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notifIconTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  notifItemIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifItemTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  notifItemLocation: {
    fontSize: 10.5,
    fontWeight: '500',
  },
  notifItemTime: {
    fontSize: 10,
    fontWeight: '600',
  },
  notifItemDesc: {
    fontSize: 11.5,
    lineHeight: 16,
    marginTop: 2,
    marginBottom: 6,
  },
  viewOnMapBtn: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.md,
  },
  viewOnMapText: {
    color: '#3B82F6',
    fontSize: 10.5,
    fontWeight: '700',
  },

  /* Profile View Overlay */
  profileSheetContainer: {
    position: 'absolute',
    top: 140,
    bottom: 70,
    left: 14,
    right: 14,
    zIndex: 95,
  },
  profileScrollContent: {
    paddingBottom: 20,
  },
  profileSectionCard: {
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  sectionHeaderTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  editProfileText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  userInfoGrid: {
    gap: 8,
  },
  profileFieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileFieldLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  profileFieldValue: {
    fontSize: 13,
    fontWeight: '700',
  },

  /* Saved Places */
  addPlaceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  addPlaceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  savedPlacesList: {
    gap: 8,
  },
  savedPlaceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  savedPlaceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  savedPlaceIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedPlaceTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  savedPlaceAddress: {
    fontSize: 10.5,
  },
  savedPlaceActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routePlaceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.md,
  },
  routePlaceBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  deletePlaceBtn: {
    padding: 4,
  },

  /* Setting */
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.15)',
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingRowText: {
    fontSize: 13,
    fontWeight: '600',
  },
  settingChangeLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  settingLanguageRow: {
    marginTop: 8,
  },
  settingSubLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
  },
  langPillsScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  settingLangPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    marginRight: 6,
  },
  settingLangPillActive: {
    backgroundColor: '#2563EB',
  },
  settingLangPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  settingLangPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  settingGpsStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 8,
    borderRadius: RADIUS.md,
    gap: 6,
    marginTop: 4,
  },
  settingGpsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },

  /* Log Out Button */
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: '#EF4444',
  },
  logoutBtnText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '800',
  },

  /* Modal Generic Styles */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 18, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
    borderRadius: RADIUS.xl * 1.2,
    borderWidth: 1.5,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    marginTop: 8,
  },
  modalInput: {
    height: 42,
    borderRadius: RADIUS.md,
    paddingHorizontal: 10,
    fontSize: 13,
    fontWeight: '500',
  },
  modalInputArea: {
    height: 70,
    borderRadius: RADIUS.md,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    textAlignVertical: 'top',
  },
  typeChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  typeChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
  },
  typeChipActive: {
    backgroundColor: '#2563EB',
  },
  typeChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  typeChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  photoUploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    marginVertical: 12,
    gap: 8,
  },
  photoUploadBoxActive: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  photoUploadText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  modalSubmitBtn: {
    height: 46,
    borderRadius: RADIUS.lg,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  modalSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  /* Severity selector */
  severityRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  severityBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  severityBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
  },

  /* Logout Modal Specific */
  logoutIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoutSubText: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  logoutModalBtnsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  confirmLogoutBtn: {
    flex: 1,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmLogoutBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});

export default LocationRouteScreen;

import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
  LayoutAnimation,
  UIManager,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RADIUS, SPACING } from '../constants/theme';
import { useApp } from '../context/AppContext';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(320, SCREEN_WIDTH * 0.78);

/**
 * DrawerMenu
 * 
 * Sidebar opened via the Three-Line Hamburger Icon.
 * Top displays the User Name.
 * Sidebar contains collapsible sections:
 * - User: Click to expand Safe Route (hidden until clicked)
 * - Authority: Click to expand Live Tracking, Field Report, Alert (hidden until clicked)
 * Transparent / Glassmorphic background with modern deep shadow & glow styling.
 */
export const DrawerMenu = ({
  visible,
  onClose,
  activeRole = 'USER', // 'USER' | 'AUTHORITY'
  onSelectRole,
  activeItem = 'safe_route', // 'safe_route' | 'live_tracking' | 'field_report' | 'alert'
  onSelectItem,
}) => {
  const { theme, userName, userEmail, userProfile } = useApp();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Collapsible section state: 'user' | 'authority' | null
  const [expandedSection, setExpandedSection] = useState(
    activeRole === 'AUTHORITY' ? 'authority' : 'user'
  );

  useEffect(() => {
    if (visible) {
      setExpandedSection(activeRole === 'AUTHORITY' ? 'authority' : 'user');
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, activeRole]);

  if (!visible && slideAnim._value === -DRAWER_WIDTH) {
    return null;
  }

  const displayName = userProfile?.name || userName || 'Logistics Partner';
  const displayEmail = userProfile?.email || userEmail || (displayName ? `${displayName.toLowerCase().replace(/\s+/g, '')}@bharatnetra.gov.in` : 'partner@bharatnetra.gov.in');

  const toggleSection = (sectionKey) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSection((prev) => (prev === sectionKey ? null : sectionKey));
  };

  const handleSelectOption = (role, item) => {
    if (onSelectRole) onSelectRole(role);
    if (onSelectItem) onSelectItem(item);
    if (onClose) onClose();
  };

  const isDark = theme.mode === 'dark';

  return (
    <View style={styles.modalRoot} pointerEvents={visible ? 'auto' : 'none'}>
      {/* Semi-transparent Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>

      {/* Animated Slide-out Drawer Panel with Transparent Glassmorphism & Rich Shadows */}
      <Animated.View
        style={[
          styles.drawerContainer,
          {
            width: DRAWER_WIDTH,
            backgroundColor: isDark
              ? 'rgba(7, 12, 28, 0.92)'
              : 'rgba(255, 255, 255, 0.94)',
            borderRightColor: isDark
              ? 'rgba(56, 189, 248, 0.3)'
              : 'rgba(203, 213, 225, 0.85)',
            transform: [{ translateX: slideAnim }],
            ...(Platform.OS === 'web'
              ? {
                  boxShadow: isDark
                    ? '20px 0 50px -10px rgba(0, 0, 0, 0.8), 3px 0 16px rgba(56, 189, 248, 0.15)'
                    : '18px 0 45px -8px rgba(15, 23, 42, 0.22), 2px 0 12px rgba(0, 0, 0, 0.06)',
                }
              : {}),
          },
        ]}
      >
        {/* ========================================================= */}
        {/* 👤 TOP OF SIDEBAR: USERNAME & PROFILE DISPLAY */}
        {/* ========================================================= */}
        <View
          style={[
            styles.drawerHeader,
            {
              backgroundColor: isDark
                ? 'rgba(15, 23, 42, 0.75)'
                : 'rgba(241, 245, 249, 0.85)',
              borderBottomColor: isDark
                ? 'rgba(255, 255, 255, 0.09)'
                : 'rgba(0, 0, 0, 0.06)',
            },
          ]}
        >
          {/* Top Row: App Logo & Close Button */}
          <View style={styles.headerTopRow}>
            <View style={styles.appBadge}>
              <Ionicons name="shield-checkmark" size={16} color="#10B981" />
              <Text style={[styles.appTitle, { color: theme.textPrimary }]}>
                BHARAT NETRA
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={[
                styles.closeBtn,
                {
                  backgroundColor: isDark
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.05)',
                },
              ]}
            >
              <Ionicons name="close" size={18} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* User Name & Profile Card */}
          <View
            style={[
              styles.userCard,
              {
                backgroundColor: isDark
                  ? 'rgba(30, 41, 59, 0.55)'
                  : 'rgba(255, 255, 255, 0.8)',
                borderColor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(226, 232, 240, 0.9)',
              },
            ]}
          >
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={[styles.userInfo, { flex: 1 }]}>
              <Text style={[styles.userNameText, { color: theme.textPrimary }]} numberOfLines={1}>
                {displayName}
              </Text>
              <Text style={{ fontSize: 11, color: isDark ? '#94A3B8' : '#64748B', marginBottom: 4 }} numberOfLines={1}>
                ✉️ {displayEmail}
              </Text>
              <View style={styles.activeRoleChip}>
                <View style={styles.onlineDot} />
                <Text style={styles.activeRoleText}>
                  Verified • Live Routing
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ========================================================= */}
        {/* 📋 SIDEBAR COLLAPSIBLE OPTIONS (USER & AUTHORITY) */}
        {/* ========================================================= */}
        <ScrollView
          style={styles.menuScrollView}
          contentContainerStyle={styles.menuBody}
          showsVerticalScrollIndicator={false}
        >
          {/* ---------------------------------------------------- */}
          {/* 1. USER OPTION (Click to expand/collapse Safe Route) */}
          {/* ---------------------------------------------------- */}
          <View style={styles.accordionGroup}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => toggleSection('user')}
              style={[
                styles.accordionHeaderBtn,
                {
                  backgroundColor:
                    expandedSection === 'user'
                      ? (isDark ? 'rgba(37, 99, 235, 0.22)' : 'rgba(37, 99, 235, 0.12)')
                      : (isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(241, 245, 249, 0.75)'),
                  borderColor:
                    expandedSection === 'user'
                      ? '#2563EB'
                      : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'),
                },
              ]}
            >
              <View style={styles.headerBtnLeft}>
                <View style={[styles.roleIconBadge, { backgroundColor: '#2563EB' }]}>
                  <Ionicons name="person" size={15} color="#FFFFFF" />
                </View>
                <Text style={[styles.roleHeaderText, { color: theme.textPrimary }]}>
                  User
                </Text>
              </View>

              <Ionicons
                name={expandedSection === 'user' ? 'chevron-down' : 'chevron-forward'}
                size={18}
                color={expandedSection === 'user' ? '#2563EB' : theme.textSecondary}
              />
            </TouchableOpacity>

            {/* Sub-option under User: Safe Route (Hidden until user is clicked) */}
            {expandedSection === 'user' && (
              <View style={styles.subItemsContainer}>
                <View style={styles.treeLine} />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleSelectOption('USER', 'safe_route')}
                  style={[
                    styles.submenuCard,
                    activeRole === 'USER' && activeItem === 'safe_route'
                      ? {
                          backgroundColor: isDark
                            ? 'rgba(37, 99, 235, 0.25)'
                            : '#EFF6FF',
                          borderColor: '#2563EB',
                        }
                      : {
                          backgroundColor: isDark
                            ? 'rgba(15, 23, 42, 0.45)'
                            : 'rgba(255, 255, 255, 0.65)',
                        },
                  ]}
                >
                  <View style={[styles.submenuIconBox, { backgroundColor: '#2563EB' }]}>
                    <Ionicons name="navigate" size={16} color="#FFFFFF" />
                  </View>
                  <View style={styles.submenuTextCol}>
                    <Text
                      style={[
                        styles.submenuTitle,
                        {
                          color:
                            activeRole === 'USER' && activeItem === 'safe_route'
                              ? '#2563EB'
                              : theme.textPrimary,
                        },
                      ]}
                    >
                      Safe Route
                    </Text>
                    <Text style={[styles.submenuDesc, { color: theme.textSecondary }]}>
                      Hazard-aware corridor navigation
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={15}
                    color={
                      activeRole === 'USER' && activeItem === 'safe_route'
                        ? '#2563EB'
                        : theme.textMuted
                    }
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* ---------------------------------------------------- */}
          {/* 2. AUTHORITY OPTION (Click to expand/collapse 3 options) */}
          {/* ---------------------------------------------------- */}
          <View style={styles.accordionGroup}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => toggleSection('authority')}
              style={[
                styles.accordionHeaderBtn,
                {
                  backgroundColor:
                    expandedSection === 'authority'
                      ? (isDark ? 'rgba(245, 158, 11, 0.22)' : 'rgba(245, 158, 11, 0.12)')
                      : (isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(241, 245, 249, 0.75)'),
                  borderColor:
                    expandedSection === 'authority'
                      ? '#F59E0B'
                      : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'),
                },
              ]}
            >
              <View style={styles.headerBtnLeft}>
                <View style={[styles.roleIconBadge, { backgroundColor: '#F59E0B' }]}>
                  <Ionicons name="shield" size={15} color="#FFFFFF" />
                </View>
                <Text style={[styles.roleHeaderText, { color: theme.textPrimary }]}>
                  Authority
                </Text>
              </View>

              <Ionicons
                name={expandedSection === 'authority' ? 'chevron-down' : 'chevron-forward'}
                size={18}
                color={expandedSection === 'authority' ? '#F59E0B' : theme.textSecondary}
              />
            </TouchableOpacity>

            {/* Sub-options under Authority: Live Tracking, Field Report, Alert (Hidden until Authority is clicked) */}
            {expandedSection === 'authority' && (
              <View style={styles.subItemsContainer}>
                <View style={[styles.treeLine, { backgroundColor: 'rgba(245, 158, 11, 0.35)' }]} />

                {/* 1. Live Tracking */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleSelectOption('AUTHORITY', 'live_tracking')}
                  style={[
                    styles.submenuCard,
                    activeRole === 'AUTHORITY' && activeItem === 'live_tracking'
                      ? {
                          backgroundColor: isDark
                            ? 'rgba(2, 132, 199, 0.25)'
                            : '#F0F9FF',
                          borderColor: '#0284C7',
                        }
                      : {
                          backgroundColor: isDark
                            ? 'rgba(15, 23, 42, 0.45)'
                            : 'rgba(255, 255, 255, 0.65)',
                        },
                  ]}
                >
                  <View style={[styles.submenuIconBox, { backgroundColor: '#0284C7' }]}>
                    <MaterialCommunityIcons name="radar" size={17} color="#FFFFFF" />
                  </View>
                  <View style={styles.submenuTextCol}>
                    <Text
                      style={[
                        styles.submenuTitle,
                        {
                          color:
                            activeRole === 'AUTHORITY' && activeItem === 'live_tracking'
                              ? '#0284C7'
                              : theme.textPrimary,
                        },
                      ]}
                    >
                      Live Tracking
                    </Text>
                    <Text style={[styles.submenuDesc, { color: theme.textSecondary }]}>
                      Field units & patrol radar
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={15}
                    color={
                      activeRole === 'AUTHORITY' && activeItem === 'live_tracking'
                        ? '#0284C7'
                        : theme.textMuted
                    }
                  />
                </TouchableOpacity>

                {/* 2. Field Report */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleSelectOption('AUTHORITY', 'field_report')}
                  style={[
                    styles.submenuCard,
                    activeRole === 'AUTHORITY' && activeItem === 'field_report'
                      ? {
                          backgroundColor: isDark
                            ? 'rgba(16, 185, 129, 0.25)'
                            : '#ECFDF5',
                          borderColor: '#10B981',
                        }
                      : {
                          backgroundColor: isDark
                            ? 'rgba(15, 23, 42, 0.45)'
                            : 'rgba(255, 255, 255, 0.65)',
                        },
                  ]}
                >
                  <View style={[styles.submenuIconBox, { backgroundColor: '#10B981' }]}>
                    <Ionicons name="document-text" size={16} color="#FFFFFF" />
                  </View>
                  <View style={styles.submenuTextCol}>
                    <Text
                      style={[
                        styles.submenuTitle,
                        {
                          color:
                            activeRole === 'AUTHORITY' && activeItem === 'field_report'
                              ? '#10B981'
                              : theme.textPrimary,
                        },
                      ]}
                    >
                      Field Report
                    </Text>
                    <Text style={[styles.submenuDesc, { color: theme.textSecondary }]}>
                      Road blockage, landslides, floods
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={15}
                    color={
                      activeRole === 'AUTHORITY' && activeItem === 'field_report'
                        ? '#10B981'
                        : theme.textMuted
                    }
                  />
                </TouchableOpacity>

                {/* 3. Alert */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleSelectOption('AUTHORITY', 'alert')}
                  style={[
                    styles.submenuCard,
                    activeRole === 'AUTHORITY' && activeItem === 'alert'
                      ? {
                          backgroundColor: isDark
                            ? 'rgba(239, 68, 68, 0.25)'
                            : '#FEF2F2',
                          borderColor: '#EF4444',
                        }
                      : {
                          backgroundColor: isDark
                            ? 'rgba(15, 23, 42, 0.45)'
                            : 'rgba(255, 255, 255, 0.65)',
                        },
                  ]}
                >
                  <View style={[styles.submenuIconBox, { backgroundColor: '#EF4444' }]}>
                    <Ionicons name="megaphone" size={16} color="#FFFFFF" />
                  </View>
                  <View style={styles.submenuTextCol}>
                    <Text
                      style={[
                        styles.submenuTitle,
                        {
                          color:
                            activeRole === 'AUTHORITY' && activeItem === 'alert'
                              ? '#EF4444'
                              : theme.textPrimary,
                        },
                      ]}
                    >
                      Alert
                    </Text>
                    <Text style={[styles.submenuDesc, { color: theme.textSecondary }]}>
                      Broadcast road warnings & closures
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={15}
                    color={
                      activeRole === 'AUTHORITY' && activeItem === 'alert'
                        ? '#EF4444'
                        : theme.textMuted
                    }
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 18, 0.6)',
  },
  drawerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderRightWidth: 1.5,
    shadowColor: '#000000',
    shadowOffset: { width: 8, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 25,
    justifyContent: 'flex-start',
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        }
      : {}),
  },
  drawerHeader: {
    paddingTop: Platform.OS === 'ios' ? 50 : 38,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  appBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  appTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: 12,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#38BDF8',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  userInfo: {
    flex: 1,
  },
  userNameText: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  activeRoleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  activeRoleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
  },

  menuScrollView: {
    flex: 1,
  },
  menuBody: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    gap: SPACING.md,
  },

  accordionGroup: {
    width: '100%',
  },
  accordionHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 13,
    borderRadius: RADIUS.lg,
    borderWidth: 1.2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  headerBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  roleIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleHeaderText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  subItemsContainer: {
    paddingLeft: 14,
    paddingTop: 8,
    position: 'relative',
    gap: 8,
  },
  treeLine: {
    position: 'absolute',
    left: 6,
    top: 10,
    bottom: 20,
    width: 2,
    backgroundColor: 'rgba(37, 99, 235, 0.35)',
    borderRadius: 1,
  },
  submenuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 11,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  submenuIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submenuTextCol: {
    flex: 1,
  },
  submenuTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  submenuDesc: {
    fontSize: 10.5,
    fontWeight: '500',
  },
});

export default DrawerMenu;

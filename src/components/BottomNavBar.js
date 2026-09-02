import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RADIUS, SPACING } from '../constants/theme';
import { useApp } from '../context/AppContext';

/**
 * BottomNavBar
 * 
 * 4 Tabs as per reference:
 * 1. Home
 * 2. Weather
 * 3. Notification
 * 4. Profile
 */
export const BottomNavBar = ({
  activeTab = 'home', // 'home' | 'weather' | 'notification' | 'profile'
  onSelectTab,
  notificationCount = 3,
}) => {
  const { theme } = useApp();

  const tabs = [
    {
      id: 'home',
      label: 'Home',
      iconActive: 'map',
      iconInactive: 'map-outline',
    },
    {
      id: 'weather',
      label: 'Weather',
      iconActive: 'partly-sunny',
      iconInactive: 'partly-sunny-outline',
    },
    {
      id: 'notification',
      label: 'Notification',
      iconActive: 'notifications',
      iconInactive: 'notifications-outline',
      badge: notificationCount,
    },
    {
      id: 'profile',
      label: 'Profile',
      iconActive: 'person',
      iconInactive: 'person-outline',
    },
  ];

  return (
    <View
      style={[
        styles.bottomNavContainer,
        {
          backgroundColor: theme.mode === 'dark' ? 'rgba(10, 16, 28, 0.94)' : 'rgba(255, 255, 255, 0.95)',
          borderTopColor: theme.surfaceBorder,
        },
      ]}
    >
      <View style={styles.tabsRow}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.8}
              onPress={() => onSelectTab && onSelectTab(tab.id)}
              style={[
                styles.tabBtn,
                isActive && {
                  backgroundColor:
                    theme.mode === 'dark'
                      ? 'rgba(37, 99, 235, 0.18)'
                      : 'rgba(37, 99, 235, 0.1)',
                },
              ]}
            >
              <View style={styles.iconWrapper}>
                <Ionicons
                  name={isActive ? tab.iconActive : tab.iconInactive}
                  size={21}
                  color={isActive ? '#2563EB' : theme.textSecondary}
                />
                {tab.badge && tab.badge > 0 ? (
                  <View style={styles.badgePill}>
                    <Text style={styles.badgeText}>{tab.badge}</Text>
                  </View>
                ) : null}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? '#2563EB' : theme.textSecondary,
                    fontWeight: isActive ? '800' : '600',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    borderTopWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 16,
    zIndex: 100,
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }
      : {}),
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: RADIUS.lg,
    marginHorizontal: 3,
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: 3,
  },
  tabLabel: {
    fontSize: 11,
    letterSpacing: 0.2,
  },
  badgePill: {
    position: 'absolute',
    top: -3,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: RADIUS.full,
    paddingHorizontal: 4,
    height: 14,
    minWidth: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});

export default BottomNavBar;

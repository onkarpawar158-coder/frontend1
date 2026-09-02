import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { RADIUS, SPACING } from '../constants/theme';

export const VehicleCard = ({ vehicle, isSelected, onSelect, style }) => {
  const { theme } = useApp();

  const renderIcon = () => {
    const size = 30;
    const color = isSelected ? '#FFFFFF' : theme.primaryLight;

    if (vehicle.iconType === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons name={vehicle.iconName} size={size} color={color} />;
    } else if (vehicle.iconType === 'FontAwesome5') {
      return <FontAwesome5 name={vehicle.iconName} size={size} color={color} />;
    }
    return <Ionicons name={vehicle.iconName || 'car-sport-outline'} size={size} color={color} />;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onSelect(vehicle)}
      style={[
        styles.card,
        {
          backgroundColor: isSelected ? theme.cardBgSelected : theme.surface,
          borderColor: isSelected ? theme.cardBorderSelected : theme.surfaceBorder,
        },
        isSelected && {
          shadowColor: theme.cardSelectedGlow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 4,
        },
        style,
      ]}
    >
      <View style={styles.headerRow}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: isSelected
                ? theme.primary
                : theme.mode === 'dark'
                ? '#1A2640'
                : '#F1F5F9',
            },
          ]}
        >
          {renderIcon()}
        </View>

        <View style={styles.headerRight}>
          {vehicle.badge && (
            <View
              style={[
                styles.badgeContainer,
                {
                  backgroundColor: isSelected
                    ? 'rgba(37, 99, 235, 0.25)'
                    : theme.mode === 'dark'
                    ? '#1E293B'
                    : '#E2E8F0',
                  borderColor: isSelected ? theme.primaryLight : theme.surfaceBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  {
                    color: isSelected ? theme.primaryLight : theme.textMuted,
                  },
                ]}
              >
                {vehicle.badge}
              </Text>
            </View>
          )}

          <View
            style={[
              styles.checkCircle,
              {
                borderColor: isSelected ? theme.primary : theme.surfaceBorder,
                backgroundColor: isSelected ? theme.primary : 'transparent',
              },
            ]}
          >
            {isSelected && (
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            )}
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <Text
          style={[
            styles.name,
            {
              color: isSelected ? theme.primaryLight : theme.textPrimary,
            },
          ]}
        >
          {vehicle.name} {vehicle.emoji}
        </Text>
        <Text style={[styles.subtext, { color: theme.textSecondary }]}>
          {vehicle.subtext || vehicle.category}
        </Text>
      </View>

      <View
        style={[
          styles.footerRow,
          {
            borderTopColor: isSelected
              ? 'rgba(59, 130, 246, 0.2)'
              : theme.surfaceBorder,
          },
        ]}
      >
        <View style={styles.specItem}>
          <Ionicons name="speedometer-outline" size={13} color={theme.textMuted} />
          <Text style={[styles.specText, { color: theme.textMuted }]}>
            {vehicle.speed || 'Standard'}
          </Text>
        </View>

        <View style={styles.specItem}>
          <Ionicons name="shield-checkmark-outline" size={13} color={theme.accent} />
          <Text style={[styles.specText, { color: theme.accent }]}>
            NER Calibrated
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    padding: SPACING.md + 2,
    marginBottom: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  badgeContainer: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    marginBottom: SPACING.sm,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtext: {
    fontSize: 13,
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: SPACING.sm,
    marginTop: SPACING.xs,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  specText: {
    fontSize: 11,
    fontWeight: '600',
  },
});

export default VehicleCard;

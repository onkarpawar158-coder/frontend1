import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { RADIUS, SPACING } from '../constants/theme';

export const PrimaryButton = ({
  title,
  onPress,
  icon,
  iconRight,
  disabled = false,
  loading = false,
  style,
  textStyle,
  variant = 'primary', // 'primary' | 'success' | 'accent'
}) => {
  const { theme } = useApp();

  let backgroundColor = theme.primary;
  let shadowColor = theme.primaryGlow;

  if (variant === 'success') {
    backgroundColor = theme.success;
    shadowColor = theme.successBg;
  } else if (variant === 'accent') {
    backgroundColor = theme.accent;
    shadowColor = theme.accentGlow;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: disabled ? (theme.mode === 'dark' ? '#1E293B' : '#E2E8F0') : backgroundColor,
          shadowColor: disabled ? 'transparent' : shadowColor,
        },
        disabled && styles.disabledButton,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <View style={styles.contentRow}>
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color={disabled ? theme.textMuted : '#FFFFFF'}
              style={styles.iconLeft}
            />
          )}
          <Text
            style={[
              styles.text,
              {
                color: disabled ? theme.textMuted : '#FFFFFF',
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {iconRight && (
            <Ionicons
              name={iconRight}
              size={20}
              color={disabled ? theme.textMuted : '#FFFFFF'}
              style={styles.iconRight}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  disabledButton: {
    elevation: 0,
    shadowOpacity: 0,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  iconLeft: {
    marginRight: SPACING.sm,
  },
  iconRight: {
    marginLeft: SPACING.sm,
  },
});

export default PrimaryButton;

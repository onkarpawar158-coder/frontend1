import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { RADIUS, SPACING } from '../constants/theme';

export const SecondaryButton = ({
  title,
  onPress,
  icon,
  iconRight,
  disabled = false,
  style,
  textStyle,
  variant = 'outline', // 'outline' | 'ghost'
}) => {
  const { theme } = useApp();

  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        isOutline && {
          borderWidth: 1.5,
          borderColor: theme.surfaceBorder,
          backgroundColor: theme.mode === 'dark' ? 'rgba(30, 41, 59, 0.4)' : 'rgba(241, 245, 249, 0.7)',
        },
        style,
      ]}
    >
      <View style={styles.contentRow}>
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={theme.primaryLight}
            style={styles.iconLeft}
          />
        )}
        <Text
          style={[
            styles.text,
            {
              color: theme.mode === 'dark' ? theme.textPrimary : theme.textPrimary,
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
        {iconRight && (
          <Ionicons
            name={iconRight}
            size={18}
            color={theme.primaryLight}
            style={styles.iconRight}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
  },
  iconLeft: {
    marginRight: SPACING.sm,
  },
  iconRight: {
    marginLeft: SPACING.sm,
  },
});

export default SecondaryButton;

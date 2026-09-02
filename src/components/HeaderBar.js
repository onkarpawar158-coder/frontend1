import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { BackButton } from './BackButton';
import { ThemeToggle } from './ThemeToggle';
import { useApp } from '../context/AppContext';
import { SPACING } from '../constants/theme';

export const HeaderBar = ({
  showBack = true,
  onBackPress,
  title,
  subtitle,
  showThemeToggle = true,
  rightElement,
  style,
}) => {
  const { theme } = useApp();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftContainer}>
        {showBack ? (
          <BackButton onPress={onBackPress} />
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      <View style={styles.centerContainer}>
        {title && (
          <Text
            numberOfLines={1}
            style={[styles.title, { color: theme.textPrimary }]}
          >
            {title}
          </Text>
        )}
        {subtitle && (
          <Text
            numberOfLines={1}
            style={[styles.subtitle, { color: theme.textSecondary }]}
          >
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.rightContainer}>
        {rightElement ? (
          rightElement
        ) : showThemeToggle ? (
          <ThemeToggle />
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    minHeight: 56,
  },
  leftContainer: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xs,
  },
  rightContainer: {
    width: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  placeholder: {
    width: 42,
    height: 42,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
});

export default HeaderBar;

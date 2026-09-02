import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { RADIUS, SPACING } from '../constants/theme';

export const LanguageCard = ({ language, isSelected, onSelect }) => {
  const { theme } = useApp();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onSelect(language.id)}
      style={[
        styles.card,
        {
          backgroundColor: isSelected
            ? theme.cardBgSelected
            : theme.surface,
          borderColor: isSelected
            ? theme.cardBorderSelected
            : theme.surfaceBorder,
        },
        isSelected && {
          shadowColor: theme.cardSelectedGlow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 4,
        },
      ]}
    >
      <View style={styles.contentRow}>
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: isSelected
                ? theme.primary
                : theme.mode === 'dark'
                ? '#1E293B'
                : '#F1F5F9',
            },
          ]}
        >
          <Ionicons
            name={language.icon || 'language-outline'}
            size={22}
            color={isSelected ? '#FFFFFF' : theme.textSecondary}
          />
        </View>

        <View style={styles.textContainer}>
          <Text
            style={[
              styles.nativeName,
              {
                color: isSelected ? theme.primaryLight : theme.textPrimary,
              },
            ]}
          >
            {language.nativeName}
          </Text>
          <Text
            style={[
              styles.name,
              {
                color: theme.textSecondary,
              },
            ]}
          >
            {language.name} • {language.region}
          </Text>
        </View>

        <View
          style={[
            styles.checkCircle,
            {
              borderColor: isSelected
                ? theme.primary
                : theme.surfaceBorder,
              backgroundColor: isSelected
                ? theme.primary
                : 'transparent',
            },
          ]}
        >
          {isSelected && (
            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    padding: SPACING.md + 2,
    marginBottom: SPACING.md,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  textContainer: {
    flex: 1,
  },
  nativeName: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  name: {
    fontSize: 12,
    fontWeight: '500',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
});

export default LanguageCard;

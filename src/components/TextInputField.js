import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { RADIUS, SPACING } from '../constants/theme';

export const TextInputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  prefix,
  icon,
  keyboardType = 'default',
  maxLength,
  error,
  autoCapitalize = 'none',
  editable = true,
  rightElement,
  style,
  inputStyle,
}) => {
  const { theme } = useApp();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.inputBg,
            borderColor: error
              ? theme.error
              : isFocused
              ? theme.inputFocusBorder
              : theme.inputBorder,
          },
          isFocused && {
            shadowColor: theme.primaryGlow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 3,
          },
        ]}
      >
        {prefix ? (
          <View
            style={[
              styles.prefixContainer,
              {
                borderRightColor: theme.surfaceBorder,
                backgroundColor: theme.mode === 'dark' ? '#131D31' : '#F1F5F9',
              },
            ]}
          >
            <Text style={[styles.prefixText, { color: theme.textPrimary }]}>
              {prefix}
            </Text>
          </View>
        ) : icon ? (
          <Ionicons
            name={icon}
            size={20}
            color={isFocused ? theme.primaryLight : theme.textMuted}
            style={styles.iconLeft}
          />
        ) : null}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textMuted}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            {
              color: theme.textPrimary,
            },
            inputStyle,
          ]}
        />

        {rightElement}
      </View>

      {error ? (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={14} color={theme.error} />
          <Text style={[styles.errorText, { color: theme.error }]}>
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: SPACING.xs + 2,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  prefixContainer: {
    height: '100%',
    paddingHorizontal: SPACING.md + 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1.5,
  },
  prefixText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  iconLeft: {
    marginLeft: SPACING.md,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: SPACING.md,
    fontSize: 16,
    fontWeight: '500',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
    gap: 4,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default TextInputField;

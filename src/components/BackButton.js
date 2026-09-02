import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { RADIUS } from '../constants/theme';

export const BackButton = ({ onPress, style }) => {
  const navigation = useNavigation();
  const { theme } = useApp();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (navigation && navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={[
        styles.button,
        {
          backgroundColor: theme.mode === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(241, 245, 249, 0.9)',
          borderColor: theme.surfaceBorder,
        },
        style,
      ]}
    >
      <Ionicons
        name="chevron-back"
        size={22}
        color={theme.textPrimary}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});

export default BackButton;

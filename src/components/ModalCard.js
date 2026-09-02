import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { PrimaryButton } from './PrimaryButton';
import { RADIUS, SPACING } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ModalCard = ({
  visible,
  onClose,
  title,
  subtitle,
  children,
  buttonTitle,
  onButtonPress,
}) => {
  const { theme } = useApp();

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View
            style={[
              styles.backdrop,
              { backgroundColor: theme.overlay },
            ]}
          />
        </TouchableWithoutFeedback>

        <View
          style={[
            styles.cardContainer,
            {
              backgroundColor: theme.surface,
              borderColor: theme.surfaceBorder,
              shadowColor: theme.primaryGlow,
            },
          ]}
        >
          {/* Success Check Badge */}
          <View
            style={[
              styles.badgeContainer,
              {
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                borderColor: '#10B981',
              },
            ]}
          >
            <View style={styles.badgeInner}>
              <Ionicons name="checkmark-sharp" size={32} color="#10B981" />
            </View>
          </View>

          {title && (
            <Text
              style={[
                styles.title,
                { color: theme.textPrimary },
              ]}
            >
              {title}
            </Text>
          )}

          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                { color: theme.textSecondary },
              ]}
            >
              {subtitle}
            </Text>
          )}

          <View style={styles.bodyContent}>{children}</View>

          {buttonTitle && (
            <PrimaryButton
              title={buttonTitle}
              onPress={onButtonPress}
              iconRight="arrow-forward"
              style={styles.actionBtn}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  cardContainer: {
    width: Math.min(SCREEN_WIDTH - 40, 420),
    borderRadius: RADIUS.xl * 1.2,
    borderWidth: 1.5,
    padding: SPACING.xl,
    alignItems: 'center',
    elevation: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  badgeContainer: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  badgeInner: {
    width: 54,
    height: 54,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: SPACING.xs,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  bodyContent: {
    width: '100%',
    marginBottom: SPACING.lg,
  },
  actionBtn: {
    width: '100%',
  },
});

export default ModalCard;

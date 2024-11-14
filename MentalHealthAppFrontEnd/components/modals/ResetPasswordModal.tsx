// components/ResetPasswordModal.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { resetPassword } from '@/api/auth';
import { useThemeContext } from '../ThemeContext';
import { colors } from '../../app/theme/colors';

interface ResetPasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onPasswordReset?: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ visible, onClose, onPasswordReset }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useThemeContext();
  const styles = createStyles(theme);

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      await resetPassword(email);
      Alert.alert('Success', 'Password reset email sent. Please check your inbox.');
      setEmail('');
      onPasswordReset?.();
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Reset Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={theme === 'dark' ? colors.dark.textTertiary : colors.light.textTertiary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {loading ? (
            <ActivityIndicator size="large" color={theme === 'dark' ? colors.dark.primary : colors.light.primary} />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
              <Text style={styles.buttonText}>Send Reset Link</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (theme: string) => {
  const isDark = theme === 'dark';
  const themeColors = isDark ? colors.dark : colors.light;

  return StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: 20,
    },
    modalContent: {
      backgroundColor: themeColors.surface,
      borderRadius: 8,
      padding: 20,
      width: '100%',
      maxWidth: 400,
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: themeColors.text,
    },
    input: {
      width: '100%',
      height: 50,
      borderWidth: 1,
      borderColor: themeColors.border,
      borderRadius: 8,
      paddingHorizontal: 15,
      marginBottom: 20,
      fontSize: 16,
      backgroundColor: themeColors.background,
      color: themeColors.text,
    },
    button: {
      backgroundColor: themeColors.primary,
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 8,
      marginBottom: 10,
      width: '100%',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    closeButton: {
      backgroundColor: 'transparent',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: themeColors.primary,
      width: '100%',
    },
    closeButtonText: {
      color: themeColors.primary,
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
  });
};

export default ResetPasswordModal;

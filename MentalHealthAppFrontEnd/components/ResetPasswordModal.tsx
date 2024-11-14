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
import { useThemeContext } from './ThemeContext';
import { colors } from '../app/theme/colors';

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
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '80%',
      padding: 20,
      backgroundColor: themeColors.surface,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
      color: themeColors.text,
    },
    input: {
      height: 40,
      borderColor: themeColors.border,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 16,
      backgroundColor: themeColors.background,
      color: themeColors.text,
    },
    button: {
      backgroundColor: themeColors.primary,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    closeButton: {
      marginTop: 10,
      alignItems: 'center',
    },
    closeButtonText: {
      color: themeColors.primary,
      fontSize: 14,
    },
  });
};

export default ResetPasswordModal;

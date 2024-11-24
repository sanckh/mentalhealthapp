// ChangeDisplayNameModal.js
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { updateDisplayName } from '@/api/user';
import { useThemeContext } from '../ThemeContext';
import { colors } from '../../app/theme/colors';

interface Props {
  visible: boolean;
  onClose: () => void;
  currentDisplayName: string | undefined;
  userId: string;
}

const ChangeDisplayNameModal: React.FC<Props> = ({ visible, onClose, currentDisplayName, userId }) => {
  const [newDisplayName, setNewDisplayName] = useState(currentDisplayName || '');
  const [loading, setLoading] = useState(false);
  const { theme } = useThemeContext();
  const styles = createStyles(theme);

  const handleSave = async () => {
    if (!newDisplayName.trim()) {
      Alert.alert('Validation Error', 'Display name cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      await updateDisplayName(newDisplayName, userId);
      Alert.alert('Success', 'Display name updated successfully! Please sign out and sign back in to see the changes.');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update display name.');
      console.error('Error updating display name:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Change Display Name</Text>

          <TextInput
            style={styles.input}
            value={newDisplayName}
            onChangeText={setNewDisplayName}
            placeholder="Enter new display name"
            placeholderTextColor={theme === 'dark' ? colors.dark.textTertiary : colors.light.textTertiary}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Save</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (theme: string) => {
  const isDark = theme === 'dark';
  const themeColors = isDark ? colors.dark : colors.light;

  return StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: themeColors.surface,
      borderRadius: 8,
      padding: 20,
      width: '90%',
      maxWidth: 400,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: themeColors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: themeColors.border,
      borderRadius: 8,
      padding: 12,
      marginBottom: 20,
      fontSize: 16,
      backgroundColor: themeColors.background,
      color: themeColors.text,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
    },
    button: {
      backgroundColor: themeColors.primary,
      padding: 12,
      borderRadius: 8,
      flex: 1,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    cancelButton: {
      backgroundColor: 'transparent',
      padding: 12,
      borderRadius: 8,
      flex: 1,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: themeColors.primary,
    },
    cancelButtonText: {
      color: themeColors.primary,
      fontSize: 16,
      fontWeight: '600',
    },
  });
};

export default ChangeDisplayNameModal;

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
import { useThemeContext } from './ThemeContext';
import { colors } from '../app/theme/colors';

interface Props {
  visible: boolean;
  onClose: () => void;
  currentDisplayName: string;
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
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      padding: 20,
      backgroundColor: themeColors.surface,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
      textAlign: 'center',
      color: themeColors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: themeColors.border,
      borderRadius: 5,
      padding: 10,
      marginBottom: 20,
      backgroundColor: themeColors.background,
      color: themeColors.text,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      flex: 1,
      marginRight: 5,
      backgroundColor: themeColors.primary,
      padding: 12,
      borderRadius: 5,
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    cancelButton: {
      flex: 1,
      marginLeft: 5,
      backgroundColor: themeColors.surfaceVariant,
      padding: 12,
      borderRadius: 5,
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    cancelButtonText: {
      color: themeColors.text,
      fontWeight: 'bold',
    },
  });
};

export default ChangeDisplayNameModal;

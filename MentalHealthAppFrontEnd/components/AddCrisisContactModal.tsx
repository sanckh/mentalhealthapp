import React, { useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { saveUserContact } from '../api/userContacts';
import { useThemeContext } from './ThemeContext';
import { colors } from '../app/theme/colors';

interface Props {
  visible: boolean;
  onClose: () => void;
  userId: string;
}

const AddCrisisContactModal: React.FC<Props> = ({ visible, onClose, userId }) => {
  const [contactName, setContactName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberType, setPhoneNumberType] = useState('home');
  const [error, setError] = useState<string | null>(null);
  const { theme } = useThemeContext();
  const styles = createStyles(theme);

  // Dropdown state
  const [openPicker, setOpenPicker] = useState(false);
  const [items, setItems] = useState([
    { label: 'Home', value: 'home' },
    { label: 'Mobile', value: 'mobile' },
    { label: 'Work', value: 'work' },
    { label: 'Other', value: 'other' },
  ]);

  // Close keyboard when dropdown opens
  const onPickerOpen = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const handleSubmit = async () => {
    if (!contactName) {
      setError('Please enter a contact name.');
      return;
    }
    if (!phoneNumber) {
      setError('Please enter a phone number.');
      return;
    }

    try {
      await saveUserContact(userId, contactName, phoneNumber, phoneNumberType);
      onClose();
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.touchableArea} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContainer}>
          <Text style={styles.title}>Add Crisis Contact</Text>

          <TextInput
            value={contactName}
            onChangeText={setContactName}
            placeholder="Contact Name"
            placeholderTextColor={theme === 'dark' ? colors.dark.textTertiary : colors.light.textTertiary}
            style={styles.input}
          />

          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Phone Number"
            placeholderTextColor={theme === 'dark' ? colors.dark.textTertiary : colors.light.textTertiary}
            keyboardType="phone-pad"
            style={styles.input}
          />

          <View style={styles.dropdownContainer}>
            <DropDownPicker
              open={openPicker}
              value={phoneNumberType}
              items={items}
              setOpen={setOpenPicker}
              setValue={setPhoneNumberType}
              setItems={setItems}
              onOpen={onPickerOpen}
              style={styles.dropdown}
              placeholder="Select Phone Number Type"
              theme={theme === 'dark' ? 'DARK' : 'LIGHT'}
              placeholderStyle={{
                color: theme === 'dark' ? colors.dark.textTertiary : colors.light.textTertiary,
              }}
              textStyle={{
                color: theme === 'dark' ? colors.dark.text : colors.light.text,
              }}
              zIndex={5000}
              zIndexInverse={6000}
            />
          </View>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
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
    touchableArea: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    modalContainer: {
      backgroundColor: themeColors.surface,
      borderRadius: 8,
      padding: 20,
      width: '90%',
      zIndex: 10000,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      fontSize: 22,
      marginBottom: 20,
      fontWeight: '600',
      textAlign: 'center',
      color: themeColors.text,
    },
    input: {
      width: '100%',
      height: 50,
      borderColor: themeColors.border,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 15,
      marginBottom: 15,
      fontSize: 16,
      backgroundColor: themeColors.background,
      color: themeColors.text,
    },
    dropdownContainer: {
      zIndex: 5000,
      marginBottom: 15,
    },
    dropdown: {
      borderColor: themeColors.border,
      borderRadius: 8,
      backgroundColor: themeColors.background,
    },
    errorText: {
      color: themeColors.error,
      marginBottom: 15,
      alignSelf: 'flex-start',
    },
    buttonContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    button: {
      backgroundColor: themeColors.primary,
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 8,
      flex: 1,
      marginHorizontal: 5,
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    cancelButton: {
      backgroundColor: themeColors.surfaceVariant,
    },
    buttonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
    },
    cancelButtonText: {
      color: themeColors.text,
    },
  });
};

export default AddCrisisContactModal;

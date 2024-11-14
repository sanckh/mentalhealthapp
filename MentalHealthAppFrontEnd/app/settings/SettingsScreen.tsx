// SettingsScreen.js
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AddCrisisContactModal from '@/components/modals/AddCrisisContactModal';
import RemoveCrisisContactModal from '@/components/modals/RemoveCrisisContactModal';
import ResetPasswordModal from '@/components/modals/ResetPasswordModal';
import { getCurrentUser, resetPassword, signout } from '@/api/auth';
import ThemeContext from '../../components/ThemeContext';
import { useAuth } from '../store/auth/auth-context';
import ChangeDisplayNameModal from '@/components/modals/ChangeDisplayNameModal';
import { colors } from '../theme/colors';

export default function SettingsScreen() {
  const { removeAuth } = useAuth();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);
  const [displayNameModalVisible, setDisplayNameModalVisible] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [displayName, setDisplayName] = useState('');

  // Access theme and toggleTheme from ThemeContext
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const initialize = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        setDisplayName(userData?.name || '')
      } catch (error) {
        console.error('Error initializing settings screen:', error);
      }
    };
    initialize();
  }, []);

  const handleAddCrisisContact = () => {
    setAddModalVisible(true);
  };

  const handleRemoveCrisisContact = () => {
    setRemoveModalVisible(true)
  }

  const handleChangePassword = () => {
    setResetPasswordModalVisible(true);
  };

  const handleChangeDisplayName = () => {
    setDisplayNameModalVisible(true);
  };

  const handleSignout = async () => {
    try {
      await signout();
      setUser(null);
      removeAuth();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Define styles based on the current theme
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Dark Mode Toggle */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Dark Mode</Text>
        <Switch
          value={theme === 'dark'}
          onValueChange={toggleTheme}
          thumbColor={theme === 'dark' ? '#f4f3f4' : '#f4f3f4'}
        />
      </View>

      {/* Update/Change Password */}
      <TouchableOpacity style={styles.settingItem} onPress={handleChangePassword}>
        <Text style={styles.settingText}>Change Password</Text>
        <Text style={styles.actionText}>Update</Text>
      </TouchableOpacity>

      {/* Change Display Name */}
      <TouchableOpacity style={styles.settingItem} onPress={handleChangeDisplayName}>
        <Text style={styles.settingText}>Display Name</Text>
        <Text style={styles.actionText}>Change</Text>
      </TouchableOpacity>

      {/* Add Crisis Contact */}
      <TouchableOpacity style={styles.button} onPress={handleAddCrisisContact}>
        <Text style={styles.buttonText}>Add Crisis Contact</Text>
      </TouchableOpacity>

      {/* Remove Crisis Contact */}
      <TouchableOpacity style={styles.button} onPress={handleRemoveCrisisContact}>
        <Text style={styles.buttonText}>Remove Crisis Contact</Text>
      </TouchableOpacity>

      {/* Crisis Contact Modal */}
      {user && (
        <AddCrisisContactModal
          visible={addModalVisible}
          onClose={() => setAddModalVisible(false)}
          userId={user.uid}
        />
      )}

      {/* Remove Crisis Contact */}
      {user && (
        <RemoveCrisisContactModal
          visible={removeModalVisible}
          onClose={() => setRemoveModalVisible(false)}
          userId={user.uid}
          onContactRemoved={() => Alert.alert('Contact Removed')}
        />
      )}

      {user && (
        <ResetPasswordModal
          visible={resetPasswordModalVisible}
          onClose={() => setResetPasswordModalVisible(false)}
          onPasswordReset={() => {
            handleSignout();
          }}
        />
      )}

      {user && (
        <ChangeDisplayNameModal
          visible={displayNameModalVisible}
          onClose={() => setDisplayNameModalVisible(false)}
          currentDisplayName={user?.name}
          userId={user?.uid}
        />
      )}

    </View>
  );
}

// Function to create styles based on theme
const createStyles = (theme: string) => {
  const isDark = theme === 'dark';
  const themeColors = isDark ? colors.dark : colors.light;

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: themeColors.background,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
      backgroundColor: themeColors.surface,
    },
    settingText: {
      fontSize: 16,
      color: themeColors.text,
    },
    actionText: {
      fontSize: 16,
      color: themeColors.primary,
    },
    button: {
      marginTop: 20,
      padding: 15,
      backgroundColor: themeColors.primary,
      borderRadius: 8,
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
};

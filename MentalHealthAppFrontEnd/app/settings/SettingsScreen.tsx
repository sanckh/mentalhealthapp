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
import AddCrisisContactModal from '@/components/AddCrisisContactModal';
import RemoveCrisisContactModal from '@/components/RemoveCrisisContactModal';
import { getCurrentUser } from '@/api/auth';
import ThemeContext from '../../components/ThemeContext';

export default function SettingsScreen() {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // Access theme and toggleTheme from ThemeContext
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const initialize = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
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
    setRemoveModalVisible(true);
  }


  const handleChangePassword = () => {
    // Navigate to Change Password screen or open modal
    Alert.alert('Change Password', 'Navigate to Change Password screen.');
  };

  const handleChangeDisplayName = () => {
    // Navigate to Change Display Name screen or open modal
    Alert.alert('Change Display Name', 'Navigate to Change Display Name screen.');
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
          trackColor={{ false: '#767577', true: '#81b0ff' }}
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
    </View>
  );
}

// Function to create styles based on theme
const createStyles = (theme: string) => {
  const isDark = theme === 'dark';
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: isDark ? '#121212' : '#ffffff',
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333333' : '#cccccc',
    },
    settingText: {
      fontSize: 16,
      color: isDark ? '#ffffff' : '#000000',
    },
    actionText: {
      fontSize: 16,
      color: '#1E90FF',
    },
    button: {
      marginTop: 20,
      padding: 15,
      backgroundColor: '#1E90FF',
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
};

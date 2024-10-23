import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import AddCrisisContactModal from '../components/AddCrisisContactModal';
import { getCurrentUser } from '@/api/auth';

export default function SettingsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState<any>(null);


  useEffect(() => {
    const initialize = async () => {
      try {
        const user = await getCurrentUser();
        setUser(user);
        console.log(user);
      } catch (error) {
        console.error('Error initializing home screen:', error);
      }
    };
  initialize();
}, []);
  
  const handleAddCrisisContact = () => {
    setModalVisible(true);
  };

  return (
    <View>
    <TouchableOpacity onPress={handleAddCrisisContact}>
      <Text>Add Crisis Contact</Text>
    </TouchableOpacity>
    {user && (
      <AddCrisisContactModal
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
      userId={user.uid}
    />
    )}
  </View>
    );
  }
    
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    
  });
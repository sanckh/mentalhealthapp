import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getCurrentUser } from '../../api/auth';
import { submitCheckIn } from '../../api/checkin';

export default function DailyCheckInScreen() {
  const [mood, setMood] = useState('');
  const [notes, setNotes] = useState('');
  const router = useRouter();

  useEffect(() => {
    getCurrentUser()
      .then(user => {
        console.log('User:', user);
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        router.replace('login');
      });
  }, []);

  const handleCheckIn = async () => {
    try {
      await submitCheckIn(mood, notes);
      Alert.alert('Success', 'Check-in completed');
      router.replace('home');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Check-In</Text>
      <TextInput
        style={styles.input}
        placeholder="How are you feeling today?"
        value={mood}
        onChangeText={setMood}
      />
      <TextInput
        style={styles.input}
        placeholder="Notes (optional)"
        value={notes}
        onChangeText={setNotes}
      />
      <Button title="Submit" onPress={handleCheckIn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

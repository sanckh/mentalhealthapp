import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Picker } from 'react-native';
import { useRouter } from 'expo-router';
import { getCurrentUser } from '../../api/auth';
import { submitCheckIn } from '../../api/checkin';

export default function DailyCheckInScreen() {
  const [mood, setMood] = useState('');
  const [notes, setNotes] = useState('');
  const [stress, setStress] = useState('5');
  const [sleep, setSleep] = useState('5');
  const [activity, setActivity] = useState('5');
  const [gratitude, setGratitude] = useState('');
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
      await submitCheckIn({ mood, notes, stress, sleep, activity, gratitude });
      Alert.alert('Success', 'Check-in completed');
      router.replace('home');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Check-In</Text>
      
      <Text style={styles.label}>Mood</Text>
      <TextInput
        style={styles.input}
        placeholder="How are you feeling today?"
        value={mood}
        onChangeText={setMood}
      />

      <Text style={styles.label}>Stress Level</Text>
      <Picker
        selectedValue={stress}
        style={styles.picker}
        onValueChange={(itemValue: string) => setStress(itemValue)}
      >
        {[...Array(10)].map((_, i) => (
          <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
        ))}
      </Picker>

      <Text style={styles.label}>Sleep Quality</Text>
      <Picker
        selectedValue={sleep}
        style={styles.picker}
        onValueChange={(itemValue: string) => setSleep(itemValue)}
      >
        {[...Array(10)].map((_, i) => (
          <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
        ))}
      </Picker>

      <Text style={styles.label}>Physical Activity</Text>
      <Picker
        selectedValue={activity}
        style={styles.picker}
        onValueChange={(itemValue: string) => setActivity(itemValue)}
      >
        {[...Array(10)].map((_, i) => (
          <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
        ))}
      </Picker>

      <Text style={styles.label}>Gratitude</Text>
      <TextInput
        style={styles.input}
        placeholder="What are you grateful for today?"
        value={gratitude}
        onChangeText={setGratitude}
      />

      <Text style={styles.label}>Notes</Text>
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
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  picker: {
    width: '100%',
    height: 50,
    marginVertical: 10,
  },
});

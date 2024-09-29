import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Picker, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { getCurrentUser } from '../../api/auth';
import { submitCheckIn } from '../../api/checkin';

export default function DailyCheckInScreen() {
  const [mood, setMood] = useState('');
  const [general, setGeneral] = useState('');
  const [notes, setNotes] = useState('');
  const [stress, setStress] = useState('5');
  const [sleep, setSleep] = useState('5');
  const [activity, setActivity] = useState('5');
  const [gratitude, setGratitude] = useState('');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const emojis = [
    { label: '😃', value: 1 },
    { label: '😊', value: 2 },
    { label: '😌', value: 3 },
    { label: '😐', value: 4 },
    { label: '😕', value: 5 },
    { label: '😟', value: 6 },
    { label: '😢', value: 7 },
    { label: '😭', value: 8 },
    { label: '😡', value: 9 },
    { label: '🤯', value: 10 },
  ];

  useEffect(() => {
    getCurrentUser()
      .then(user => {
        setUser(user);
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        router.replace({pathname: '/login'});
      });
  }, []);

  const handleCheckIn = async () => {
    try {
      await submitCheckIn({ userId: user.uid, general, mood, notes, stress, sleep, activity, gratitude });
      Alert.alert('Success', 'Check-in completed');
      router.replace({pathname: '/home'});
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>Daily Check-In</Text>
    
    <Text style={styles.label}>General</Text>
    <TextInput
      style={styles.input}
      placeholder="How are you feeling today?"
      value={general}
      onChangeText={setGeneral}
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

      <Text style={styles.label}>Mood</Text>
      <Picker
        selectedValue={mood}
        style={styles.picker}
        onValueChange={(itemValue: string) => setMood(itemValue)}
      >
        {emojis.map((emoji, i) => (
          <Picker.Item key={i} label={emoji.label} value={emoji.value} />
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

      <TouchableOpacity onPress={handleCheckIn} style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={ () => router.replace({pathname: '/home'})} style={styles.buttonTwo}>
        <Text style={styles.buttonText} >Skip for Today</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    paddingBottom: 20
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
  button: {
    height: 40,
    padding: 10,
    backgroundColor: '#007aff',
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 10,
  },
  buttonTwo: {
    height: 40,
    padding: 10,
    backgroundColor: '#ff0000',
    borderRadius: 5,
    marginBottom: 200,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  }
});

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { getCurrentUser } from '../../api/auth';
import { submitCheckIn } from '../../api/checkin';
import { useRouter } from 'expo-router';

export default function DailyCheckInScreen() {
  const [general, setGeneral] = useState('');
  const [notes, setNotes] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // For Stress Level
  const [openStress, setOpenStress] = useState(false);
  const [stress, setStress] = useState(5);
  const [stressItems, setStressItems] = useState(
    [...Array(10)].map((_, i) => ({ label: `${i + 1}`, value: i + 1 }))
  );

  // For Mood
  const [openMood, setOpenMood] = useState(false);
  const [mood, setMood] = useState(5);
  const [moodItems, setMoodItems] = useState([
    { label: '🤯', value: 1 },
    { label: '😡', value: 2 },
    { label: '😭', value: 3 },
    { label: '😢', value: 4 },
    { label: '😟', value: 5 },
    { label: '😕', value: 6 },
    { label: '😐', value: 7 },
    { label: '😌', value: 8 },
    { label: '😊', value: 9 },
    { label: '😃', value: 10 },
  ]);

  // For Sleep Quality
  const [openSleep, setOpenSleep] = useState(false);
  const [sleep, setSleep] = useState(5);
  const [sleepItems, setSleepItems] = useState(
    [...Array(10)].map((_, i) => ({ label: `${i + 1}`, value: i + 1 }))
  );

  // For Physical Activity
  const [openActivity, setOpenActivity] = useState(false);
  const [activity, setActivity] = useState(5);
  const [activityItems, setActivityItems] = useState(
    [...Array(10)].map((_, i) => ({ label: `${i + 1}`, value: i + 1 }))
  );

  // Handle multiple dropdowns opening
  const onStressOpen = useCallback(() => {
    setOpenMood(false);
    setOpenSleep(false);
    setOpenActivity(false);
  }, []);

  const onMoodOpen = useCallback(() => {
    setOpenStress(false);
    setOpenSleep(false);
    setOpenActivity(false);
  }, []);

  const onSleepOpen = useCallback(() => {
    setOpenStress(false);
    setOpenMood(false);
    setOpenActivity(false);
  }, []);

  const onActivityOpen = useCallback(() => {
    setOpenStress(false);
    setOpenMood(false);
    setOpenSleep(false);
  }, []);

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        setUser(user);
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
        router.push('/login');
      });
  }, []);

  const handleCheckIn = async () => {
    try {
      await submitCheckIn({
        userId: user.uid,
        general,
        mood,
        notes,
        stress,
        sleep,
        activity,
        gratitude,
      });
      Alert.alert('Success', 'Check-in completed');
      router.push('/home');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Daily Check-In</Text>

        <Text style={styles.label}>How are you feeling today?</Text>
        <TextInput
          style={styles.input}
          placeholder="Write a few words..."
          value={general}
          onChangeText={setGeneral}
          multiline
        />

        <Text style={styles.label}>Stress Level</Text>
        <DropDownPicker
          open={openStress}
          value={stress}
          items={stressItems}
          setOpen={setOpenStress}
          setValue={setStress}
          setItems={setStressItems}
          onOpen={onStressOpen}
          style={styles.dropdown}
          placeholder=""
          zIndex={4000}
          zIndexInverse={1000}
        />

        <Text style={styles.label}>Mood</Text>
        <DropDownPicker
          open={openMood}
          value={mood}
          items={moodItems}
          setOpen={setOpenMood}
          setValue={setMood}
          setItems={setMoodItems}
          onOpen={onMoodOpen}
          style={styles.dropdown}
          placeholder=""
          zIndex={3000}
          zIndexInverse={2000}
        />

        <Text style={styles.label}>Sleep Quality</Text>
        <DropDownPicker
          open={openSleep}
          value={sleep}
          items={sleepItems}
          setOpen={setOpenSleep}
          setValue={setSleep}
          setItems={setSleepItems}
          onOpen={onSleepOpen}
          style={styles.dropdown}
          placeholder=""
          zIndex={2000}
          zIndexInverse={3000}
        />

        <Text style={styles.label}>Physical Activity</Text>
        <DropDownPicker
          open={openActivity}
          value={activity}
          items={activityItems}
          setOpen={setOpenActivity}
          setValue={setActivity}
          setItems={setActivityItems}
          onOpen={onActivityOpen}
          style={styles.dropdown}
          placeholder=""
          zIndex={1000}
          zIndexInverse={4000}
        />

        <Text style={styles.label}>What are you grateful for today?</Text>
        <TextInput
          style={styles.input}
          placeholder="Express your gratitude..."
          value={gratitude}
          onChangeText={setGratitude}
          multiline
        />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={styles.input}
          placeholder="Any additional notes..."
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <TouchableOpacity onPress={handleCheckIn} style={styles.button}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/home')}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Skip for Today</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
    color: '#555',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  dropdown: {
    marginBottom: 15,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    borderColor: '#6c757d',
    borderWidth: 1,
  },
  secondaryButtonText: {
    color: '#6c757d',
    fontSize: 18,
    fontWeight: '600',
  },
});

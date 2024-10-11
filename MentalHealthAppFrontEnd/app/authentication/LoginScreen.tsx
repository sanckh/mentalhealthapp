import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, Pressable } from 'react-native';
import { login } from '../../api/auth';
import { hasSubmittedDailyCheckin } from '@/api/checkin';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
  
    login(email, password)
      .then((response) => {
        hasSubmittedDailyCheckin(response.uid)
        .then((hasSubmitted) => {
          if (hasSubmitted) {
            navigation.navigate('index');
          } else {
            navigation.navigate('dailycheckin');
          }
        })
      })
      .catch((error: any) => {
        console.error('Login failed:', error);
        if (error instanceof Error) {
          Alert.alert('Login Error', error.message);
        } else {
          Alert.alert('Login Error', 'An unknown error occurred');
        }
      });
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      <View style={styles.button}>
        <Pressable onPress={() => navigation.navigate('register')}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
      </View>
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
  button: {
    marginTop: 20,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#007aff',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

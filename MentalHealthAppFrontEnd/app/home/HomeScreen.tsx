import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
          <Text style={styles.title}>Welcome to the Mental Health Check-in App</Text>
          <Button title="Go to User Profile" onPress={() => router.push('profile')} />
          <Button title="Go to Settings" onPress={() => router.push('settings')} />
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
      },
    });

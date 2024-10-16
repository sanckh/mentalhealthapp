import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

export default function CrisisScreen() {
    return (
        <View style={styles.container}>
          <Text style={styles.title}>Crisis Screen</Text>
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 16,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
      },
    });
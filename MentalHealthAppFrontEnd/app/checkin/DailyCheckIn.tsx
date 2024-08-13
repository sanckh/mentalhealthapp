import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function DailyCheckInScreen() {
    return (
        <View style={styles.container}>
          <Text>Check In Screen</Text>
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 16,
      },
      avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 16,
      },
      name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
      },
      bio: {
        fontSize: 16,
        marginBottom: 16,
      },
      sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
      },
    });
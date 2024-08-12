import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function ProfileScreen() {
    return (
        <View style={styles.container}>
          <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.avatar} />
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.bio}>A short bio about the user...</Text>
          <Text style={styles.sectionTitle}>Contact Info:</Text>
          <Text>Email: john.doe@example.com</Text>
          <Text>Twitter: @johndoe</Text>
          <Text style={styles.sectionTitle}>Achievements:</Text>
          <Text>Badge 1</Text>
          <Text>Badge 2</Text>
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
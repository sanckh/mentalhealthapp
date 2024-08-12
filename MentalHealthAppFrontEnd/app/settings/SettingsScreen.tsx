import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

export default function SettingsScreen() {
    return (
        <View style={styles.container}>
          <Text style={styles.title}>Settings</Text>
          <View style={styles.settingRow}>
            <Text>Dark Mode</Text>
            <Switch value={false} onValueChange={() => { /* toggle dark mode */ }} />
          </View>
          <View style={styles.settingRow}>
            <Text>Notifications</Text>
            <Switch value={true} onValueChange={() => { /* toggle notifications */ }} />
          </View>
          <View style={styles.settingRow}>
            <Text>Language</Text>
            <Text>English</Text>
          </View>
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
      settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
      },
    });
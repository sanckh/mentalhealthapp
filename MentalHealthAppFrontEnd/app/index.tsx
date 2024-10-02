import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
export default function Index() {
  const navigation = useNavigation();

  useEffect(() => {
    // Delay navigation slightly
    setTimeout(() => {
      navigation.navigate('login');;
    }, 0); // You can increase the delay slightly if necessary
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 24,
  },
});


import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
export default function Index() {

  const router = useRouter();
  useEffect(() => {
    // Delay navigation slightly
    setTimeout(() => {
      router.replace('/login');
    }, 0); // You can increase the delay slightly if necessary
  }, [router]);

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


// // //Switching to react native from expo below: 

// // /*
// // import React from 'react';
// // import { AppRegistry } from 'react-native';
// // import { NavigationContainer } from '@react-navigation/native';
// // import { AuthProvider } from './AuthContext';
// // import RootLayout from './_layout';

// // function App() {
// //   return (
// //     <AuthProvider>
// //       <NavigationContainer>
// //         <RootLayout />
// //       </NavigationContainer>
// //     </AuthProvider>
// //   );
// // }

// // AppRegistry.registerComponent('MentalHealthAppFrontEnd', () => App);

// // */
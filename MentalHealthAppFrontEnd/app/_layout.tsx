import { NavigationContainer } from '@react-navigation/native';
import MainDrawerNavigator from './navigation/MainDrawerNavigator';
import { getCurrentUser } from '@/api/auth'; 
import { View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useEffect, useState } from 'react';
import LoginScreen from './authentication/LoginScreen';
import RegisterScreen from './authentication/RegisterScreen';
import HomeScreen from './home/HomeScreen';
import ProfileScreen from './profile/ProfileScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SettingsScreen from './settings/SettingsScreen';
import DailyCheckInScreen from './checkin/DailyCheckInScreen';
import Profile from './profile';

export default function RootLayout() {
  const Drawer = createDrawerNavigator();
  const Stack = createNativeStackNavigator()
  
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser(); 
        setUser(currentUser); 
      } catch (error) {
        console.error('Error fetching user session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Poll every 10 minutes to check for session updates (optional)
    const interval = setInterval(checkUser, 600000); // Poll every 10 minutes
    
    checkUser(); 

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator>
          <Stack.Screen
            name="index"
            component={MainDrawerNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="profile"
            component={ProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="dailycheckin"
            component={DailyCheckInScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
  },
});

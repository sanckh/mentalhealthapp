import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '../hooks/useColorScheme';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './home/HomeScreen';
import ProfileScreen from './profile/ProfileScreen';
import SettingsScreen from './settings/SettingsScreen';

// Prevent the splash screen from hiding before the app is ready
SplashScreen.preventAutoHideAsync();

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

// Stack Navigator
function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="index" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="login" component={ProfileScreen} options={{ title: 'Login' }} />
      <Stack.Screen name="register" component={ProfileScreen} options={{ title: 'Register' }} />
      <Stack.Screen name="home" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      <Stack.Screen name="settings" component={ProfileScreen} options={{ title: 'Settings' }} />
      <Stack.Screen name="dailycheckin" component={ProfileScreen} options={{ title: 'Daily Check-in' }} />
      <Stack.Screen name="+not-found" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

// Drawer Navigator
function DrawerContent() {
  return (
    <Drawer.Navigator initialRouteName="home">
      <Drawer.Screen name="home" component={HomeScreen} />
      <Drawer.Screen name="profile" component={ProfileScreen} />
      <Drawer.Screen name="settings" component={SettingsScreen} />
      {/* Here is the stack navigator as part of the drawer */}
      {/* Add more drawer screens if needed */}
    </Drawer.Navigator>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <DrawerContent />
    </ThemeProvider>
  );
}

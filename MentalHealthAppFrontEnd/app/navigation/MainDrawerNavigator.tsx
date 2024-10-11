// navigation/MainDrawerNavigator.tsx
import React from 'react';
import HomeScreen from '../home/HomeScreen';
import ProfileScreen from '../profile/ProfileScreen';
import SettingsScreen from '../settings/SettingsScreen';
import DailyCheckInScreen from '../checkin/DailyCheckInScreen';
import { createDrawerNavigator } from "@react-navigation/drawer";
const MainDrawerNavigator = () => {

  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator>
      <Drawer.Screen name="index" component={HomeScreen} options={{ title: 'Home' }} />
      <Drawer.Screen name="profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      <Drawer.Screen name="settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Drawer.Navigator>
  );
}

export default MainDrawerNavigator

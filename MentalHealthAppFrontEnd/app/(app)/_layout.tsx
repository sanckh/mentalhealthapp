//app/(auth)/(app)/_layout.tsx
import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './home';
import ProfileScreen from './profile';
import SettingsScreen from './settings';
import DailyCheckInScreen from './dailycheckin';
import { getCurrentUser } from '@/api/auth';

const Drawer = createDrawerNavigator();


const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="home" component={HomeScreen} />
      <Drawer.Screen name="profile" component={ProfileScreen} />
      <Drawer.Screen name="settings" component={SettingsScreen} />
      <Drawer.Screen name="dailycheckin" component={DailyCheckInScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

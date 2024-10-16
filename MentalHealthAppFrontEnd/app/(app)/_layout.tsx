//app/(auth)/(app)/_layout.tsx
import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './home';
import ProfileScreen from './profile';
import SettingsScreen from './settings';
import DailyCheckInScreen from './dailycheckin';
import { getCurrentUser } from '@/api/auth';
import { useAuth } from '../AuthContext';
import { Redirect } from 'expo-router';
import CrisisScreen from '../crisis/CrisisScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { isAuthenticated } = useAuth();

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!isAuthenticated) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/login" />;
  }

  return (
    <Drawer.Navigator>
      <Drawer.Screen name="home" component={HomeScreen} />
      <Drawer.Screen name="profile" component={ProfileScreen} />
      <Drawer.Screen name="settings" component={SettingsScreen} />
      <Drawer.Screen name="dailycheckin" component={DailyCheckInScreen} />
      <Drawer.Screen name="crisis" component={CrisisScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

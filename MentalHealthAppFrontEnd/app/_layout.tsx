// app/_layout.tsx
import { Slot } from 'expo-router';
import { AuthProvider, useAuth } from './AuthContext';
import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/api/auth';
import { API_URL } from '@env';

export default function RootLayout() {

  console.log('App started');
  console.log('API_URL: ', API_URL);

  
  return(
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}

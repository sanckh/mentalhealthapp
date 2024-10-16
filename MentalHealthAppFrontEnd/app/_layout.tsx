// app/_layout.tsx
import { Slot } from 'expo-router';
import { AuthProvider, useAuth } from './AuthContext';
import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/api/auth';

export default function RootLayout() {
  return(
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}

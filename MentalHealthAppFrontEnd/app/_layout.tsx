import React from "react";
import { Slot } from "expo-router";
import { AuthContextProvider } from "./store/auth/auth-context";
import { ThemeProvider } from "@/components/ThemeContext";
import firebase from "@react-native-firebase/app";
import useNotificationSetup from "@/hooks/useNotificationSetup";

if (!firebase.apps.length) {
  firebase.initializeApp({
   // Add your firebase config here
}

export default function RootLayout() {
  useNotificationSetup();

  return (
    <ThemeProvider>
      <AuthContextProvider>
        <Slot />
      </AuthContextProvider>
    </ThemeProvider>
  );
}

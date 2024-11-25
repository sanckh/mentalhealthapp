import React from "react";
import { Slot } from "expo-router";
import { AuthContextProvider } from "./store/auth/auth-context";
import { ThemeProvider } from "@/components/ThemeContext";
import useNotificationSetup from "@/hooks/useNotificationSetup";

export default function RootLayout() {
  useNotificationSetup()

  return (
    <ThemeProvider>
      <AuthContextProvider>
        <Slot />
      </AuthContextProvider>
    </ThemeProvider>
  );
}

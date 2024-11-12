import { Slot } from "expo-router";
import { AuthContextProvider } from "./store/auth/auth-context";
import { ThemeProvider } from "@/components/ThemeContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthContextProvider>
        <Slot />
      </AuthContextProvider>
    </ThemeProvider>
  );
}

import { Slot } from "expo-router";
import { AuthContextProvider } from "./store/auth/auth-context";
import { ThemeProvider } from "@/components/ThemeContext";

// mobileAds()
//   .initialize()
//   .then(adapterStatuses => {
//     // Initialization complete!
//   });

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

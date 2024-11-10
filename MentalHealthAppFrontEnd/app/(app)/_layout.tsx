import React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useThemeContext } from "@/components/ThemeContext"; // Access the theme context
import HomeScreen from "./home";
import ProfileScreen from "./profile";
import SettingsScreen from "./settings";
import DailyCheckInScreen from "./dailycheckin";
import { signout } from "@/api/auth";
import { useAuth } from "../AuthContext";
import { Redirect } from "expo-router";
import CrisisScreen from "../crisis/CrisisScreen";
import { DarkTheme, DefaultTheme, Theme } from "@react-navigation/native";

import { DrawerContentComponentProps } from "@react-navigation/drawer";

const handleSignout = async (
  signout: () => Promise<void>,
  setAuth: (value: boolean) => void
) => {
  try {
    await signout();
    setAuth(false);
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

function CustomDrawerContent({
  props,
  signout,
  setAuth,
}: {
  props: DrawerContentComponentProps;
  signout: () => Promise<void>;
  setAuth: (value: boolean) => void;
}) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Signout"
        onPress={async () => {
          await handleSignout(signout, setAuth);
        }}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const { theme } = useThemeContext();
  const isDark = theme === "dark";

  // Define custom themes for the drawer
  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: "#121212",
      card: "#1e1e1e",
      text: "#ffffff",
    },
  };

  const CustomLightTheme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "#f7f7f7",
      card: "#ffffff",
      text: "#000000",
    },
  };

  // Redirect to login if the user is not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? "#1e1e1e" : "#007BFF",
        },
        headerTintColor: isDark ? "#ffffff" : "#ffffff",
        drawerStyle: {
          backgroundColor: isDark ? "#121212" : "#ffffff",
        },
        drawerActiveTintColor: isDark ? "#bb86fc" : "#007BFF",
        drawerInactiveTintColor: isDark ? "#888" : "#555",
      }}
      drawerContent={(props) => (
        <CustomDrawerContent
          props={props}
          signout={signout}
          setAuth={setIsAuthenticated}
        />
      )}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Daily Check In" component={DailyCheckInScreen} />
      <Drawer.Screen name="Crisis" component={CrisisScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

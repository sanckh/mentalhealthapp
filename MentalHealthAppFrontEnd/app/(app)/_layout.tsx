import React from "react";
import { Redirect, router } from "expo-router";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CrisisScreen from "../crisis/CrisisScreen";
import CustomDrawerContent from "../../components/CustomDrawerContent";
import DailyCheckInScreen from "./dailycheckin";
import HomeScreen from "./home";
import ProfileScreen from "./profile";
import SettingsScreen from "./settings";
import { useAuth } from "../store/auth/auth-context";
import { useThemeContext } from "@/components/ThemeContext";
import { signout } from "@/api/auth";
import { colors } from '../theme/colors';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { isAuthenticated, removeAuth, setIsAuthenticated } = useAuth();
  const { theme } = useThemeContext();
  const isDark = theme === "dark";

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? colors.dark.surface : colors.light.primary,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '600',
        },
        drawerStyle: {
          backgroundColor: isDark ? colors.dark.background : colors.light.background,
        },
        drawerActiveTintColor: isDark ? colors.dark.primary : colors.light.primary,
        drawerInactiveTintColor: isDark ? colors.dark.textSecondary : colors.light.textSecondary,
      }}
      drawerContent={(props) => (
        <CustomDrawerContent
          props={props}
          signout={signout}
          removeAuth={removeAuth}
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

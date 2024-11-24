import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { getCurrentUser } from "@/api/auth";
import ShowIf from "./ShowIf";
import { useThemeContext } from "./ThemeContext";
import { colors } from '../app/theme/colors';
import { userModel } from "@/models/userModel";

interface CustomDrawerContentProps {
  props: any;
  removeAuth: () => void;
  signout: () => Promise<void>;
}

export default function CustomDrawerContent({
  props,
  removeAuth,
  signout,
}: CustomDrawerContentProps) {
  const [user, setUser] = useState<userModel | null>(null);
  const { theme } = useThemeContext();
  const styles = createStyles(theme);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.userInfoContainer}>
        <ShowIf
          condition={!!user?.profileImageUrl}
          render={() => (
            <Image
              source={{ uri: user?.profileImageUrl }}
              style={styles.avatar}
            />
          )}
          renderElse={() => (
            <View style={[styles.avatar, styles.placeholderAvatar]} />
          )}
        />
        <Text style={styles.userName}>{user?.name || "User"}</Text>
        <Text style={styles.userDate}>
          {user?.createdAt ? `Joined ${new Date(user.createdAt).toLocaleDateString()}` : ""}
        </Text>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Sign Out"
        onPress={async () => {
          await signout();
          removeAuth();
        }}
      />
    </DrawerContentScrollView>
  );
}

const createStyles = (theme: string) => {
  const isDark = theme === "dark";
  const themeColors = isDark ? colors.dark : colors.light;

  return StyleSheet.create({
    userInfoContainer: {
      alignItems: "center",
      backgroundColor: themeColors.surfaceVariant,
      padding: 16,
      marginBottom: 8,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 12,
      borderWidth: 3,
      borderColor: themeColors.primary,
    },
    placeholderAvatar: {
      backgroundColor: themeColors.surfaceVariant,
      alignItems: "center",
      justifyContent: "center",
    },
    userName: {
      fontSize: 18,
      fontWeight: "bold",
      color: themeColors.text,
      marginBottom: 4,
    },
    userDate: {
      fontSize: 14,
      color: themeColors.textSecondary,
    },
  });
};

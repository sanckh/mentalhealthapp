import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { ms, s, ScaledSheet, vs } from "react-native-size-matters";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { getCurrentUser } from "@/api/auth";
import ShowIf from "./ShowIf";

export interface User {
  profileImageUrl: string;
  name: string;
  date: string;
}

const CustomDrawerContent = ({
  props,
  signout,
  setAuth,
}: {
  props: any;
  signout: () => Promise<void>;
  setAuth: (value: boolean) => void;
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setUser(user);
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
          render={() => {
            return (
              <Image
                source={{ uri: user?.profileImageUrl }}
                style={styles.avatar}
              />
            );
          }}
          renderElse={() => {
            return (
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor: "#ccc",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <Text style={{ color: "#fff" }}>{user?.name?.charAt(0)}</Text>
              </View>
            );
          }}
        />
        <Text style={styles.userName}>{user?.name || ""}</Text>
        <Text style={styles.userDate}>
          {new Intl.DateTimeFormat("default", {
            dateStyle: "short",
            timeStyle: "short",
          }).format(new Date())}
        </Text>
      </View>

      <DrawerItemList {...props} />

      <DrawerItem
        label="Sign out"
        onPress={async () => {
          await signout();
          setAuth(false);
        }}
      />
    </DrawerContentScrollView>
  );
};

const styles = ScaledSheet.create({
  userInfoContainer: {
    padding: ms(20),
    backgroundColor: "#f4f4f4",
    alignItems: "center",
  },
  avatar: {
    width: s(60),
    height: vs(60),
    borderRadius: 70,
    marginBottom: vs(10),
  },
  userName: {
    fontSize: s(18),
    fontWeight: "bold",
    marginBottom: vs(5),
  },
  userDate: {
    fontSize: s(14),
    color: "#888",
  },
});

export default CustomDrawerContent;

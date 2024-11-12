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
  removeAuth,
  signout,
}: {
  props: any;
  removeAuth: () => void;
  signout: () => Promise<void>;
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
        inactiveTintColor="#888"
        onPress={async () => {
          await signout();
          removeAuth();
        }}
      />
    </DrawerContentScrollView>
  );
};

const styles = ScaledSheet.create({
  userInfoContainer: {
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    padding: ms(20),
  },
  avatar: {
    borderRadius: 70,
    height: vs(60),
    marginBottom: vs(10),
    objectFit: "cover",
    resizeMode: "cover",
    width: s(60),
  },
  userName: {
    fontSize: s(18),
    fontWeight: "bold",
    marginBottom: vs(5),
  },
  userDate: {
    color: "#888",
    fontSize: s(14),
  },
});

export default CustomDrawerContent;

import React, { useEffect } from "react";
import { Alert } from "react-native"
import { Slot } from "expo-router";
import { AuthContextProvider } from "./store/auth/auth-context";
import { ThemeProvider } from "@/components/ThemeContext";
import messaging from "@react-native-firebase/messaging";
import firebase from "@react-native-firebase/app";


if (!firebase.apps.length) {
  firebase.initializeApp({
   // will make an env for this -- commit w/o creds!!!
  });
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;


export default function RootLayout() {
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);;
    }
    return {enabled, authStatus};
  }

  useEffect(() => {
    requestUserPermission().then(({enabled, authStatus}) => {
      if (enabled) {
        messaging().getToken().then((token) => {
          console.log(token);
        })
      } else {
        console.log("Failed token status", authStatus);
      }
  
      messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
          if (remoteMessage) {
            console.log(
              'Notification caused app to open from quit state:',
              remoteMessage.notification,
            );
          }
        });
  
      messaging().onNotificationOpenedApp((remoteMessage) => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage.notification,
        );
      });
  
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log('Message handled in the background!', remoteMessage);
      });
  
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      });
  
      return unsubscribe;
    });

  }, []);
  return (
    <ThemeProvider>
      <AuthContextProvider>
        <Slot />
      </AuthContextProvider>
    </ThemeProvider>
  );
}

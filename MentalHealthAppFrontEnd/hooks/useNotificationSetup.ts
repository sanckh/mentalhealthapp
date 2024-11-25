import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import notifee, { AndroidImportance } from "@notifee/react-native";

const useNotificationSetup = () => {
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
    return { enabled, authStatus };
  };

  useEffect(() => {
    const initializeMessaging = async () => {
      const { enabled } = await requestUserPermission();
      if (!enabled) return;

      await messaging().getInitialNotification();

      const unsubscribeOnNotificationOpened =
        messaging().onNotificationOpenedApp((remoteMessage) => {
          console.log(
            "Notification caused app to open from background state:",
            remoteMessage.notification
          );
        });

      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log("Message handled in the background!", remoteMessage);
      });

      const unsubscribeOnMessage = messaging().onMessage(
        async (remoteMessage) => {
          console.log("Message received in foreground:", remoteMessage);

          await notifee.displayNotification({
            title: remoteMessage.notification?.title || "Notification",
            body: remoteMessage.notification?.body || "You have a new message.",
            android: {
              channelId: "default",
            },
          });
        }
      );

      return () => {
        unsubscribeOnNotificationOpened();
        unsubscribeOnMessage();
      };
    };

    const cleanupPromise = initializeMessaging();

    return () => {
      cleanupPromise.then((cleanup) => {
        if (typeof cleanup === "function") cleanup();
      });
    };
  }, []);

  useEffect(() => {
    let channelCreated = false;

    const createChannel = async () => {
      if (channelCreated) return;
      channelCreated = true;

      await notifee.createChannel({
        id: "default",
        name: "Default Channel",
        importance: AndroidImportance.HIGH,
      });
    };

    createChannel();
  }, []);
};

export default useNotificationSetup;

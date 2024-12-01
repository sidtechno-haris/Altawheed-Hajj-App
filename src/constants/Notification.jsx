import messaging from "@react-native-firebase/messaging";

import { onDisplayNotification } from "./LocalNotification";

// PushNotification.configure({
//   onNotification: function (notification) {
//     console.log("NOTIFICATION:", notification);
//   },
//   popInitialNotification: true,
//   requestPermissions: Platform.OS === "ios",
// });

// Request user permission for notifications
export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Authorization status:", authStatus);
  }
}

export async function getFCMToken() {
  const token = await messaging().getToken();
  console.log("FCM Token:", token);
  // config.fcmtoken = token;
  // Send this token to your server for sending notifications
}

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
  onDisplayNotification({
    title: remoteMessage?.notification?.title,
    body: remoteMessage?.notification?.body,
  });
});

messaging().getInitialNotification(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
  onDisplayNotification({
    title: remoteMessage?.notification?.title,
    body: remoteMessage?.notification?.body,
  });
});

export function listenForForegroundMessages() {
  return messaging().onMessage(async (remoteMessage) => {
    console.log("JSON.stringify(remoteMessage)", JSON.stringify(remoteMessage));
    onDisplayNotification({
      title: remoteMessage?.notification?.title,
      body: remoteMessage?.notification?.body,
    });
    // PushNotification.localNotification({
    //   channelId: remoteMessage?.notification?.android?.channelId || "default", // Required for Android 8.0 and above
    //   title: remoteMessage?.notification?.title,
    //   message: remoteMessage?.notification?.body,
    //   playSound: true,
    //   sound: "default",
    // });
  });
}

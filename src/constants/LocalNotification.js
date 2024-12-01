import notifee, {
  AndroidImportance,
  AndroidVisibility,
} from "@notifee/react-native";

export const onDisplayNotification = async ({ title, body }) => {
  await notifee.requestPermission();

  const channelId = await notifee.createChannel({
    id: "default",
    name: "Default Channel",
    vibration: true,
    importance: AndroidImportance.HIGH,
    sound: "default",
    vibrationPattern: [1, 2],
  });

  await notifee.displayNotification({
    title: title,
    body: body,
    android: {
      importance: AndroidImportance.HIGH,
      circularLargeIcon: true,
      visibility: AndroidVisibility.PUBLIC,
      channelId,
      largeIcon: require("../../assets/Logo.png"),
      lightUpScreen: true,
      sound: "default",
      vibrationPattern: [1, 2],

      pressAction: {
        id: "default",
      },
    },
  });
};

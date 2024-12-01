/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import "./src/utils/i18.config";

import messaging from "@react-native-firebase/messaging";

messaging().getInitialNotification(async (remoteMessage) => {
  console.warn("Notification in killState", remoteMessage);
});
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.warn("Notification in Background", remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);

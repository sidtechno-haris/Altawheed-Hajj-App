import { Alert, Platform, StyleSheet, ToastAndroid } from "react-native";
import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  AboutCompany,
  Accommodation,
  AddCircle,
  AddUser,
  Announcement,
  CallingEmergency,
  Chat,
  ChatList,
  LiveStream,
  EmergencyCircle,
  EventScreen,
  HajjGuide,
  Health,
  HospitalNumber,
  HotelDetail,
  Intro,
  LanguageSelect,
  Notification,
  Phone,
  Tracker,
  TrackingList,
} from "../app";
import Bottomtabs from "./Bottomtabs";
import ContactUs from "../app/Screens/ContactUs";
import LoginNav from "./LoginNav";
import LogScreen from "../app/Login/logScreen";
import {
  isLocationEnabled,
  promptForEnableLocationIfNeeded,
} from "react-native-android-location-enabler";
import { useMMKVString } from "react-native-mmkv";
import { Storage } from "../constants/Store/mmkv";
import BootSplash from "react-native-bootsplash";
import { useTranslation } from "react-i18next";

const Route = () => {
  const Stack = createNativeStackNavigator();
  const [token] = useMMKVString("token", Storage);
  const [selected] = useMMKVString("language", Storage);

  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const lang = () => {
    if (selected === "English") {
      i18n.changeLanguage("en");
    } else {
      i18n.changeLanguage("ar");
    }
  };
  const enableGps = async () => {
    try {
      if (Platform.OS === "android") {
        const isGPSEnabled = await isLocationEnabled();
        if (!isGPSEnabled) {
          await promptForEnableLocationIfNeeded();
        }
      }
    } catch (error) {
      console.error("GPS Error:", error);
    }
  };
  useEffect(() => {
    enableGps();
  }, []);

  return (
    <NavigationContainer
      onReady={async () => {
        lang();
        await BootSplash.hide({ fade: true });
        enableGps();
      }}
      theme={{
        dark: true,
        colors: {
          primary: "#fff",
          background: "#fff",
          card: "#fff",
          border: "#000",
          text: "#000",
          notification: "#fff",
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          statusBarTranslucent: true,
          statusBarStyle: "dark",
          statusBarColor: "transparent",
          navigationBarHidden: true,
          navigationBarColor: "transparent",
          animation:
            selected === "English" ? "slide_from_right" : "slide_from_left",
          orientation: "portrait",
        }}
      >
        <Stack.Screen
          name="Intro"
          component={token === undefined ? Intro : Bottomtabs}
          // component={Intro}
        />

        <Stack.Screen name="Lang" component={LanguageSelect} />
        <Stack.Screen name="loginScreen" component={LoginNav} />
        <Stack.Screen name="logScreen" component={LogScreen} />

        <Stack.Screen name="BottomTabs" component={Bottomtabs} />
        <Stack.Screen name="AboutCompany" component={AboutCompany} />
        <Stack.Screen name="Phone" component={Phone} />
        <Stack.Screen name="HospitalNumber" component={HospitalNumber} />
        <Stack.Screen name="CallingEmergency" component={CallingEmergency} />
        <Stack.Screen name="EmergencyCircle" component={EmergencyCircle} />
        <Stack.Screen name="TrackingList" component={TrackingList} />
        <Stack.Screen name="Campaign" component={Announcement} />
        <Stack.Screen name="HajjGuide" component={HajjGuide} />
        <Stack.Screen name="Live Stream" component={LiveStream} />
        <Stack.Screen name="ContactUs" component={ContactUs} />
        <Stack.Screen name="AddCircle" component={AddCircle} />
        <Stack.Screen name="AddUser" component={AddUser} />
        <Stack.Screen name="EventScreen" component={EventScreen} />
        <Stack.Screen name="Accommodation" component={Accommodation} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="HotelDetail" component={HotelDetail} />
        <Stack.Screen name="Health" component={Health} />
        <Stack.Screen name="ChatList" component={ChatList} />
        <Stack.Screen name="Tracking" component={Tracker} />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{
            navigationBarHidden: false,
            navigationBarColor: "transparent",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Route;

const styles = StyleSheet.create({});

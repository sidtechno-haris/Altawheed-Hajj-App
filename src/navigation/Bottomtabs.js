import { Image, TouchableOpacity, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { About, Home, PrayerTime, Sos } from "../app";
import { Colors } from "../constants/Colors";
import { hp, wp } from "../constants/Dimentions";
import { useTranslation } from "react-i18next";
import Text from "../components/ScreenComponents/Text";

const BottomTabs = () => {
  const Tabs = createBottomTabNavigator();
  const { t, i18n } = useTranslation();

  const Icon = ({ focused, source, label }) => (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Image
        style={{
          width: label === "Home" ? wp(6) : wp(5),
          height: label === "Home" ? wp(6) : wp(5),
          resizeMode: "contain",
          aspectRatio: 1,
          tintColor: focused ? Colors.white : Colors.primary,
        }}
        source={source}
      />
      <Text
        style={{
          fontSize: wp(3.3),
          color: focused ? Colors.white : Colors.primary,
        }}
      >
        {label}
      </Text>
    </View>
  );

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          borderColor: "#fff",
          backgroundColor: Colors.dark,
          height: hp(6.5),
        },

        tabBarLabel: () => null, // Remove tab label padding
        tabBarButton: (props) => {
          // Example of custom tab button behavior
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              {...props}
              onPress={() => {
                // Custom navigation logic
                props.onPress(); // Call default behavior
              }}
            />
          );
        },
        tabBarIcon: ({ focused }) => {
          // Example of using `route.name` for dynamic icons
          let iconSource;
          switch (route.name) {
            case t("Home"):
              iconSource = require("../../assets/house.png");
              break;
            case t("SOS"):
              iconSource = require("../../assets/sos.png");
              break;
            case t("Prayer Time"):
              iconSource = require("../../assets/time.png");
              break;
            case t("About"):
              iconSource = require("../../assets/about.png");
              break;
            default:
              iconSource = require("../../assets/house.png");
          }

          return (
            <Icon focused={focused} label={route.name} source={iconSource} />
          );
        },
      })}
    >
      <Tabs.Screen name={t("Home")} component={Home} />
      <Tabs.Screen name={t("SOS")} component={Sos} />
      <Tabs.Screen name={t("Prayer Time")} component={PrayerTime} />
      <Tabs.Screen name={t("About")} component={About} />
    </Tabs.Navigator>
  );
};

export default BottomTabs;

import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { hp, wp } from "../../constants/Dimentions";
import * as Icons from "react-native-heroicons/outline";
import * as IconSolid from "react-native-heroicons/solid";
import { Colors } from "../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import Text from "../ScreenComponents/Text";
import { getData } from "../../constants/AsyncStorage";
import GlobalStyles from "../../constants/GlobalStyles";
import { useTranslation } from "react-i18next";

const Header = ({ title = "Muhammad", location }) => {
  const [length, setLength] = useState(null);
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const notificationData = async () => {
    const data = await getData("Notification");
    if (data) {
      // Filter notifications where viewed is false
      const unviewedNotifications = data.filter(
        (notification) => !notification.viewed
      );
      setLength(unviewedNotifications.length);
    }
  };
  useEffect(() => {
    notificationData();
  }, [length]);

  const navigation = useNavigation();
  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: isArabic ? "row-reverse" : "row",
        },
      ]}
    >
      <View style={{ alignItems: isArabic ? "flex-end" : "flex-start" }}>
        <Text style={styles.title}>{`${t("Ya Salam!")} ${title}`}</Text>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(`geo:0,0?q=${location}`);
          }}
          style={[
            styles.textIconContainer,

            {
              flexDirection: isArabic ? "row-reverse" : "row",
            },
          ]}
        >
          <IconSolid.MapPinIcon
            color={Colors.primary}
            size={wp(6)}
            accessibilityLabel="Location Icon"
          />
          {location === null ? (
            <ActivityIndicator size={"small"} color={Colors.primary} />
          ) : (
            <Text numberOfLines={1} style={[styles.countryName]}>
              {location}
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.touchableContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ChatList")}
          style={styles.touchable}
        >
          <Icons.ChatBubbleLeftRightIcon
            color={Colors.white}
            size={wp(5)}
            accessibilityLabel="Chat icon"
          />
        </TouchableOpacity>

        <View>
          {length > 0 && (
            <View
              style={{
                position: "absolute",
                width: 15,
                justifyContent: "center",
                alignItems: "center",
                height: 15,
                borderRadius: 500,
                backgroundColor: "red",
                zIndex: 2,
                right: 0,
              }}
            >
              <Text
                style={{
                  fontSize: wp(3),
                  ...GlobalStyles.CustomFonts,
                  color: "#fff",
                }}
              >
                {length}
              </Text>
            </View>
          )}
          <TouchableOpacity
            onPress={() => navigation.navigate("Notification")}
            style={styles.touchable}
          >
            <Icons.BellIcon
              color={Colors.white}
              size={wp(5)}
              accessibilityLabel="Notification icon"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: wp(100),
    height: hp(7.5),
    padding: 15,
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Colors.bg,
  },
  textIconContainer: { flexDirection: "row", alignItems: "center" },
  title: {
    fontSize: wp(6),
    color: Colors.primary,
  },
  countryName: {
    color: Colors.dark,
    fontSize: hp(1.5),
    fontWeight: "600",
    maxWidth: "75%",
  },
  touchableContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  touchable: {
    backgroundColor: Colors.primary,
    padding: wp(1.8),
    borderRadius: 20,
  },
});

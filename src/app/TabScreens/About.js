import React, { memo, useState } from "react";
import { Text, Image, StyleSheet, TouchableOpacity, View, Alert } from "react-native";
import { hp, wp } from "../../constants/Dimentions";
import * as Icons from "react-native-heroicons/outline";
import { Colors } from "../../constants/Colors";
import { useTranslation } from "react-i18next";
import { Background, Button, Loading } from "../../components";
import { useGlobalState } from "../../constants/GlobalStorage";
import { useMMKVObject, useMMKVString } from "react-native-mmkv";
import { Storage } from "../../constants/Store/mmkv";
import { CommonActions } from "@react-navigation/native";
import { deleteAccountAPI } from "../../Api/ApiRoute";

const About = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { language } = useGlobalState();
  const [storeLogin, setStoreLogin] = useMMKVObject("login", Storage);
  const [token, setToken] = useMMKVString("token", Storage);
  const [loading, setLoading] = useState(false);

  const isArabic = i18n.language === "ar";
  const navigationItems = [
    { label: t("about"), screen: "AboutCompany", bar: true },
    { label: t("phone"), screen: "HospitalNumber", bar: true },
    { label: t("Contact Us"), screen: "ContactUs", bar: true },
    { label: t("Logout"), screen: "Intro", bar: false },
    { label: t("Delete Account"), screen: "Intro", bar: false },
  ];

  const confirmLogout = () => {
    Alert.alert(
      t("Confirm Logout"),
      t("Are you sure you want to log out?"),
      [
        {
          text: t("Cancel"),
          onPress: () => {},
          style: "cancel"
        },
        { text: t("OK"), onPress: () => logout() }
      ],
      { cancelable: false }
    );
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      t("Confirm Account Deletion"),
      t("Are you sure you want to delete your account? This action cannot be undone."),
      [
        {
          text: t("Cancel"),
          onPress: () => {},
          style: "cancel"
        },
        { text: t("OK"), onPress: () => deleteAccount() }
      ],
      { cancelable: false }
    );
  };

  const deleteAccount = async () => {
    setLoading(true);
    try {
      await deleteAccountAPI('deleteMyAccount', token);
      setStoreLogin(undefined);
      setToken(undefined);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Failed to delete account:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoading(true);
    setStoreLogin(undefined);
    setToken(undefined);
    setLoading(false);
    navigation.navigate("Login");
  };
  

  const renderNavigationButton = ({ label, screen, bar }) => (
    <TouchableOpacity
      key={`${screen}_${label}`}
      style={[
        styles.touchable,
        {
          flexDirection: isArabic ? "row-reverse" : "row",
        },
      ]}
      activeOpacity={0.8}
      onPress={() => {
        if (label === "Logout") {
          confirmLogout();
          return;
        } else if (label === "Delete Account") {
          confirmDeleteAccount();
          return;
        } else {
          navigation.navigate(screen);
        }
      }}
    >
      <Text
        style={[
          styles.touchableText,
          {
            fontFamily:
              language === "English" ? "Poppins-Medium" : "Cairo-Bold",
          },
        ]}
      >
        {label}
      </Text>
      {bar === true &&
        (isArabic ? (
          <Icons.ChevronLeftIcon color={Colors.icons} size={wp(6)} />
        ) : (
          <Icons.ChevronRightIcon color={Colors.icons} size={wp(6)} />
        ))}
    </TouchableOpacity>
  );

  return (
    <>
      {loading && <Loading />}
      <Background
        backgroundColor={Colors.white + 99}
        source={require("../../../assets/image.png")}
      >
        <View style={styles.images}>
          <Image
            style={styles.image}
            source={require("../../../assets/Logo.png")}
          />
          <Image
            style={styles.imageSec}
            source={require("../../../assets/group1.png")}
          />
        </View>
        <View style={styles.touchableContainer}>
          {navigationItems.map(renderNavigationButton)}
        </View>
      </Background>
    </>
  );
};

export default memo(About);

const styles = StyleSheet.create({
  images: {
    paddingTop: wp(20),
    gap: 5,
    alignItems: "center",
  },
  image: {
    width: wp(40),
    height: wp(40),
    resizeMode: "cover",
  },
  imageSec: {
    width: 80,
    height: 35,
    resizeMode: "contain",
  },
  touchableContainer: {
    alignSelf: "center",
    marginVertical: hp(5),
    gap: 10,
  },
  touchable: {
    backgroundColor: Colors.white,
    width: wp(90),
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 10,
  },
  touchableText: {
    color: Colors.input,
    fontSize: wp(3.2),
  },
});

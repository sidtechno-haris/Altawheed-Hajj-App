import { StyleSheet, TouchableOpacity, Text } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";
import { hp, wp } from "../../constants/Dimentions";
import { useTranslation } from "react-i18next";
import { useGlobalState } from "../../constants/GlobalStorage";

const Button = ({ title, onPress, marginVertical, style }) => {
  const { t } = useTranslation();
  const { language } = useGlobalState();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.touchable, style, { marginVertical }]}
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
        {t(title)}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  touchable: {
    alignSelf: "center",
    width: "85%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark,
    padding: 14,
    borderRadius: 15,
    height: hp(6.5),
  },
  touchableText: {
    color: Colors.white,
    fontSize: wp(3.5),
  },
});

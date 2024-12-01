import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { hp, wp } from "../../constants/Dimentions";
import { Colors } from "../../constants/Colors";
import * as Icons from "react-native-heroicons/outline";
import { useTranslation } from "react-i18next";

const RoundedButton = ({ onPress, rotete, rotateRev, delay }) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  return (
    <View
      style={[
        styles.touchableConainer,
        {
          transform: [{ rotate: rotete }],
        },
      ]}
    >
      <TouchableOpacity
        accessibilityLabel="Next"
        onPress={onPress}
        style={[
          styles.touchable,
          {
            transform: [{ rotate: rotateRev }],
          },
        ]}
      >
        {isArabic ? (
          <Icons.ArrowLeftIcon size={wp(5)} color={"#fff"} strokeWidth={2} />
        ) : (
          <Icons.ArrowRightIcon size={wp(5)} color={"#fff"} strokeWidth={2} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default RoundedButton;

const styles = StyleSheet.create({
  touchableConainer: {
    borderRadius: wp(50),
    padding: 2,
    width: wp(15),
    height: wp(15),
    borderWidth: 2,
    borderTopColor: Colors.borderlight,
    borderBottomColor: Colors.borderlight,
    borderRightColor: Colors.dark,
    borderLeftColor: Colors.borderlight,
    position: "absolute",
    bottom: hp(10),
    alignSelf: "center",
  },
  touchable: {
    width: wp(13),
    height: wp(13),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(50),
    backgroundColor: Colors.dark,
  },
});

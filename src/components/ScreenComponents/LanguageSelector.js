import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import * as Icons from "react-native-heroicons/outline";
import { Colors } from "../../constants/Colors";
import { hp, wp } from "../../constants/Dimentions";
import { useTranslation } from "react-i18next";

const LanguageSelector = ({ selected, setSelected }) => {
  const { i18n } = useTranslation();
  return (
    <View style={{ gap: 6 }}>
      <TouchableOpacity
        style={[
          styles.touchable,
          {
            backgroundColor:
              selected === "English" ? Colors.primary : Colors.white,
          },
        ]}
        activeOpacity={0.9}
        onPress={() => {
          setSelected("English");
          if (i18n.language === "ar") {
            i18n.changeLanguage("en");
          }
        }}
      >
        <View style={styles.flagContant}>
          <Image
            source={require("../../../assets/Flag.png")}
            style={styles.flagImage}
          />
          <Text
            style={[
              styles.textContiner,
              { color: selected === "English" ? Colors.white : Colors.dark },
            ]}
          >
            English
          </Text>
        </View>
        <Icons.CheckCircleIcon
          color={selected === "English" ? Colors.white : Colors.dark}
          size={wp(7)}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.touchable,
          {
            backgroundColor:
              selected === "Arabic" ? Colors.primary : Colors.white,
          },
        ]}
        activeOpacity={0.9}
        onPress={() => {
          setSelected("Arabic");
          if (i18n.language === "en") {
            i18n.changeLanguage("ar");
          }
        }}
      >
        <View style={styles.flagContant}>
          <Image
            source={require("../../../assets/Flag1.png")}
            style={styles.flagImage}
          />
          <Text
            style={[
              styles.textContiner,
              { color: selected === "Arabic" ? Colors.white : Colors.dark },
            ]}
          >
            Arabic
          </Text>
        </View>
        <Icons.CheckCircleIcon
          color={selected === "Arabic" ? Colors.white : Colors.dark}
          size={wp(7)}
        />
      </TouchableOpacity>
    </View>
  );
};

export default LanguageSelector;

const styles = StyleSheet.create({
  flagImage: {
    width: wp(12),
    height: wp(8),
    borderRadius: 6,
  },
  touchable: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderCurve: "continuous",
    paddingHorizontal: 8,
    paddingVertical: 12,
    width: hp(35),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flagContant: {
    alignItems: "center",
    gap: 10,
    flexDirection: "row",
  },
  textContiner: {
    fontFamily: "SquadaOne-Regular",
    color: Colors.dark,
    fontSize: wp(4),
  },
});

import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";
import { wp } from "../../constants/Dimentions";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import Text from "../ScreenComponents/Text";

const TopIcons = ({ text, source, items }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate(text, { items: items })}
        style={styles.touchables}
      >
        <Image style={styles.icons} source={source} />
      </TouchableOpacity>
      <Text style={styles.text}>{t(text)}</Text>
    </View>
  );
};

export default TopIcons;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  touchables: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.bg + 99,
    width: wp(16),
    height: wp(13),
    borderColor: Colors.primary,
    borderWidth: 1.5,
    borderRadius: 20,
  },
  icons: {
    resizeMode: "contain",
    width: wp(12),
    height: wp(9),
  },
  text: {
    paddingVertical: 5,
    color: Colors.dark,
    fontSize: wp(2.7),
  },
});

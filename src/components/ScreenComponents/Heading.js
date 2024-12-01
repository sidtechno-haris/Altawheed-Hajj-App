import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

import React from "react";
import { wp } from "../../constants/Dimentions";
import { Colors } from "../../constants/Colors";
import Text from "./Text";

const Heading = ({ onPress, item }) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.hajjGuideContainer}
      onPress={onPress}
    >
      <ImageBackground
        style={styles.hajjGuide}
        resizeMode="contain"
        source={require("../../../assets/prayertimes.png")}
      >
        <View style={styles.hajjTimeContainer}>
          <Text style={styles.hajjTime}>{t(item)}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default Heading;

const styles = StyleSheet.create({
  hajjGuideContainer: {
    alignItems: "center",
  },
  hajjGuide: {
    alignSelf: "center",
    width: wp(85),
    height: wp(20),
    alignItems: "center",
    justifyContent: "center",
  },
  hajjTimeContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "89%",
    backgroundColor: Colors.dark,
    height: "55%",
  },
  hajjTime: {
    color: Colors.primary,
    fontSize: wp(5),
  },
});

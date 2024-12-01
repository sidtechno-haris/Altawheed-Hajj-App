import { StyleSheet, View } from "react-native";
import React from "react";
import { hp, wp } from "../../constants/Dimentions";
import Animated, { SlideInDown } from "react-native-reanimated";
import { Background, RoundedButton } from "../../components";

const Intro = ({ navigation }) => {
  return (
    <Background source={require("../../../assets/image.png")}>
      <View style={styles.imageView}>
        <Animated.Image
          entering={SlideInDown.delay(200)}
          style={styles.logo}
          source={require("../../../assets/Logo.png")}
        />
        <Animated.Image
          entering={SlideInDown.delay(300)}
          style={styles.logoText}
          source={require("../../../assets/group1.png")}
        />
      </View>
      <RoundedButton
        rotete={"-40deg"}
        rotateRev={"40deg"}
        delay={400}
        onPress={() => {
          navigation.navigate("Lang");
        }}
      />
    </Background>
  );
};

export default Intro;

const styles = StyleSheet.create({
  imageView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  logo: {
    resizeMode: "cover",
    width: wp(60),
    height: hp(30),
  },
  logoText: {
    resizeMode: "cover",
    width: wp(31),
    height: hp(6.4),
  },
});

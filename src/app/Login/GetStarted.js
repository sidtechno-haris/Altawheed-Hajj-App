import { Image, StyleSheet, View,  ImageBackground, } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";
import { hp, wp } from "../../constants/Dimentions";
import { useTranslation } from "react-i18next";
import { Button } from "../../components";
import Text from "../../components/ScreenComponents/Text";
import { useNavigation } from "@react-navigation/native";
const GetStarted = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const backgroundImage = require("../../../assets/image.png");

  return (
    <ImageBackground 
      source={backgroundImage} 
      style={styles.mainContainer}
      resizeMode="cover"
    >
      <View style={styles.innerContainer}>
        <View style={styles.topLine} />
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
        <View
          // entering={FadeIn.delay(200)}
          style={styles.fadeInContainer}
        >
          <Image
            style={styles.imgCenter}
            source={require("../../../assets/started.png")}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.headText]}>{t("success")}</Text>
          <Text style={[styles.contentText]}>{t("successContent")}</Text>
        </View>
        <Button title={"start"} onPress={() => navigation.push("BottomTabs")} />
      </View>
    </ImageBackground>
  );
};

export default GetStarted;

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    width: '100%',
    height: '100%',
  },

  innerContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: Colors.white,
    borderColor: Colors.dark,
    borderWidth: 1,
    height: hp(80),
    width: wp(85),
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 20,
  },
  images: {
    paddingVertical: 30,
    gap: 5,
    alignItems: "center",
  },
  image: {
    width: wp(30),
    height: wp(30),
    resizeMode: "cover",
  },
  imageSec: {
    width: 80,
    height: 35,
    resizeMode: "cover",
  },
  topLine: {
    marginVertical: 10,
    width: wp(15),
    height: hp(0.6),
    alignSelf: "center",
    borderRadius: 20,
    backgroundColor: Colors.dark,
    position: "absolute",
    top: 10,
  },
  fadeInContainer: {
    marginLeft: 20,
  },
  textContainer: {
    alignItems: "center",
    gap: 5,
  },
  headText: {
    color: Colors.primary,
    textAlign: "center",
    fontSize: wp(6),
  },
  contentText: {
    color: Colors.dark,
    textAlign: "center",
    fontSize: wp(4),
  },

  imgCenter: {
    width: wp(65),
    height: wp(65),
    resizeMode: "cover",
  },
});

import { StyleSheet, ImageBackground } from "react-native";
import React from "react";
import { BottomContainer } from "../../components";
import { useTranslation } from "react-i18next";

const backgroundImage = require("../../../assets/image.png");
const Campaign = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <ImageBackground 
      source={backgroundImage} 
      style={styles.container}
      resizeMode="cover"
    >
      <BottomContainer
        source={require("../../../assets/detail.png")}
        headText={t("campaignTitle")}
        contentText={t("campaignContent")}
        onPress={() => {
          navigation.navigate("Login");
        }}
      />
    </ImageBackground>
  );
};

export default Campaign;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

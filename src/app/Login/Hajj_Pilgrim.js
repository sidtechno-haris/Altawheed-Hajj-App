import { StyleSheet, ImageBackground } from "react-native";
import React from "react";
import { BottomContainer } from "../../components";
import { useTranslation } from "react-i18next";

const backgroundImage = require("../../../assets/image.png");


const Hajj_Pilgrim = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <ImageBackground 
      source={backgroundImage} 
      style={styles.container}
      resizeMode="cover"
    >
      <BottomContainer
        source={require("../../../assets/hajj.png")}
        headText={t("hajjTitle")}
        contentText={t("hajjContent")}
        onPress={() => {
          navigation.navigate("HajjCampaign");
        }}
      />
    </ImageBackground>
  );
};

export default Hajj_Pilgrim;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

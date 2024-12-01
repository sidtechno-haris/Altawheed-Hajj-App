import { Image, ScrollView, StyleSheet, View, Text } from "react-native";
import React from "react";
import { Background, Heading, Loading, ScreensHeader } from "../../components";
import { hp, wp } from "../../constants/Dimentions";
import { Colors } from "../../constants/Colors";
import GlobalStyles from "../../constants/GlobalStyles";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../Api/ApiRoute";
import RenderHTML from "react-native-render-html";
import { useGlobalState } from "../../constants/GlobalStorage";
import { useTranslation } from "react-i18next";

const AboutCompany = () => {
  const url = "aboutus";
  const { t, i18n } = useTranslation();

  const aboutUsField = i18n.language === "en" ? "aboutus_eng" : "aboutus_arb";

  const { token } = useGlobalState();
  const { data, isLoading, error } = useQuery({
    queryKey: ["About"],
    queryFn: () => fetchData(url, token),
    enabled: !!token,
  });

  const tagsStyles = {
    p: {
      padding: 0,
      margin: 0,
      fontSize: wp(3.6),
      color: Colors.primary,
      ...GlobalStyles.Arabic,
    },
    h1: {
      textAlign: "center",
      fontSize: wp(4),
      color: Colors.dark,
      ...GlobalStyles.Arabic,
    },
  };
  const imageUrl = "https://hajjbackend.sidtechno.com/uploads/";

  return (
    <>
      {isLoading && <Loading />}
      <Background
        backgroundColor={Colors.white + 99}
        source={require("../../../assets/image.png")}
      >
        <ScreensHeader Title={t("aboutCompany")} />
        <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
          <Image
            source={
              data?.data?.image
                ? { uri: `${imageUrl}${data?.data.image}` }
                : require("../../../assets/makkah.png")
            }
            style={styles.image}
          />
          <Heading item="aboutCompany" />
          <View style={styles.textContainer}>
            <RenderHTML
              source={{ html: data?.data?.[aboutUsField] }}
              contentWidth={wp(85)}
              tagsStyles={tagsStyles}
            />
          </View>
        </ScrollView>
      </Background>
    </>
  );
};

export default AboutCompany;

const styles = StyleSheet.create({
  image: {
    marginTop: 5,
    width: wp(100),
    height: hp(40),
    resizeMode: "cover",
  },
  textContainer: {
    alignItems: "flex-end",
    flex: 1,
    paddingHorizontal: 20,
    gap: 10,
  },
  detail: {
    fontSize: wp(3.6),
    color: Colors.primary,
    ...GlobalStyles.Arabic,
  },
  Heading: {
    textAlign: "center",
    fontSize: wp(4),
    color: Colors.dark,
    ...GlobalStyles.Arabic,
  },
});

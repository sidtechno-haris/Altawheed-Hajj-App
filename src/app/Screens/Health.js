import { FlatList, Image, StyleSheet, View } from "react-native";
import React from "react";
import {
  Background,
  HealthView,
  Loading,
  ScreensHeader,
} from "../../components";
import { hp, wp } from "../../constants/Dimentions";
import { Colors } from "../../constants/Colors";
import Text from "../../components/ScreenComponents/Text";
import { fetchData } from "../../Api/ApiRoute";
import { useQuery } from "@tanstack/react-query";
import { useGlobalState } from "../../constants/GlobalStorage";
import { useTranslation } from "react-i18next";

const Health = () => {
  const { t } = useTranslation();
  const tipsData = [
    {
      id: 1,
      title: "Stay Hydrated",
      description:
        "Drink plenty of water to avoid dehydration, especially in hot weather.",
    },
    {
      id: 2,
      title: "Wear Comfortable Footwear",
      description:
        "Choose comfortable shoes to prevent blisters and foot pain during long walks.",
    },
  ];

  const { token } = useGlobalState();
  const url = "health";

  const { data, isLoading, error } = useQuery({
    queryKey: ["Health"],
    queryFn: () => fetchData(url, token),
    enabled: !!token,
    keepPreviousData: true,
  });

  console.log("Health", data);

  if (error) {
    return (
      <View style={styles.contentWrapper}>
        <Text>{t("Error loading data")}</Text>
      </View>
    );
  }

  const healthData = data?.data || [];

  return (
    <Background
      source={require("../../../assets/image.png")}
      backgroundColor={"#ffffff99"}
    >
      <ScreensHeader Title={"Health"} />

      {isLoading ? (
        <Loading />
      ) : (
        <View style={styles.flatlistContainer}>
          {healthData.length === 0 ? (
            <View style={styles.contentWrapper}>
              <Image
                style={styles.containerImage}
                source={require("../../../assets/notfound.png")}
              />
              <Text>{t("No health records found.")}</Text>
            </View>
          ) : (
            <FlatList
              removeClippedSubviews={false}
              contentContainerStyle={styles.container}
              data={healthData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <HealthView key={index} item={item} />
              )}
            />
          )}
        </View>
      )}
      <View style={styles.itemContainer}>
        <Text style={styles.containerHeading}>{t("Health Tips")}</Text>
        {tipsData.map((item) => (
          <View key={item.id} style={styles.contentContainer}>
            <Text style={styles.text}>
              <Text style={styles.index}>{t(item.id)} - </Text>
              <Text style={styles.heading}>{t(item.title)} : </Text>
              <Text style={styles.para}>{t(item.description)}</Text>
            </Text>
          </View>
        ))}
      </View>
    </Background>
  );
};

export default Health;

const styles = StyleSheet.create({
  flatlistContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 20,
  },
  container: {
    gap: 10,
    paddingVertical: wp(3),
    paddingHorizontal: wp(5),
  },
  itemContainer: {
    padding: 15,
    height: hp(27),
    alignItems: "center",
  },
  textContainer: {
    paddingVertical: 20,
    flex: 1,
  },
  text: {
    fontSize: wp(3.7),
  },
  index: {
    color: Colors.dark,
  },
  heading: {
    color: Colors.primary,
  },
  para: {
    color: Colors.dark,
  },
  containerHeading: {
    fontSize: wp(6),
    width: "100%",
    color: Colors.primary,
    borderBottomColor: "#D9D9D9",
    borderBottomWidth: 1,
    textAlign: "center",
    paddingBottom: 10,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  containerImage: {
    width: wp(40),
    height: wp(40),
    borderRadius: 50,
  },
});

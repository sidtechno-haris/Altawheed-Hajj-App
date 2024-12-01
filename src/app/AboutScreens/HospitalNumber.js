import {
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";
import { wp } from "../../constants/Dimentions";
import { useTranslation } from "react-i18next";
import { Background, Loading, ScreensHeader } from "../../components";

import { fetchData } from "../../Api/ApiRoute";
import { useQuery } from "@tanstack/react-query";

import { useGlobalState } from "../../constants/GlobalStorage";

const HospitalNumber = () => {
  const { t } = useTranslation();

  const url = "importantContacts?type=past";

  const { token, language } = useGlobalState();

  const { data, isLoading, error } = useQuery({
    queryKey: ["Numbers"],
    queryFn: () => fetchData(url, token),
    enabled: !!token,
  });

  const renderHospitalItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        Linking.openURL(`tel:${item.phoneNumber}`);
      }}
      key={index}
      style={styles.flatlistComp}
    >
      <Text style={styles.text}>{item?.phoneNumber}</Text>
      <Text
        style={[
          styles.textName,
          {
            fontFamily:
              language === "English" ? "Poppins-Medium" : "Cairo-Bold",
          },
        ]}
      >
        {item?.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      {isLoading && <Loading />}
      <Background
        backgroundColor={Colors.white + 99}
        source={require("../../../assets/image.png")}
      >
        <ScreensHeader Title={t("imp")} />

        <FlatList
          removeClippedSubviews={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
          data={data?.data?.contacts}
          keyExtractor={(item, index) => item.phoneNumber + index.toString()}
          renderItem={renderHospitalItem}
        />
      </Background>
    </>
  );
};

export default HospitalNumber;

const styles = StyleSheet.create({
  flatlistComp: {
    padding: 15,
    alignItems: "center",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Colors.bg,
  },
  textName: {
    fontSize: wp(3.6),
    color: Colors.dark,
  },
  text: {
    maxWidth: wp(70),
    fontSize: wp(3.7),
    color: Colors.primary,
    fontFamily: "Cairo-Bold",
  },
});

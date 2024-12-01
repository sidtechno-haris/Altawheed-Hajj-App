import { FlatList } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Background, Heading, ScreensHeader } from "../../components";

const Phone = ({ navigation }) => {
  const { t } = useTranslation();
  const arr = ["Arafa", "Mone", "Pilgrims"];

  return (
    <Background
      backgroundColor={"#ffffff99"}
      source={require("../../../assets/image.png")}
    >
      <ScreensHeader Title={t("imp")} />
      <FlatList
        removeClippedSubviews={false}
        showsHorizontalScrollIndicator={false}
        data={arr}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <Heading
            key={index}
            item={item}
            onPress={() => {
              navigation.navigate("HospitalNumber", { name: item });
            }}
          />
        )}
      />
    </Background>
  );
};

export default Phone;

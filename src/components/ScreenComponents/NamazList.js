import { FlatList, ImageBackground, StyleSheet, Text } from "react-native";
import React from "react";
import { wp } from "../../constants/Dimentions";
import { Colors } from "../../constants/Colors";
import GlobalStyles from "../../constants/GlobalStyles";

const NamazList = ({ time }) => {
  const prayerTimes = [
    {
      id: 1,
      name: "الظهر",
      time: time?.Dhuhr,
    },
    {
      id: 2,
      name: "الشروق",
      time: time?.Sunrise,
    },
    {
      id: 3,
      name: "الفجر",
      time: time?.Fajr,
    },
    {
      id: 4,
      name: "العشاء",
      time: time?.Isha,
    },
    {
      id: 5,
      name: "المغرب",
      time: time?.Maghrib,
    },
    {
      id: 6,
      name: "العصر",
      time: time?.Asr,
    },
  ];

  const renderPrayerTimeItem = ({ item, index }) => (
    <ImageBackground
      key={index}
      resizeMode="contain"
      style={styles.prayerTimeBackground}
      source={require("../../../assets/prayertimebanner.png")}
    >
      <Text style={styles.prayertime}>
        <Text style={styles.prayertimes}>{item.name}</Text> : {item.time}
      </Text>
    </ImageBackground>
  );

  return (
    <FlatList
      removeClippedSubviews={false}
      showsHorizontalScrollIndicator={false}
      scrollEnabled={false}
      contentContainerStyle={styles.flatListContainer}
      numColumns={3}
      data={prayerTimes}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderPrayerTimeItem}
    />
  );
};

export default NamazList;

const styles = StyleSheet.create({
  prayerTimeBackground: {
    marginHorizontal: 2,
    justifyContent: "center",
    alignItems: "center",
    width: wp(32),
    height: wp(11),
  },
  prayertime: {
    fontSize: wp(3.6),
    fontWeight: "600",
    color: Colors.dark,
    ...GlobalStyles.Arabic,
  },
  prayertimes: {
    fontSize: wp(3.2),
    ...GlobalStyles.Arabic,
    color: Colors.dark,
  },
});

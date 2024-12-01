import { Image, StyleSheet, View } from "react-native";
import React from "react";
import * as Icons from "react-native-heroicons/outline";
import { Colors } from "../../constants/Colors";
import { hp, wp } from "../../constants/Dimentions";
import Text from "./Text";
import moment from "moment";

const HealthView = ({ item }) => {
  return (
    <View style={styles.conatiner}>
      <View style={styles.iconContainer}>
        <Icons.ClockIcon color={Colors.primary} size={wp(5)} />
        <Text style={styles.heading}> {item.time}</Text>
      </View>
      <View style={styles.iconContainer}>
        <Icons.CalendarDaysIcon color={Colors.primary} size={wp(5)} />
        <Text style={[styles.text, { paddingHorizontal: 5 }]}>
          {moment(item.date).format("ll")}
        </Text>
      </View>
      <View style={styles.iconContainer}>
        <View
          style={{
            borderRadius: 100,
            backgroundColor: Colors.dark,
            width: wp(3),
            height: wp(3),
            margin: 5,
          }}
        />
        <Text style={styles.text}>Take 2 {item.task[0]}</Text>
      </View>
    </View>
  );
};

export default HealthView;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    borderRadius: 20,
    padding: 10,

    backgroundColor: Colors.white,
    height: hp(10),
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  iconContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",

    gap: 5,
  },
  text: {
    color: Colors.dark,
    fontSize: wp(3.5),
  },
  textContent: {
    color: Colors.dark,
    fontSize: wp(3.8),
  },
  rightContainer: {
    paddingHorizontal: 10,
    flex: 1,
  },
  heading: {
    fontSize: wp(6),
    color: Colors.primary,
  },
  image: {
    position: "absolute",
    right: 10,
    bottom: 10,
    width: wp(10),
    height: wp(5),
  },
});

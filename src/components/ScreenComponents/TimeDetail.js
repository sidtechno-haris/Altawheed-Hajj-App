import { StyleSheet, View } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";
import { wp } from "../../constants/Dimentions";
import Text from "./Text";
import moment from "moment";

const TimeDetail = ({ country, date, terminal, arrival }) => {
  return (
    <View style={styles.timeContent}>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={styles.day}
      >{`${country}... ${moment(date).format("MM/DD/YYYY")}`}</Text>
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.schedule}>
        {arrival}
      </Text>
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.gate}>
        {terminal}
      </Text>
    </View>
  );
};

export default TimeDetail;

const styles = StyleSheet.create({
  timeContent: {
    alignItems: "center",
  },
  day: {
    color: Colors.primary,
    fontSize: wp(2.3),
    maxWidth: wp(32),
  },
  schedule: {
    color: Colors.dark,
    fontSize: wp(2.6),
  },
  gate: {
    color: Colors.dark,
    fontSize: wp(2.3),
  },
});

import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";
import { hp } from "../../constants/Dimentions";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const Loading = () => {
  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(500).delay(300)}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff77",
        zIndex: 2,
      }}
    >
      <ActivityIndicator color={Colors.primary} size={"large"} />
    </Animated.View>
  );
};

export default Loading;

const styles = StyleSheet.create({});

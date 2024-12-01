import { ImageBackground, StyleSheet, View } from "react-native";
import React from "react";
import { hp, wp } from "../../constants/Dimentions";

const Background = ({ children, source, backgroundColor }) => {
  return (
    <ImageBackground
      resizeMode="cover"
      style={[styles.container, StyleSheet.absoluteFillObject]}
      source={source}
    >
      <View style={[styles.Innercontainer, { backgroundColor }]}>
        {children}
      </View>
    </ImageBackground>
  );
};

export default Background;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  Innercontainer: {
    flex: 1,
  },
});

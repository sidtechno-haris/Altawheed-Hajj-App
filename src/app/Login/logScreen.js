import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Background } from "../../components";
import { Colors } from "../../constants/Colors";
import LoginNav from "../../navigation/LoginNav";

const LogScreen = () => {
  return (
    <Background
      source={require("../../../assets/image.png")}
      backgroundColor={"#9b8632"}
    >
      <LoginNav />
    </Background>
  );
};

export default LogScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightbg,
    alignItems: "flex-end",
    flexDirection: "row",
  },
});

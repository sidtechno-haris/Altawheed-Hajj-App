import { Dimensions } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("screen");

export const wp = (percentage) => {
  return (percentage * deviceWidth) / 100;
};

export const hp = (percentage) => {
  return (percentage * deviceHeight) / 100;
};

export const imageUrl = "https://hajjbackend.sidtechno.com/uploads/";

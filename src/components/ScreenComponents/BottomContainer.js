import { Image, StyleSheet, View } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";
import { hp, wp } from "../../constants/Dimentions";
import RoundedButton from "./RoundedButton";
import Text from "./Text";

const BottomContainer = ({ source, headText, contentText, onPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={source}
          resizeMode="cover"
          style={[styles.backgroundImage, StyleSheet.absoluteFillObject]}
        />
        <View style={styles.topLine} />
      </View>
      <View style={styles.content}>
        <View style={{ gap: 10 }}>
          <Text style={[styles.headText]}>{headText}</Text>
          <View style={styles.line} />
          <Text style={[styles.contentText]}>{contentText}</Text>
        </View>
        <RoundedButton
          onPress={onPress}
          rotete={"60deg"}
          rotateRev={"-60deg"}
        />
      </View>
    </View>
  );
};

export default BottomContainer;

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    backgroundColor: Colors.white + 88,
    height: hp(80),
    width: wp(85),
  },
  imageContainer: {
    flex: 1,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    opacity: 0.5,
  },
  topLine: {
    marginVertical: 10,
    width: wp(15),
    height: hp(0.6),
    alignSelf: "center",
    borderRadius: 20,
    backgroundColor: Colors.dark,
    position: "absolute",
    top: 10,
  },
  content: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.gray,
  },
  headText: {
    fontFamily: "SquadaOne-Regular",
    color: Colors.white,
    textAlign: "center",
    fontSize: wp(5.5),
    marginTop: 5,
  },
  line: {
    width: wp(70),
    borderRadius: 20,
    height: hp(0.2),
    backgroundColor: Colors.primary,
  },
  contentText: {
    paddingHorizontal: 20,
    color: Colors.dark,
    textAlign: "center",
    fontSize: wp(3.5),
  },
});

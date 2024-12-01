import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../constants/Colors";
import { wp } from "../../constants/Dimentions";
import Text from "./Text";

const Size = 60;

export default function ChatListComp({ item, index }) {
  const navigation = useNavigation();

  const image = "https://api.ahle.chat/uploads/";
  return (
    <TouchableOpacity
      key={index}
      activeOpacity={0.6}
      onPress={() => {
        navigation.navigate("Chat", { user: item });
      }}
    >
      <View style={styles.mainContainer}>
        <TouchableOpacity activeOpacity={0.7}>
          <Image
            style={styles.Image}
            source={
              require("../../../assets/default.jpg") || {
                uri: `${image}${item.images[0]}`,
                cache: "force-cache",
              }
            }
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            justifyContent: "space-evenly",
            marginLeft: 5,
            padding: 3,
            height: 60,
          }}
        >
          <View style={styles.LeftRightContainer}>
            <Text numberOfLines={1} style={styles.Name}>
              {item.name}
            </Text>
            <Text style={styles.Date}>
              {moment(item?.timestamp, true).fromNow(true)}
            </Text>
          </View>
          <View style={styles.LeftRightContainer}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: wp(3.5),
                maxWidth: "90%",
                color: Colors.dark,
                textAligh: "center",
              }}
            >
              {item.lastMessage}
              {item.seen ? (
                <Image
                  source={require("../../../assets/seen.png")}
                  style={{
                    width: 30,
                    height: 15,
                    resizeMode: "contain",
                    tintColor: Colors.primary,
                  }}
                />
              ) : (
                <Image
                  source={require("../../../assets/check.png")}
                  style={{
                    width: 30,
                    height: 15,
                    resizeMode: "contain",
                    tintColor: Colors.dark,
                  }}
                />
              )}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    width: wp(95),
    paddingHorizontal: 5,
    height: 80,
    marginVertical: 1,
    borderRadius: 20,
    backgroundColor: "#ffffFf77",
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  Image: {
    width: Size,
    height: Size,
    borderRadius: Size,
    backgroundColor: "#00000034",
  },
  LeftRightContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  Name: {
    color: Colors.dark,
    fontSize: wp(4),
  },
  Date: { color: Colors.dark, fontSize: wp(3) },
});

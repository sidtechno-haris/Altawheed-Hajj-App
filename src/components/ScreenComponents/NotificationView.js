import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { wp } from "../../constants/Dimentions";
import { Colors } from "../../constants/Colors";
import { useGlobalState } from "../../constants/GlobalStorage";

const NotificationView = ({ title, content, viewed }) => {
  const { language } = useGlobalState();

  return (
    <TouchableOpacity style={styles.ContactView} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.imageUser}
          source={require("../../../assets/Logo.png")}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.contentViewtext,
            {
              fontFamily:
                language === "English" ? "Poppins-Bold" : "Cairo-Bold",
            },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.contacts,
            {
              fontFamily:
                language === "English" ? "Poppins-Medium" : "Cairo-Bold",
            },
          ]}
        >
          {content}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationView;

const styles = StyleSheet.create({
  ContactView: {
    width: wp(90),
    borderRadius: 15,
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
    backgroundColor: Colors.white,
    gap: 10,
  },
  imageContainer: {
    backgroundColor: Colors.dark,
    borderRadius: 50,
    padding: 10,
  },

  imageUser: {
    width: wp(10),
    height: wp(10),
    borderRadius: 50,
    resizeMode: "cover",
  },
  contentViewtext: {
    color: "#000",
    fontSize: wp(4),
  },
  contacts: {
    color: Colors.content,
    fontSize: wp(3),
  },
});

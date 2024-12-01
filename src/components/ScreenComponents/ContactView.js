import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { imageUrl, wp } from "../../constants/Dimentions";
import { Colors } from "../../constants/Colors";
import { useTranslation } from "react-i18next";
import Text from "./Text";

const ContactView = ({ url, text, number, onPress, location, distance }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  return (
    <TouchableOpacity
      key={`${url}${text}`}
      onPress={onPress}
      style={[
        styles.ContactView,
        { flexDirection: isArabic ? "row-reverse" : "row" },
      ]}
    >
      <View
        style={[
          styles.container,
          {
            flexDirection: isArabic ? "row-reverse" : "row",
          },
        ]}
      >
        {text === "General" ? (
          <View style={styles.imageView}>
            <Image source={url} style={styles.image} />
          </View>
        ) : (
          <Image
            style={styles.imageUser}
            source={
              url
                ? { uri: `${imageUrl}${url}` } || url
                : require("../../../assets/default.jpg")
            }
          />
        )}
        <Text style={[styles.contentViewtext]}>
          {text ? t(text) || distance : "User"}
        </Text>
      </View>
      <Text style={[styles.contacts]}>{number || location}</Text>
    </TouchableOpacity>
  );
};

export default ContactView;

const styles = StyleSheet.create({
  ContactView: {
    borderRadius: 15,
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.2,
    padding: 10,
    borderColor: Colors.primary,
    backgroundColor: "#fff",
  },

  container: {
    gap: 10,
    alignItems: "center",
  },
  imageView: {
    padding: 15,
    borderRadius: 50,
    backgroundColor: Colors.primary,
  },
  image: {
    width: wp(4),
    height: wp(4),
  },
  imageUser: {
    width: wp(11),
    height: wp(11),
    borderRadius: 50,
    resizeMode: "cover",
    backgroundColor: "#00000055",
  },
  contentViewtext: {
    color: Colors.dark,
    fontSize: wp(4),
    fontWeight: "600",
  },
  contacts: {
    color: Colors.contact,
    fontSize: wp(3),
    fontWeight: "500",
  },
});

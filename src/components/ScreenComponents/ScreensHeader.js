import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text as TEXT,
} from "react-native";
import React from "react";
import * as Icons from "react-native-heroicons/outline";
import { Colors } from "../../constants/Colors";
import { wp } from "../../constants/Dimentions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Text from "./Text";
import { useTranslation } from "react-i18next";
import { useGlobalState } from "../../constants/GlobalStorage";

const ScreensHeader = ({ Title, circle, add, onPress, chat, image }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const { language } = useGlobalState();

  return (
    <View
      style={[
        styles.container,
        { marginTop: top, flexDirection: isArabic ? "row-reverse" : "row" },
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={[
          styles.containerTouchable,
          {
            flexDirection: isArabic ? "row-reverse" : "row",
          },
        ]}
      >
        {isArabic ? (
          <Icons.ChevronRightIcon color={Colors.icons} size={wp(6)} />
        ) : (
          <Icons.ChevronLeftIcon color={Colors.icons} size={wp(6)} />
        )}
        <TEXT
          style={[
            styles.textBack,

            {
              fontFamily:
                language === "English" ? "Poppins-Medium" : "Cairo-Bold",
            },
          ]}
        >
          {t("back")}
        </TEXT>
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.textTitle}>{t(Title)}</Text>
      </View>

      {add ? (
        <TouchableOpacity onPress={onPress} style={styles.textButtonContainer}>
          <Icons.PlusIcon color={Colors.primary} size={wp(3)} strokeWidth={2} />
          <Text style={styles.textButton}>{t(circle)}</Text>
        </TouchableOpacity>
      ) : chat ? (
        <View style={styles.chatIconContainer}>
          <Image
            source={
              image ? { uri: image } : require("../../../assets/default.jpg")
            }
            style={styles.chatIcon}
          />
        </View>
      ) : (
        <View style={styles.emptyContainer} />
      )}
    </View>
  );
};

export default ScreensHeader;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Colors.icons + "22",
  },
  containerTouchable: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  textTitle: {
    fontSize: wp(6),
    color: Colors.primary,
    textAlign: "center",
  },
  textButton: {
    fontSize: wp(3.2),
    color: Colors.primary,
  },
  textBack: {
    color: "#414141",
    fontSize: wp(2.7),
    paddingLeft: 5,
  },
  textButtonContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  chatIconContainer: {
    borderRadius: 100,
    paddingRight: 5,
  },
  chatIcon: {
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: "#fff",
  },
  emptyContainer: {
    width: wp(10),
  },
});

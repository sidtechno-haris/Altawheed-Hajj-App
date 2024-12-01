import {
  Image,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import * as Icons from "react-native-heroicons/outline";
import { Colors } from "../../constants/Colors";
import { hp, wp } from "../../constants/Dimentions";
import { Background, LanguageSelector } from "../../components";
import { useMMKVString } from "react-native-mmkv";
import { Storage } from "../../constants/Store/mmkv";
import { useTranslation } from "react-i18next";
import Text from "../../components/ScreenComponents/Text";

const LanguageSelect = ({ navigation }) => {
  const [selected, setSelected] = useMMKVString("language", Storage);
  const { t } = useTranslation();

  useEffect(() => {
    if (!selected) {
      setSelected("English");
    }
  }, [selected, setSelected]);

  return (
    <Background source={require("../../../assets/bg2.png")}>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require("../../../assets/Logo.png")}
        />
        <View style={styles.flagContainer}>
          <Text style={styles.text}>{t("Select Language")}</Text>
          <LanguageSelector selected={selected} setSelected={setSelected} />
          <View style={styles.touchableContainer}>
            <TouchableOpacity
              onPress={() => {
                if (selected.length == "") {
                  ToastAndroid.showWithGravity(
                    t("Select language to continue"),
                    ToastAndroid.CENTER,
                    ToastAndroid.SHORT
                  );
                } else {
                  navigation.navigate("logScreen");
                }
              }}
              style={styles.touchable}
              accessibilityLabel={t("Proceed to Hajj Pilgrim")}
              accessibilityHint={t("Navigate to the Hajj Pilgrim screen")}
            >
              {selected === "English" ? (
                <Icons.ArrowRightIcon
                  size={wp(5)}
                  color="#fff"
                  strokeWidth={2}
                />
              ) : (
                <Icons.ArrowLeftIcon
                  size={wp(5)}
                  color="#fff"
                  strokeWidth={2}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Background>
  );
};

export default LanguageSelect;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(8),
  },
  image: {
    resizeMode: "cover",
    width: wp(50),
    height: hp(25),
  },
  flagContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  text: {
    fontFamily: "SquadaOne-Regular",
    color: Colors.dark,
    fontSize: wp(7),
    paddingVertical: 10,
  },
  touchableContainer: {
    marginVertical: wp(4),
    borderRadius: wp(50),
    padding: 2,
    width: wp(15),
    height: wp(15),
    borderWidth: 2,
    transform: [{ rotate: "-20deg" }],
    borderTopColor: Colors.borderlight,
    borderBottomColor: Colors.borderlight,
    borderRightColor: Colors.dark,
    borderLeftColor: Colors.borderlight,
  },
  touchable: {
    transform: [{ rotate: "20deg" }],
    width: wp(13),
    height: wp(13),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp(50),
    backgroundColor: Colors.dark,
  },
});

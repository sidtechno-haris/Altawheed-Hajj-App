import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text as TEXT,
} from "react-native";
import React, { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { wp } from "../../constants/Dimentions";
import { Colors } from "../../constants/Colors";
import { Background, Button, ScreensHeader } from "../../components";
import Text from "../../components/ScreenComponents/Text";
import { useGlobalState } from "../../constants/GlobalStorage";

const Sos = ({ navigation }) => {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState(null);
  const { language } = useGlobalState();

  const data = [
    {
      text: "Medical",
      uri: require("../../../assets/bag.png"),
      color: "#DBE790",
    },
    {
      text: "Fire",
      uri: require("../../../assets/fire.png"),
      color: "#F5A6A6",
    },
    {
      text: "Accident",
      uri: require("../../../assets/hit.png"),
      color: "#D4CEFA",
    },
    {
      text: "Violence",
      uri: require("../../../assets/knife.png"),
      color: "#F5A6DF",
    },
  ];

  return (
    <Background
      backgroundColor={Colors.white + 99}
      source={require("../../../assets/image.png")}
    >
      <ScreensHeader Title={"SOS"} />
      <View style={styles.emergency}>
        <View style={styles.emergencyCont}>
          <Text style={styles.text}>{t("emrgncy")}</Text>
          <TEXT
            style={[
              styles.textPara,
              {
                fontFamily:
                  language === "English" ? "Poppins-Medium" : "Cairo-Bold",
              },
            ]}
          >
            {t("emrgncyContent")}
          </TEXT>
        </View>

        <Image
          style={styles.amico}
          source={require("../../../assets/amico.png")}
        />
      </View>
      <View style={styles.frameContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onLongPress={() => {
            navigation.navigate("CallingEmergency");
          }}
        >
          <Image
            style={styles.frame}
            source={require("../../../assets/Frame.png")}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.iconCont}>
        <Text style={styles.textCont}>{t("Whats")}</Text>
        <View style={styles.iconList}>
          {data.map((item) => (
            <TouchableOpacity
              key={item.text}
              style={[
                styles.iconContainer,
                selectedItem === item.text && styles.selectedIconContainer,
              ]}
              onPress={() => setSelectedItem(item.text)}
            >
              <View
                style={{
                  borderRadius: 50,
                  backgroundColor: item.color,
                  padding: 6,
                }}
              >
                <Image style={styles.icons} source={item.uri} />
              </View>
              <TEXT
                style={[
                  styles.iconText,
                  {
                    fontFamily:
                      language === "English" ? "Poppins-Medium" : "Cairo-Bold",
                  },
                ]}
              >
                {t(item.text)}
              </TEXT>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={"circle"}
          onPress={() => navigation.navigate("EmergencyCircle")}
        />
      </View>
    </Background>
  );
};

export default memo(Sos);

const styles = StyleSheet.create({
  emergency: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  emergencyCont: {
    flex: 1,
  },
  amico: {
    width: wp(35),
    height: wp(35),
    resizeMode: "contain",
  },
  text: {
    maxWidth: "90%",
    fontSize: wp(5),
    color: Colors.font,
  },
  textPara: {
    fontSize: wp(3.3),
    color: Colors.font,
    lineHeight: wp(5),
    maxWidth: "90%",
    letterSpacing: 1.1,
  },
  frameContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    width: "90%",
    alignSelf: "center",
  },
  frame: {
    width: wp(60),
    height: wp(60),
    resizeMode: "contain",
    elevation: 5,
  },
  iconCont: {
    padding: 20,
    gap: 10,
  },
  textCont: {
    fontSize: wp(3.9),
    color: Colors.dark,
  },
  iconList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 50,
    gap: 10,
  },
  selectedIconContainer: {
    backgroundColor: Colors.primary + "20", // Light overlay for selected items
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  icons: {
    width: wp(4),
    height: wp(4),
    resizeMode: "cover",
  },
  iconText: {
    fontSize: wp(3.5),
    color: Colors.dark,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: wp(20),
  },
});

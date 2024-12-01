import React, { useEffect, useState } from "react";
import { WebView } from "react-native-webview";
import axios from "axios"; // Ensure axios is installed or use fetch API
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { Background, ScreensHeader } from "../../components";
import { hp, wp } from "../../constants/Dimentions";
import { Colors } from "../../constants/Colors";
import GlobalStyles from "../../constants/GlobalStyles";
import * as Progress from "react-native-progress";
import { useTranslation } from "react-i18next";
import { useGlobalState } from "../../constants/GlobalStorage";

const LiveStream = ({ route }) => {
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const { token, language } = useGlobalState();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchYoutubeLink = async () => {
      try {
        const response = await axios.get(
          "https://hajjbackend.sidtechno.com/getYoutubeLink",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status && response.data.data.link) {
          setYoutubeUrl(response.data.data.link);
        } else {
          console.error("Failed to fetch the YouTube link");
        }
      } catch (error) {
        console.error("Error fetching YouTube link:", error);
      }
    };

    fetchYoutubeLink();
  }, []);

  return (
    <Background
      source={require("../../../assets/image.png")}
      backgroundColor={"#ffffff98"}
    >
      <ScreensHeader Title={t("Live Stream")} />
      {youtubeUrl && (
        <WebView
          style={styles.webview}
          source={{ uri: youtubeUrl }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
        />
      )}
    </Background>
  );
};

export default LiveStream;

const styles = StyleSheet.create({
  timeList: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    height: hp(10),
  },
  timeContainer: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#E0E0E0",
  },
  selectedTimeContainer: {
    backgroundColor: "#E0E0E0",
    top: 20,
    borderRadius: 70,
    width: 70,
    alignItems: "center",
  },
  timeText: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: "700",
  },
  selectedTimeText: {
    color: Colors.dark,
    fontWeight: "bold",
    fontSize: 18,
  },
  Content: {
    fontSize: wp(4),
    color: Colors.dark,
    ...GlobalStyles.CustomFonts,
  },
  tawafContainer: {
    marginTop: hp(4),
    alignItems: "center",
    gap: 5,
  },
  Raw: {
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  Image: {
    height: hp(5),
    width: wp(30),
    resizeMode: "cover",
  },
  TawafText: {
    position: "absolute",
    alignSelf: "center",
    top: 6,
    fontSize: wp(6.3),
    color: Colors.dark,
    ...GlobalStyles.CustomFonts,
  },
  progressText: {
    fontSize: wp(5),
    color: Colors.primary,
    ...GlobalStyles.CustomFonts,
  },
  ProgressContainer: {
    alignSelf: "center",
    gap: 10,
    marginVertical: 20,
  },
});

import React, { useState } from "react";
import {
  Alert,
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { hp, wp } from "../../constants/Dimentions";
import { useTranslation } from "react-i18next";
import Text from "../../components/ScreenComponents/Text";
import {
  isLocationEnabled,
  promptForEnableLocationIfNeeded,
} from "react-native-android-location-enabler";
import Geolocation from "@react-native-community/geolocation";
import { fetchDataWithPut } from "../../Api/ApiRoute";
import { useMMKVString } from "react-native-mmkv";
import { Storage } from "../../constants/Store/mmkv";
import { Loading } from "../../components";

const backgroundImage = require("../../../assets/image.png");

const EnableLocation = ({ navigation }) => {
  const { t } = useTranslation();
  const [token] = useMMKVString("token", Storage);
  const [loading, setLoading] = useState(false);

  const getUserPosition = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log("position", position);

        fetchDataWithPut(
          "setUserCurrentLocation",
          {
            lat: position?.coords.latitude,
            long: position?.coords.longitude,
          },
          token
        );
      },

      (error) => {
        ToastAndroid.show("Enable your location", ToastAndroid.SHORT);
      },
      {
        enableHighAccuracy: true,
      }
    );
  };

  const requestLocationPermissionAndEnableGPS = async () => {
    if (Platform.OS === "android") {
      try {
        const isGPSEnabled = await isLocationEnabled();
        if (!isGPSEnabled) {
          await promptForEnableLocationIfNeeded();
        }

        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        // Navigate based on permission result
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getUserPosition();
          setLoading(true);
          setTimeout(() => {
            navigation.navigate("GetStarted");
            setLoading(false);
          }, 3000);
        } else {
          Alert.alert(
            t("Permission Denied"),
            t("Location permission is required to show your current location on the map.")
          );
          handleOpenSettings();
          // navigation.navigate("GetStarted");
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const handleOpenSettings = () => {
    Linking.openSettings(); // Directly open settings for manual location selection
  };

  return (
    <>
      {loading && <Loading />}
      <ImageBackground 
        source={backgroundImage} 
        style={styles.mainContainer}
        resizeMode="cover"
      >
      <View style={styles.innerContainer}>
        <View style={styles.topLine} />
        <View style={styles.headerContainer}>
          <Text style={styles.headText}>{t("Enable Your Location")}</Text>
          <Image
            source={require("../../../assets/enable.png")}
            style={styles.enableImage}
          />
        </View>
        <View style={styles.align}>
          <Text style={styles.contentText}>
            {t(
              "Choose your location to start finding the requests around you."
            )}
          </Text>
          <TouchableOpacity
            onPress={requestLocationPermissionAndEnableGPS}
            style={styles.direction}
          >
            <Image
              source={require("../../../assets/path.png")}
              style={styles.icon}
            />
            <Text style={styles.current}>{t("Use current location")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOpenSettings}>
            <Text style={[styles.contentText, styles.linkText]}>
              {t("Select it manually")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </ImageBackground>
    </>
  );
};

export default EnableLocation;

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    width: '100%',
    height: '100%',
  },
  innerContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: Colors.white,
    borderColor: Colors.dark,
    borderWidth: 1,
    height: hp(80),
    width: wp(85),
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
    alignSelf: "center",
    position: "absolute",
    bottom: 0,
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
  headerContainer: {
    gap: 20,
    alignItems: "center", // Center the text and image
  },
  headText: {
    color: Colors.primary,
    textAlign: "center",
    fontSize: wp(6),
  },
  contentText: {
    color: Colors.dark,
    textAlign: "center",
    fontSize: wp(4.6),
    maxWidth: "80%",
  },
  enableImage: {
    width: wp(70),
    height: wp(50),
    resizeMode: "contain",
  },
  align: {
    height: "50%",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  direction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 15,
    borderColor: Colors.primary,
    borderWidth: 2,
    paddingVertical: 15,
    paddingHorizontal: wp(15),
  },
  icon: {
    width: 20,
    height: 20,
  },
  current: {
    fontSize: wp(4.4),
    color: Colors.primary,
  },
  linkText: {
    textDecorationLine: "underline",
  },
});

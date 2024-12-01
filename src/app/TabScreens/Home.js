import React, { memo, useEffect, useState, useCallback } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
  RefreshControl,
  Alert,
  ScrollView,
} from "react-native";
import {
  Background,
  Header,
  TopIcons,
  TimeDetail,
  Loading,
} from "../../components";
import { hp, wp } from "../../constants/Dimentions";
import { Colors } from "../../constants/Colors";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "../../components/ScreenComponents/Text";
import NamazList from "../../components/ScreenComponents/NamazList";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../Api/ApiRoute";

import Geolocation from "@react-native-community/geolocation";
import { useGlobalState } from "../../constants/GlobalStorage";
import Geocoder from "react-native-geocoding";
import io from "socket.io-client";
import { Storage } from "../../constants/Store/mmkv";
import { useMMKVObject, useMMKVString } from "react-native-mmkv";
import {
  isLocationEnabled,
  promptForEnableLocationIfNeeded,
} from "react-native-android-location-enabler";

const ASSETS = {
  background: require("../../../assets/image.png"),
  earth: require("../../../assets/earth.png"),
  plane: require("../../../assets/plane.png"),
  mike: require("../../../assets/mike.png"),
  tracker: require("../../../assets/tracker.png"),
  health: require("../../../assets/health.png"),
  crowd: require("../../../assets/crowd.png"),
  prayerTimes: require("../../../assets/prayertimes.png"),
  route: require("../../../assets/route.png"),
};

// AIzaSyD-G6hsyDfszCePMV3k5wm0aE0r0NBJDpg

const Home = () => {
  const isFocused = useIsFocused();
  Geocoder.init("AIzaSyD-G6hsyDfszCePMV3k5wm0aE0r0NBJDpg");

  const { setToken, setLanguage, address, setAddress, setCordinate } =
    useGlobalState();
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation();
  const [coordinate, setCoordinate] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  // const [socketConnect, setSocketConnect] = useState(null);
  const [storeLogin] = useMMKVObject("login", Storage);

  const [token] = useMMKVString("token", Storage);
  const [selected] = useMMKVString("language", Storage);
  const userId = storeLogin?.user?._id;

  useEffect(() => {
    enableGps();
  }, [token, isFocused]);

  // const socket = io("https://hajjbackend.sidtechno.com/"); // Adjust to your backend server URL
  // useEffect(() => {
  //   socket.on("connection", () => {
  //     console.log("Connected to socket server");
  //   });

  //   socket.on("connect", () => {
  //     console.log("Connected to socket server");
  //     setSocketConnect(socket);
  //   });

  //   // Cleanup on component unmount
  //   return () => socket.disconnect();
  // }, [token]);

  function getCountryIdentifier(countryName) {
    if (!countryName || typeof countryName !== "string") return "";

    // Split the country name into words
    const words = countryName.trim().split(/\s+/);

    if (words.length === 1) {
      // Single-word country: Return the first 3 letters
      return words[0].substring(0, 3).toUpperCase();
    } else {
      // Multi-word country: Get initials of each word
      return words.map((word) => word[0].toUpperCase()).join("");
    }
  }

  const enableGps = useCallback(async () => {
    const isGPSEnabled = await isLocationEnabled();
    if (isGPSEnabled === true) return;
    try {
      if (Platform.OS === "android") {
        const isGPSEnabled = await isLocationEnabled();
        if (!isGPSEnabled) {
          await promptForEnableLocationIfNeeded();
        }
      }
    } catch (error) {
      console.error("GPS Error:", error);
    }
  }, []);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        setCoordinate({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
        setCordinate({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      },

      (error) => {
        console.log(error);
        enableGps();
        ToastAndroid.show("Enable your location", ToastAndroid.SHORT);
      },
      {
        enableHighAccuracy: true,
        useSignificantChanges: true,
      }
    );
  }, [token, isFocused]);

  useEffect(() => {
    const location = async () => {
      if (coordinate) {
        try {
          const geocodeResult = await Geocoder.from(
            coordinate?.lat,
            coordinate?.long
          );

          const formattedAddress = geocodeResult?.results[0].formatted_address;

          setAddress(formattedAddress);
        } catch (error) {
          Alert.alert("Geocoding Error", "Failed to fetch address.");
        }
      }
    };
    location();
  }, [isFocused, enableGps]);

  // const watchPosition = useCallback(async () => {
  //   Geolocation.watchPosition(
  //     (position) => {
  //       if (socketConnect) {
  //         socket.emit("sendLocation", {
  //           userId: userId,
  //           lat: position?.coords.latitude,
  //           long: position?.coords.longitude,
  //         });
  //       }
  //     },
  //     (error) => {
  //       ToastAndroid.show("Enable your location", ToastAndroid.SHORT);
  //     },
  //     {
  //       enableHighAccuracy: true,
  //       distanceFilter: 0,
  //       interval: 10000, // Update every 10 seconds
  //       fastestInterval: 5000,
  //       d,
  //     }
  //   );
  // }, [socketConnect, socket, userId]);

  // useEffect(() => {
  //   watchPosition();
  // }, [isFocused]);

  useEffect(() => {
    setToken(token);
    setLanguage(selected);
  }, []);

  const airLine = `homepage/${userId}`;
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["home"],
    queryFn: () => fetchData(airLine, token),
    enabled: !!token && !!userId,
    retry: false,
    keepPreviousData: true,
    experimental_prefetchInRender: true,
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  useEffect(() => {
    if (error) {
      ToastAndroid.show("Network Connection Error", ToastAndroid.SHORT);
    }
  }, [error]);

  const renderTopIcon = React.useCallback(
    (text, source, items) => (
      <TopIcons text={text} source={source} key={text} items={items} />
    ),
    []
  );

  return (
    <>
      {isLoading && <Loading />}

      <Background
        backgroundColor={Colors.white + 99}
        source={ASSETS.background}
      >
        <ScrollView
          removeClippedSubviews={false}
          contentContainerStyle={{ paddingTop: top }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              progressViewOffset={40}
            />
          }
        >
          <Header title={storeLogin?.user?.firstname} location={address} />
          <View style={styles.iconContainer}>
            {renderTopIcon("Accommodation", ASSETS.plane)}
            {renderTopIcon("Campaign", ASSETS.mike)}
            {renderTopIcon("Tracking", ASSETS.tracker)}
            {renderTopIcon("Health", ASSETS.health)}
            {renderTopIcon("Live Stream", ASSETS.crowd)}
          </View>

          <ImageBackground
            blurRadius={2}
            style={styles.image}
            source={ASSETS.earth}
          >
            <View style={styles.countryTags}>
              <Text style={styles.TextCountry}>
                {getCountryIdentifier(
                  data?.airlineDetails?.departure?.departureCountry
                )}
              </Text>
              <Text style={styles.TextCountry}>
                {data?.airlineDetails?.return
                  ? getCountryIdentifier(
                      data?.airlineDetails?.return?.returnCountry
                    )
                  : getCountryIdentifier(
                      data?.airlineDetails?.connecting?.connectingCountry
                    )}
              </Text>
            </View>
            <Text style={styles.heading}>
              {data?.airlineDetails?.departure.departureAirLine}
            </Text>

            <View style={styles.timeContainer}>
              {!data?.airlineDetails && (
                <View style={styles.Process}>
                  <Text style={styles.ProcessTime}>{t("Processing...")}</Text>
                </View>
              )}
              {data?.airlineDetails && (
                <>
                  <TimeDetail
                    country={data?.airlineDetails?.departure?.departureCountry}
                    date={data?.airlineDetails?.departure?.departureDate}
                    terminal={`Terminal- ${data?.airlineDetails?.departure?.departureAirPortTerminal}`}
                    arrival={`Scheduled Departure ${data?.airlineDetails?.departure?.departureTime}`}
                  />
                  <View>
                    <Text style={[styles.nonstop, { opacity: 0 }]}>
                      7 Hours (Nonstop)
                    </Text>
                    <View style={styles.innerContainer}>
                      <View style={styles.circle} />
                      <View style={styles.line} />
                      <View style={styles.circle} />
                    </View>
                    <Text style={styles.nonstop}>
                      7 Hours{" "}
                      {`(${data?.airlineDetails?.departure.journeyType})`}
                    </Text>
                  </View>
                  <TimeDetail
                    country={
                      data?.airlineDetails?.return
                        ? data?.airlineDetails?.return?.returnCountry
                        : data?.airlineDetails?.connecting?.connectingCountry
                    }
                    date={data?.airlineDetails?.return?.returnDate}
                    terminal={`Terminal- ${data?.airlineDetails?.connecting?.connectingDepartureAirPortTerminal}`}
                    arrival={`Scheduled Arrival ${
                      data?.airlineDetails?.return?.returnTime ||
                      data?.airlineDetails?.connecting?.connectingDepartureTime
                    }`}
                  />
                </>
              )}
            </View>
          </ImageBackground>

          <View style={styles.prayerContainer}>
            <ImageBackground
              style={styles.prayerBack}
              resizeMode="contain"
              source={ASSETS.prayerTimes}
            >
              <Text style={styles.time}>{t("Times")}</Text>
            </ImageBackground>
            <Text style={styles.month}>{data?.currentDate}</Text>
          </View>

          <NamazList time={data?.prayerTimes} />

          <View style={styles.hajjGuideContainer}>
            <ImageBackground
              style={styles.hajjGuide}
              resizeMode="contain"
              source={ASSETS.prayerTimes}
            >
              <View style={styles.hajjTimeContainer}>
                <Text style={styles.hajjTime}>{t("guide")}</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("HajjGuide");
                  }}
                >
                  <Text style={styles.view}>{t("View More")}</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
            <Image style={styles.bottomImage} source={ASSETS.route} />
          </View>
        </ScrollView>
      </Background>
    </>
  );
};

export default memo(Home);

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bg,
  },
  image: {
    width: wp(100),
    height: hp(25),
    justifyContent: "space-between",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 15,
    marginHorizontal: 10,
    height: 55,
    borderColor: Colors.dark,
    backgroundColor: Colors.secondary,
    gap: 10,
    overflow: "hidden",
  },
  heading: {
    color: Colors.dark,
    padding: 10,
    fontSize: wp(7),
    maxWidth: "50%",
  },
  prayerContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    width: wp(80),
    justifyContent: "center",
    alignSelf: "center",
  },
  prayerBack: {
    width: "100%",
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  time: {
    color: Colors.primary,
    fontSize: wp(5),
  },
  month: {
    alignSelf: "center",
    color: Colors.dark,
    fontSize: wp(2.9),
    paddingTop: 5,
  },
  hajjGuideContainer: {
    alignItems: "center",
  },
  hajjGuide: {
    alignSelf: "center",
    width: wp(80),
    height: wp(16),
    alignItems: "center",
    justifyContent: "center",
  },
  hajjTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    width: "89%",
    backgroundColor: Colors.dark,
    height: "60%",
  },
  hajjTime: {
    color: Colors.primary,
    fontSize: wp(5),
  },
  bottomImage: {
    width: wp(98),
    height: hp(20),
    marginLeft: 10,
    resizeMode: "contain",
    alignSelf: "center",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: Colors.dark,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.primary,
  },
  nonstop: {
    fontSize: wp(3),
    color: Colors.dark,
    alignSelf: "center",
  },
  view: {
    fontSize: wp(2.7),
    color: "#fff",
  },
  Process: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.primary + "99",
    zIndex: 20,
    paddingTop: 10,
  },
  ProcessTime: {
    color: Colors.white,
    fontSize: wp(5),
    textAlign: "center",
    textAlignVertical: "center",
  },
  countryTags: {
    position: "absolute",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    bottom: 85,
    gap: 60,
  },
  TextCountry: {
    fontSize: wp(3.3),
    color: Colors.dark,
    fontWeight: "bold",
  },
});

import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  CalendarDaysIcon,
  ChevronDownIcon,
  MapPinIcon,
} from "react-native-heroicons/solid";
import { Colors } from "../../constants/Colors";
import { wp } from "../../constants/Dimentions";
import { prayerTimes } from "../../utils/prayer";
import { Calendar } from "react-native-calendars";
import { Background, Heading, Loading, ScreensHeader } from "../../components";
import GlobalStyles from "../../constants/GlobalStyles";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Text from "../../components/ScreenComponents/Text";
import NamazList from "../../components/ScreenComponents/NamazList";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../Api/ApiRoute";
import { useGlobalState } from "../../constants/GlobalStorage";
import { ScrollView } from "react-native-gesture-handler";
import moment from "moment";

const PrayerTime = () => {
  const date = moment().date();

  const { t } = useTranslation();
  const [selected, setSelected] = useState("");
  const [selectedDate, setSelectedDate] = useState(date);
  const animatedVal = useSharedValue(0);
  const { address, cordinate } = useGlobalState();
  const [selectedAddress, setSelectedAddress] = useState(address);
  const [detect, setDetect] = useState(cordinate);

  useEffect(() => {
    setDetect(keys[0]);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      animatedVal.value,
      [0, 1],
      [40, 180],
      Extrapolation.CLAMP
    );
    return {
      height,
    };
  });

  const keys = [
    {
      name: address,
      lat: cordinate?.lat,
      long: cordinate?.long,
    },
    {
      name: "Makkah",
      lat: 39.8173,
      long: 21.4241,
    },
    {
      name: "Madina",
      lat: 24.4672,
      long: 39.6024,
    },
    {
      name: "Arafat",
      lat: 21.3543,
      long: 39.983,
    },
  ];

  const toggleCollapse = () => {
    animatedVal.value =
      animatedVal.value === 0
        ? withTiming(1, { duration: 200 })
        : withTiming(0, { duration: 200 });
  };

  const { token } = useGlobalState();

  const url = `getPrayerTimes/${detect?.lat}/${detect?.long}/${selectedDate}`;

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["getPrayerTimes"],
    queryFn: () => fetchData(url, token),
    enabled: !!token && !!cordinate,
    experimental_prefetchInRender: true,
    notifyOnChangeProps: "all",
    refetchIntervalInBackground: true,
  });

  if (error) {
    ToastAndroid.showWithGravity(
      "Check your internet connection!",
      ToastAndroid.TOP,
      ToastAndroid.SHORT
    );
  }

  return (
    <>
      {isLoading && <Loading />}
      <Background
        backgroundColor={Colors.white + 99}
        source={require("../../../assets/image.png")}
      >
        <ScreensHeader Title={t("Times")} />
        <ScrollView>
          <View style={styles.dateContainer}>
            <CalendarDaysIcon color={Colors.dark} size={wp(5.3)} />
            <Text style={styles.dateText}>{data?.formattedDated}</Text>
          </View>
          <Animated.View style={[styles.accordian, animatedStyle]}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.rowContainer}
              onPress={toggleCollapse}
            >
              <View style={styles.rowInnerContainer}>
                <MapPinIcon color={Colors.primary} size={wp(6)} />
                <Text numberOfLines={1} style={styles.rowText}>
                  {selectedAddress && selectedAddress}
                </Text>
              </View>
              <ChevronDownIcon color={Colors.icons} size={wp(6)} />
            </TouchableOpacity>

            <FlatList
              scrollEnabled={false}
              removeClippedSubviews={false}
              contentContainerStyle={{ paddingTop: 5 }}
              data={keys}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.9}
                  style={styles.rowContainerList}
                  onPress={toggleCollapse}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedAddress(item.name);
                      setDetect(item);
                      refetch();
                      toggleCollapse();
                    }}
                    style={[
                      styles.rowInnerContainer,
                      {
                        backgroundColor:
                          item.name === selectedAddress
                            ? "#00000033"
                            : "transparent",
                      },
                    ]}
                  >
                    <MapPinIcon color={Colors.primary} size={wp(6)} />

                    <Text numberOfLines={1} style={styles.rowText}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
            />
          </Animated.View>
          <View style={[styles.border, { paddingTop: 20 }]}>
            <NamazList time={data?.prayerTimes} />
          </View>
          <Heading item={"Calendar"} />
          <Calendar
            onDayPress={(day) => {
              setSelected(day.dateString);
              setSelectedDate(day.day);
              refetch();
              ToastAndroid.show("Loading...", ToastAndroid.LONG);
            }}
            markedDates={{
              [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedDotColor: "orange",
              },
            }}
            style={styles.calendar}
            theme={{
              backgroundColor: "transparent",
              calendarBackground: "#ffffff00",
              textSectionTitleColor: Colors.primary,
              selectedDayBackgroundColor: Colors.dark,
              selectedDayTextColor: Colors.primary,
              todayTextColor: Colors.primary,
              dayTextColor: Colors.primary,
              textDisabledColor: "#B0B0B0",
              arrowColor: Colors.white,
              monthTextColor: Colors.primary,
              arrowStyle: {
                backgroundColor: Colors.primary,
                borderRadius: 50,
                padding: 0.5,
              },
            }}
          />
        </ScrollView>
      </Background>
    </>
  );
};

export default memo(PrayerTime);

const styles = StyleSheet.create({
  dateContainer: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  dateText: {
    color: Colors.dark,
    fontSize: wp(2.5),
    fontWeight: "700",
  },

  accordian: {
    backgroundColor: Colors.bg,
    marginHorizontal: 10,
    borderRadius: 10,
  },

  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.bg,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  rowContainerList: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
  },
  rowInnerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 5,
    borderRadius: 5,
  },
  rowText: {
    color: Colors.dark,
    fontSize: wp(3.9),
    maxWidth: wp(80),
  },
  flatListContainer: {
    paddingVertical: 10,
    alignSelf: "center",
  },
  prayerTimeBackground: {
    justifyContent: "center",
    alignItems: "center",
    width: wp(32),
    height: wp(11),
    marginHorizontal: 2,
  },
  prayertime: {
    fontSize: wp(3.6),
    fontWeight: "600",
    color: Colors.dark,
  },
  prayertimes: {
    fontSize: wp(3.2),
    ...GlobalStyles.Arabic,
  },
  border: {
    borderBottomColor: Colors.bg,
    borderBottomWidth: 1,
  },
  calendar: {
    width: wp(90),
    alignSelf: "center",
    borderBottomColor: Colors.bg,
    borderBottomWidth: 1,
  },
});

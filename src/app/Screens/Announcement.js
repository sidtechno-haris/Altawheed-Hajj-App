import React, { useState, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { Background, EventView, ScreensHeader } from "../../components";
import { useTranslation } from "react-i18next";
import { wp } from "../../constants/Dimentions";
import { Colors } from "../../constants/Colors";
import { useQuery } from "@tanstack/react-query";
import { useToken } from "../../constants/Context";
import { fetchData } from "../../Api/ApiRoute";
import { useGlobalState } from "../../constants/GlobalStorage";

const Announcement = ({ navigation }) => {
  const { t } = useTranslation();
  const scrollViewRef = useRef(null);

  const events = [{ text: "upcomming" }, { text: "past" }];
  const [selected, setSelected] = useState("upcomming");

  const url = "getEvents?type=past";
  const upcoming = "getEvents?type=upcoming";

  const { token, language } = useGlobalState();

  const {
    data: Past,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pastEvent"],
    queryFn: () => fetchData(url, token),
    enabled: !!token, // Only run query if token is available
  });

  const {
    data: Upcoming,
    isLoading: UpcomingLoading,
    error: UpcomingError,
  } = useQuery({
    queryKey: ["upcomingEvent"],
    queryFn: () => fetchData(upcoming, token),
    enabled: !!token, // Only run query if token is available
  });

  const handleScroll = (index) => {
    setSelected(events[index].text);
    scrollViewRef.current?.scrollTo({ x: index * wp(100), animated: true });
  };

  return (
    <Background
      backgroundColor={Colors.white + 99}
      source={require("../../../assets/image.png")}
    >
      <ScreensHeader onPress={() => console.log("hell")} Title={t("event")} />
      <View style={styles.contentContainer}>
        <View style={styles.postionContainer}>
          {events.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleScroll(index)}
              style={
                selected === item.text
                  ? styles.selectedTouchableContainer
                  : styles.touchableContainer
              }
            >
              <Text
                style={[
                  styles.text,
                  {
                    color:
                      selected === item.text ? Colors.primary : Colors.dark,
                    fontFamily:
                      language === "English" ? "Poppins-Regular" : "Cairo-Bold",
                  },
                ]}
              >
                {t(item.text)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView
          removeClippedSubviews={false}
          pagingEnabled
          scrollEnabled={false}
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <EventView
            data={Upcoming?.data}
            isLoading={isLoading}
            error={error}
          />
          <EventView data={Past?.data} isLoading={isLoading} error={error} />
        </ScrollView>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  postionContainer: {
    alignSelf: "center",
    position: "absolute",
    top: wp(5),
    flexDirection: "row",
    zIndex: 10,
    gap: 5,
    backgroundColor: "#00000011",
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 50,
  },
  touchableContainer: {
    borderRadius: 20,
    padding: 10,
  },
  selectedTouchableContainer: {
    borderRadius: 20,
    padding: 10,
    backgroundColor: Colors.white,
    elevation: 5,
  },
  text: {
    fontWeight: "400",
    fontSize: wp(3.4),
  },
  contentWrapper: {
    width: wp(100),
    justifyContent: "center",
    alignItems: "center",
    marginTop: wp(30),
  },

  containerImage: {
    width: wp(70),
    height: wp(70),
    borderRadius: wp(50),
  },
});

export default Announcement;

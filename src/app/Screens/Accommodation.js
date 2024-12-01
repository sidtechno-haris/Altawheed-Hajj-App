import React, { useState, useRef } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  Background,
  BusView,
  FlightView,
  HotelView,
  ScreensHeader,
} from "../../components";
import { wp } from "../../constants/Dimentions";
import { Colors } from "../../constants/Colors";
import Text from "../../components/ScreenComponents/Text";
import { useGlobalState } from "../../constants/GlobalStorage";
import { useTranslation } from "react-i18next";

const Accommodation = ({ navigation }) => {
  const scrollViewRef = useRef(null);
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const events = [
    { id: 0, text: "Hotel" },
    { id: 1, text: "Flight" },
    { id: 2, text: "Bus" },
  ];

  const { language } = useGlobalState();

  const [selected, setSelected] = useState("Hotel");

  const handleScroll = (index) => {
    setSelected(events[index].text);
    scrollViewRef.current?.scrollTo({ x: index * wp(100), animated: true });
  };

  const renderView = (type) => {
    switch (type) {
      case "Hotel":
        return <HotelView key={type} />;
      case "Bus":
        return <BusView key={type} />;
      case "Flight":
        return <FlightView key={type} />;
      default:
        return null;
    }
  };

  return (
    <Background
      backgroundColor={Colors.white + 99}
      source={require("../../../assets/image.png")}
    >
      <ScreensHeader Title={"Accommodation"} />
      <View style={styles.contentContainer}>
        <View
          style={[
            styles.positionContainer,
            { flexDirection: isArabic ? "row-reverse" : "row" },
          ]}
        >
          {events.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleScroll(index)}
              style={[
                styles.touchableContainer,
                {
                  backgroundColor:
                    selected === item.text ? Colors.primary : Colors.bg + 55,
                },
              ]}
            >
              <Text
                style={[
                  styles.text,
                  {
                    color:
                      selected === item.text ? Colors.white : Colors.primary,
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
          {events.map((event) => renderView(event.text))}
        </ScrollView>
      </View>
    </Background>
  );
};

export default Accommodation;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  positionContainer: {
    top: wp(5),
    alignSelf: "center",
    position: "absolute",
    borderRadius: 50,
    paddingHorizontal: 5,
    paddingVertical: 5,
    zIndex: 10,
    gap: 10,
  },
  touchableContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    width: wp(28),
    padding: 5,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  text: {
    fontSize: wp(4),
  },
  contentWrapper: {
    flex: 1,
    marginTop: wp(20),
    width: wp(100),
    justifyContent: "center",
    alignItems: "center",
  },
  containerImage: {
    width: wp(70),
    height: wp(70),
    borderRadius: wp(50),
  },
});

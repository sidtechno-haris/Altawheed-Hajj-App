import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Linking,
  ToastAndroid,
  Text as TEXT,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Background, Button, Loading, ScreensHeader } from "../../components";
import { Colors } from "../../constants/Colors";
import { MapPinIcon } from "react-native-heroicons/outline";
import { hp, wp } from "../../constants/Dimentions";
import ReadMore from "@fawazahmed/react-native-read-more";
import { StarIcon } from "react-native-heroicons/solid";
import { useGlobalState } from "../../constants/GlobalStorage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "../../Api/ApiRoute";
import Text from "../../components/ScreenComponents/Text";
import ContactModel from "../../components/ScreenComponents/ContactModel";

const HotelDetail = ({ route, navigation }) => {
  const { item } = route?.params;

  const [modal, setModal] = useState(false);

  const queryClient = useQueryClient();

  const url = "getHotelDetail/";
  const { token, language } = useGlobalState();

  const { data, isLoading, error } = useQuery({
    queryKey: [url],
    queryFn: () => fetchData(`${url}${item?._id}`, token),
    enabled: !!item,
    keepPreviousData: false,
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      queryClient.clear();
    });

    return unsubscribe;
  }, [navigation, queryClient]);

  useEffect(() => {
    if (error)
      ToastAndroid.show("Internet Connection error", ToastAndroid.SHORT);
  }, [error]);

  const baseUrl = "https://hajjbackend.sidtechno.com/uploads/";

  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollInterval = 3000; // interval for auto-scrolling in milliseconds

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= data?.data?.galleryImage.length) {
          return 0; // reset to first index if it's the last item
        }
        return nextIndex;
      });
    }, scrollInterval);

    return () => clearInterval(intervalId);
  }, [data?.data?.galleryImage]);

  useEffect(() => {
    if (!data?.data?.galleryImage) return;
    if (flatListRef?.current) {
      flatListRef?.current?.scrollToIndex({
        index: currentIndex,
        animated: true,
      });
    }
  }, [currentIndex]);

  return (
    <>
      {isLoading && <Loading />}
      <Background
        source={require("../../../assets/image.png")}
        backgroundColor={Colors.white + 99}
      >
        <ScreensHeader Title={"Accommodation"} />
        <ScrollView
          removeClippedSubviews={false}
          contentContainerStyle={styles.container}
        >
          <FlatList
            ref={flatListRef}
            data={data?.data?.galleryImage}
            renderItem={({ item }) => (
              <View>
                <Image
                  style={styles.hotelImage}
                  source={data && { uri: `${baseUrl}${item}` }}
                  onLoadStart={() => (
                    <ActivityIndicator color={Colors.primary} />
                  )}
                />
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          />
          <FlatList
            removeClippedSubviews={false}
            contentContainerStyle={styles.flatlist}
            data={data?.data?.galleryImage}
            keyExtractor={(item, index) => item + index.toString()}
            horizontal
            renderItem={({ item, index }) => (
              <TouchableOpacity activeOpacity={0.6} key={index}>
                <Image
                  source={item && { uri: `${baseUrl}${item}` }}
                  style={styles.flatlistimages}
                />
              </TouchableOpacity>
            )}
          />
          <View style={styles.textContainer}>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(`geo:0,0?q=${item?.hotelLocation}`);
              }}
              style={styles.iconContainer}
            >
              <MapPinIcon color={Colors.icons + 99} size={wp(6)} />
              <TEXT
                style={[
                  styles.content,
                  {
                    fontFamily:
                      language === "English" ? "Poppins-Medium" : "Cairo-Bold",
                  },
                ]}
              >
                {item?.hotelLocation}
              </TEXT>
            </TouchableOpacity>
            <View style={styles.iconContainer}>
              <StarIcon color={Colors.primary} size={wp(5)} />
              <TEXT
                style={[
                  styles.rating,
                  {
                    fontFamily:
                      language === "English" ? "Poppins-Medium" : "Cairo-Bold",
                  },
                ]}
              >
                {item?.hotelRating}
              </TEXT>
            </View>
          </View>
          <View style={styles.containerText}>
            <View
              style={[
                styles.iconContainer,
                { paddingBottom: 10, alignSelf: "flex-start", width: wp(90) },
              ]}
            >
              <Image
                source={require("../../../assets/room.png")}
                style={styles.room}
              />
              <TEXT
                style={[
                  styles.content,
                  {
                    fontFamily:
                      language === "English" ? "Poppins-Medium" : "Cairo-Bold",
                  },
                ]}
              >
                Room {item?.roomNo}
              </TEXT>
            </View>
            <Text style={styles.containerHeading}>About Destination</Text>
            <ReadMore
              seeMoreText="Read More"
              seeMoreStyle={styles.seeMore}
              seeLessStyle={styles.seeMore}
              numberOfLines={3}
              style={[
                styles.content,
                {
                  fontFamily:
                    language === "English" ? "Poppins-Medium" : "Cairo-Bold",
                },
              ]}
            >
              {item?.hotelDescription}
            </ReadMore>
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button
            title={"Contact Number"}
            onPress={() => {
              // navigation.navigate("ContactUs");
              setModal(true);
            }}
          />
        </View>
        <ContactModel
          visible={modal}
          setModal={setModal}
          data={data?.data}
          language={language}
        />
      </Background>
    </>
  );
};

export default HotelDetail;

const styles = StyleSheet.create({
  hotelImage: {
    width: wp(90),
    height: hp(50),
    borderRadius: wp(5),
    resizeMode: "cover",
    backgroundColor: Colors.bg,
  },
  container: {
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  textContainer: {
    paddingVertical: 10,
    width: wp(90),
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  containerText: {
    flex: 1,
  },
  containerHeading: {
    fontSize: wp(5),
    color: Colors.primary,
  },

  content: {
    fontSize: wp(3),
    fontWeight: "400",
    color: Colors.icons + 99,
  },

  containerContent: {
    fontSize: wp(3.6),
    color: Colors.font + 99,
  },
  rating: { fontSize: wp(3), color: Colors.dark, fontWeight: "400" },
  seeMore: {
    color: Colors.primary,
  },
  buttonContainer: {
    paddingBottom: wp(10),
  },
  flatlist: {
    paddingVertical: 10,
    width: "100%",
    gap: wp(6.5),
    justifyContent: "center",
  },
  flatlistimages: {
    width: wp(15),
    height: wp(12),
    resizeMode: "cover",
    backgroundColor: Colors.bg,
    borderRadius: 10,
  },
  room: {
    width: wp(6),
    height: 15,
    resizeMode: "contain",
  },
});

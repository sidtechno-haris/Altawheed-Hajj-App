import {
  Alert,
  Linking,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
  Text as TEXT,
} from "react-native";
import React from "react";
import {
  Background,
  Button,
  Heading,
  Loading,
  ScreensHeader,
} from "../../components";
import * as Icons from "react-native-heroicons/solid";
import { Colors } from "../../constants/Colors";
import { hp, wp } from "../../constants/Dimentions";
import ReadMore from "@fawazahmed/react-native-read-more";
import Text from "../../components/ScreenComponents/Text";
import moment from "moment";
import { fetchData } from "../../Api/ApiRoute";
import { useQuery } from "@tanstack/react-query";
import { ScrollView } from "react-native-gesture-handler";
import { useGlobalState } from "../../constants/GlobalStorage";

const EventScreen = ({ route }) => {
  const { item } = route?.params;

  const { token, language } = useGlobalState();

  const url = "getEventById/";

  const { data, error, isLoading, isPending } = useQuery({
    queryKey: ["getEvent"],
    queryFn: () => fetchData(`${url}${item?._id}`, token),
    enabled: !!token,
    staleTime: 0,
  });

  if (error) {
    ToastAndroid.showWithGravity(
      "Check your internet connection!",
      ToastAndroid.TOP,
      ToastAndroid.SHORT
    );
  }

  const urlPost = `https://hajjbackend.sidtechno.com/amIGoing/${data?.data._id}?type=past`;

  const ButtonPress = (string) => {
    setTimeout(() => {
      Alert.alert("Your request is being send sucessfully");
    }, 200);

    fetch(urlPost, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: new URLSearchParams({
        type: string, // adjust this if necessary
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Background
          backgroundColor={Colors.white + 99}
          source={require("../../../assets/image.png")}
        >
          <ScreensHeader
            onPress={() => console.log("hell")}
            Title={item.title}
          />

          <ScrollView removeClippedSubviews={false}>
            <Heading item={data?.data.title} />
            <View style={styles.contentContainer}>
              <View style={styles.content}>
                <View style={styles.iconsContainer}>
                  <Icons.CalendarDaysIcon color={Colors.dark} size={wp(8)} />
                </View>
                <View>
                  <TEXT style={styles.textdate}>
                    {moment(data?.data.date).format("ll")}
                  </TEXT>
                  <TEXT
                    style={styles.texttime}
                  >{`${data?.data.startTime} ${data?.data.endTime}`}</TEXT>
                </View>
              </View>
              {data?.data.hotelDetail?.location &&
                data?.data.hotelDetail?.name && (
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL(
                        `geo:0,0?q=${data?.data.hotelDetail?.name}`
                      );
                    }}
                    style={styles.content}
                  >
                    <View style={styles.iconsContainer}>
                      <Icons.MapPinIcon color={Colors.dark} size={wp(8)} />
                    </View>
                    <View>
                      <TEXT
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[styles.textdate, { maxWidth: wp(40) }]}
                      >
                        {data?.data.hotelDetail?.location}
                      </TEXT>
                      <TEXT
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[styles.texttime, { maxWidth: wp(40) }]}
                      >
                        {data?.data.hotelDetail?.name}
                      </TEXT>
                    </View>
                  </TouchableOpacity>
                )}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.containerText}>About Event</Text>
              <ReadMore
                seeMoreText="Read More"
                seeMoreStyle={styles.seeMore}
                seeLessStyle={styles.seeMore}
                numberOfLines={15}
                style={[
                  styles.containerContent,
                  {
                    fontFamily:
                      language === "English" ? "Poppins-Regular" : "Cairo-Bold",
                  },
                ]}
              >
                {data?.data?.aboutEvent}
              </ReadMore>
            </View>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => {
                ButtonPress("maybe");
              }}
              title={"maybe"}
              marginVertical={5}
            />
            <Button
              onPress={() => {
                ButtonPress("going");
              }}
              title={"going"}
              marginVertical={5}
            />
            <Button
              onPress={() => {
                ButtonPress("notgoing");
              }}
              title={"notgoing"}
              marginVertical={5}
            />
          </View>
        </Background>
      )}
    </>
  );
};

export default EventScreen;

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.bg + 99,
    paddingBottom: wp(5),
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconsContainer: {
    backgroundColor: Colors.iconbg,
    padding: 8,
    borderRadius: 20,
  },
  textdate: {
    fontSize: wp(3.5),
    fontWeight: "400",
    color: Colors.dark,
    fontFamily: "Poppins-Medium",
  },
  texttime: {
    fontSize: wp(2.6),
    color: "#747688",
    fontFamily: "Poppins-Medium",
  },
  textContainer: {
    padding: 10,
  },
  containerText: {
    fontSize: wp(6),
    color: Colors.primary,
  },
  containerContent: {
    lineHeight: wp(6),
    fontSize: wp(3.2),
    color: Colors.font,
  },
  buttonContainer: {
    alignItems: "center",
    width: "100%",
    paddingBottom: 20,
  },
  seeMore: { color: Colors.primary, fontWeight: "800" },
});

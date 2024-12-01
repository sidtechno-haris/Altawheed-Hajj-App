import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text as TEXT,
} from "react-native";
import React from "react";
import { StarIcon } from "react-native-heroicons/solid";
import { Colors } from "../../constants/Colors";
import { hp, wp } from "../../constants/Dimentions";
import { MapPinIcon } from "react-native-heroicons/outline";
import Text from "./Text";
import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../Api/ApiRoute";
import { useGlobalState } from "../../constants/GlobalStorage";
import moment from "moment";
import { useTranslation } from "react-i18next";

const HotelView = () => {
  const navigation = useNavigation();
  const url = "getHotels";
  const { token, language } = useGlobalState();
  const { t } = useTranslation();

  const { data, isLoading, error } = useQuery({
    queryKey: ["hotel"],
    queryFn: () => fetchData(url, token),
    enabled: !!token,
  });

  // console.log(data?.data?.hotels);

  if (isLoading) {
    return (
      <View style={styles.contentWrapper}>
        <ActivityIndicator color={Colors.primary} size={"large"} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.contentWrapper}>
        <Image
          style={styles.containerImage}
          source={require("../../../assets/notfound.png")}
        />
      </View>
    );
  }

  const baseUrl = "https://hajjbackend.sidtechno.com/uploads/";

  return (
    <View style={styles.contentWrapper}>
      {data?.data?.length === 0 ? (
        <View
          style={{
            flex: 1,
            width: wp(100),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{ width: wp(40), height: wp(40), borderRadius: wp(50) }}
            source={require("../../../assets/notfound.png")}
          />
        </View>
      ) : (
        <FlatList
          removeClippedSubviews={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
          data={data?.data?.hotels}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={item?._id + index}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("HotelDetail", { item })}
              style={styles.container}
            >
              <Image
                style={styles.image}
                source={{ uri: `${baseUrl}${item?.feautureImage}` }}
              />
              <View style={styles.textContainer}>
                <Text style={[styles.containerText]}>{item?.hotelName}</Text>
                <View style={styles.iconContainer}>
                  <StarIcon color={Colors.primary} size={wp(5)} />
                  <TEXT
                    style={[
                      styles.rating,
                      {
                        fontFamily:
                          language === "English"
                            ? "Poppins-Regular"
                            : "Cairo-Bold",
                      },
                    ]}
                  >
                    {item?.hotelRating}
                  </TEXT>
                </View>
              </View>
              <View style={styles.iconContainer}>
                <MapPinIcon color={Colors.icons + 99} size={wp(6)} />
                <TEXT
                  style={[
                    styles.content,
                    {
                      fontFamily:
                        language === "English"
                          ? "Poppins-Regular"
                          : "Cairo-Bold",
                    },
                  ]}
                >
                  {item?.hotelLocation}
                </TEXT>
              </View>
            </TouchableOpacity>
          )}
          ListHeaderComponent={
            <Text style={styles.index1ContainerText}>
              {t("Hotel Makkah Hajj Season")} {moment().year() + 1}
            </Text>
          }
        />
      )}
    </View>
  );
};

export default HotelView;

const styles = StyleSheet.create({
  container: {
    width: wp(90),
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: wp(5),
    justifyContent: "center",
  },
  textContainer: {
    marginTop: 10,
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  containerText: {
    color: Colors.dark,
    fontSize: wp(5),
  },
  iconContainer: {
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  image: {
    width: "100%",
    height: hp(30),
    borderRadius: wp(5),
    resizeMode: "cover",
    backgroundColor: Colors.bg,
  },
  content: {
    fontSize: wp(3),
    fontWeight: "400",
    color: Colors.icons + 99,
    maxWidth: "80%",
  },
  rating: {
    fontSize: wp(4),
    color: Colors.dark,
    fontWeight: "400",
  },
  contentWrapper: {
    flex: 1,
    marginTop: wp(20),
    width: wp(100),
    justifyContent: "center",
    alignItems: "center",
  },
  flatListContent: {
    gap: wp(4),
    paddingBottom: wp(40),
  },
  index1ContainerText: {
    paddingTop: wp(3),
    color: Colors.dark,
    fontSize: wp(5.2),
    textAlign: "center",
  },
  containerImage: {
    width: wp(70),
    height: wp(70),
    borderRadius: wp(50),
  },
});

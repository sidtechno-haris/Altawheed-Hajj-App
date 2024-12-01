import {
  ActivityIndicator,
  Image,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import React, { memo } from "react";
import * as Icons from "react-native-heroicons/outline";
import { Colors } from "../../constants/Colors";
import { hp, imageUrl, wp } from "../../constants/Dimentions";
import { FlatList } from "react-native-gesture-handler";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../Api/ApiRoute";
import { useGlobalState } from "../../constants/GlobalStorage";

const BusView = () => {
  const { token, language } = useGlobalState();

  const url = "getmyBuses";

  const { data, isLoading, error } = useQuery({
    queryKey: ["Buses"],
    queryFn: () => fetchData(url, token),
    enabled: !!token,
    experimental_prefetchInRender: true,
  });

  if (isLoading) {
    return (
      <View style={styles.contentWrapper}>
        <ActivityIndicator color={Colors.primary} size={"large"} />
      </View>
    );
  }

  if (error) {
    ToastAndroid.showWithGravity(
      `${error.message}` || "An error occurred",
      ToastAndroid.LONG,
      ToastAndroid.TOP
    );
  }

  if (data === undefined || data?.data?.buses?.length === 0) {
    return (
      <View style={styles.contentWrapper}>
        <Image
          style={styles.containerImage}
          source={require("../../../assets/notfound.png")}
        />
      </View>
    );
  }

  return (
    <View style={styles.contentWrapper}>
      <FlatList
        removeClippedSubviews={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        data={data?.data}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            style={styles.container}
          >
            <View style={styles.gap}>
              <Image
                style={{ width: wp(11), height: wp(11), borderRadius: 100 }}
                source={
                  item.image
                    ? { uri: `${imageUrl}${item.image}` }
                    : require("../../../assets/haram.png")
                }
              />
              <View>
                <Text
                  style={[
                    styles.textContainer,
                    {
                      fontFamily:
                        language === "English"
                          ? "Poppins-Medium"
                          : "Cairo-Bold",
                    },
                  ]}
                >
                  {item.title}
                </Text>
                <View style={styles.iconView}>
                  <Icons.MapPinIcon
                    color={Colors.icon}
                    strokeWidth={2}
                    size={wp(5)}
                  />
                  <Text
                    style={[
                      styles.text,
                      {
                        fontFamily:
                          language === "English"
                            ? "Poppins-Medium"
                            : "Cairo-Bold",
                      },
                    ]}
                  >
                    {item?.pickupLocation}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ gap: 5 }}>
              <View style={styles.iconView}>
                <Text
                  style={{
                    color: "#000",
                    fontSize: wp(3),

                    fontFamily:
                      language === "English" ? "Poppins-Medium" : "Cairo-Bold",
                  }}
                >
                  Bus Details
                </Text>
              </View>
              <View style={styles.iconView}>
                <Image
                  source={require("../../../assets/busicon.png")}
                  style={styles.busicon}
                />
                <Text
                  style={[
                    styles.text,
                    {
                      color: Colors.primary,
                      fontFamily:
                        language === "English"
                          ? "Poppins-Medium"
                          : "Cairo-Bold",
                    },
                  ]}
                >
                  {item?.busNumber}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => item.busNumber + index} // Ensure unique key
      />
    </View>
  );
};

export default memo(BusView);

const styles = StyleSheet.create({
  container: {
    width: wp(90),
    flexDirection: "row",
    backgroundColor: Colors.bg,
    flex: 1,
    borderRadius: wp(4),
    height: hp(7),
    shadowColor: Colors.dark,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    elevation: 5,
  },
  gap: { flexDirection: "row", gap: wp(3), alignItems: "center" },
  iconView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  text: {
    color: Colors.icon,
    fontWeight: "400",
    fontSize: wp(2.6),
  },
  textContainer: {
    fontSize: wp(3.5),
    color: Colors.text,
    paddingBottom: 5,
  },
  busicon: {
    marginHorizontal: 5,
    width: wp(5),
    height: wp(5),
  },
  contentWrapper: {
    marginTop: wp(20),
    width: wp(100),
    justifyContent: "center",
    alignItems: "center",
  },
  flatListContent: {
    gap: wp(4),
    paddingBottom: wp(40),
  },
  containerImage: {
    width: wp(70),
    height: wp(70),
    borderRadius: wp(50),
  },
});

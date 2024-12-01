import {
  Image,
  ImageBackground,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React from "react";
import TimeDetail from "./TimeDetail";
import { wp } from "../../constants/Dimentions";
import { Colors } from "../../constants/Colors";
import Text from "./Text";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../Api/ApiRoute";
import { useGlobalState } from "../../constants/GlobalStorage";

const FlightView = () => {
  const url = "myflights";
  const { token } = useGlobalState();

  const { data, error, isLoading } = useQuery({
    queryKey: [url],
    queryFn: () => fetchData(url, token),
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <View style={styles.contentWrapper}>
        <ActivityIndicator color={Colors.primary} size="large" />
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

  // Render each flight item
  const renderItem = ({ item }) => (
    <ImageBackground
      style={styles.image}
      source={require("../../../assets/earth.png")}
    >
      <View>
        <Text style={styles.heading}>{item?.departure?.departureAirBas}</Text>
        <Text style={styles.seats}>
          Seat: {item?.departure?.departureSeats}
        </Text>
      </View>
      <View style={styles.timeContainer}>
        <TimeDetail
          country={item?.departure?.departureCountry}
          date={item?.departure?.departureDate}
          terminal={item?.departure?.departureAirPortTerminal}
          arrival={`Scheduled Departure ${item?.departure?.departureTime}`}
        />
        <Image
          style={styles.planeImage}
          source={require("../../../assets/plane.png")}
          accessibilityLabel="Airplane"
        />
        <TimeDetail
          country={
            item?.return
              ? item?.return?.returnCountry
              : item?.connecting?.connectingCountry
          }
          date={data?.airlineDetails?.return?.returnDate}
          terminal={`Terminal- ${item?.connecting?.connectingDepartureAirPortTerminal}`}
          arrival={`Scheduled Arrival ${
            item?.return?.returnTime ||
            item?.connecting?.connectingDepartureTime
          }`}
        />
      </View>
    </ImageBackground>
  );

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
          data={data?.data} // Correctly pass the data array
          renderItem={renderItem}
          keyExtractor={(item) => item._id} // Unique key
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
};

export default FlightView;

const styles = StyleSheet.create({
  heading: {
    textAlign: "center",
    color: Colors.dark,
    padding: 10,
    fontSize: wp(5),
  },
  seats: {
    textAlign: "center",
    color: Colors.dark,
    fontSize: wp(4),
  },
  image: {
    borderTopColor: Colors.bg,
    borderTopWidth: 1,
    width: wp(100),
    height: wp(70),
    justifyContent: "space-between",
  },
  planeImage: {
    width: wp(8),
    height: wp(8),
    resizeMode: "contain",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderWidth: 1,
    borderRadius: 15,
    marginHorizontal: 10,
    borderColor: Colors.dark,
    backgroundColor: Colors.secondary,
    height: 60,
  },
  contentWrapper: {
    flex: 1,
    marginTop: wp(20),
    justifyContent: "center",
    alignItems: "center",
    width: wp(100),
  },
  flatListContent: {
    paddingBottom: wp(40),
  },
  containerImage: {
    width: wp(70),
    height: wp(70),
    borderRadius: wp(50),
  },
});

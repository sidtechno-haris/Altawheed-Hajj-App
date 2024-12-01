import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text as TEXT,
} from "react-native";
import * as Icons from "react-native-heroicons/outline";
import { Colors } from "../../constants/Colors";
import { hp, wp } from "../../constants/Dimentions";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { useGlobalState } from "../../constants/GlobalStorage";

const EventView = ({ data, error, isLoading }) => {
  const navigation = useNavigation();
  const { language } = useGlobalState();
  const imageUrl = "https://hajjbackend.sidtechno.com/uploads/";

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Image
        style={styles.emptyStateImage}
        source={require("../../../assets/notfound.png")}
      />
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      key={item?._id}
      activeOpacity={0.8}
      onPress={() => navigation.navigate("EventScreen", { item })}
      style={styles.container}
    >
      <View style={styles.gap}>
        <Image
          style={styles.eventImage}
          source={
            item?.image
              ? { uri: `${imageUrl}${item.image}` }
              : require("../../../assets/hajj.png")
          }
        />
        <View>
          <TEXT
            style={[
              styles.textContainer,
              {
                fontFamily:
                  language === "English" ? "Poppins-Bold" : "Cairo-Bold",
              },
            ]}
          >
            {item?.title}
          </TEXT>
          <TEXT
            style={[
              styles.textContent,
              {
                fontFamily:
                  language === "English" ? "Poppins-Medium" : "Cairo-Bold",
              },
            ]}
          >
            Bus Number: {item?.busId?.busNumber}
          </TEXT>
        </View>
      </View>

      <View style={styles.iconSection}>
        <View style={styles.iconView}>
          <Icons.CalendarIcon color={Colors.primary} size={wp(5)} />
          <TEXT
            style={[
              styles.text,
              {
                fontFamily:
                  language === "English" ? "Poppins-Bold" : "Cairo-Bold",
              },
            ]}
          >
            {moment(item?.date).format("ll")}
          </TEXT>
        </View>
        <View style={styles.iconView}>
          <Icons.ClockIcon color={Colors.primary} size={wp(5)} />
          <TEXT
            style={[
              styles.text,
              {
                fontFamily:
                  language === "English" ? "Poppins-Bold" : "Cairo-Bold",
              },
            ]}
          >
            {item?.startTime} - {item?.endTime}
          </TEXT>
        </View>
      </View>
    </TouchableOpacity>
  );

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

  if (isLoading) {
    return (
      <View style={styles.contentWrapper}>
        <ActivityIndicator color={Colors.primary} size={"large"} />
      </View>
    );
  }

  return (
    <View style={styles.contentWrapper}>
      {data?.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          removeClippedSubviews={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item?._id.toString()}
        />
      )}
    </View>
  );
};

export default EventView;

// Styles
const styles = StyleSheet.create({
  container: {
    width: wp(90),
    flexDirection: "row",
    backgroundColor: Colors.bg,
    flex: 1,
    borderRadius: wp(4),
    height: wp(14),
    shadowColor: Colors.dark,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    elevation: 5,
  },
  gap: { flexDirection: "row", gap: wp(1), alignItems: "center" },
  iconSection: { width: wp(30) },
  iconView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  text: {
    color: Colors.dark,
    fontSize: wp(2.4),
  },
  textContainer: {
    fontSize: wp(4),
    color: Colors.primary,
  },
  textContent: {
    fontSize: wp(3),
    color: Colors.dark,
    fontWeight: "400",
  },
  flatListContent: {
    width: wp(90),
    gap: wp(4),
    alignSelf: "center",
    paddingBottom: hp(10),
  },
  contentWrapper: {
    width: wp(100),
    justifyContent: "center",
    alignItems: "center",
    marginTop: wp(25),
  },
  emptyStateContainer: {
    flex: 1,
    width: wp(100),
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateImage: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(50),
    marginRight: 5,
  },
  eventImage: {
    width: 45,
    height: 45,
    borderRadius: 10,
    marginRight: 5,
    backgroundColor: "#fff",
  },
});

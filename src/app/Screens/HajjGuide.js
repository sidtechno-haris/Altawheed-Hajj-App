import { Image, StyleSheet, ToastAndroid, View } from "react-native";
import React from "react";
import { Background, Loading, ScreensHeader } from "../../components";
import { FlatList } from "react-native-gesture-handler";
import { useToken } from "../../constants/Context";
import { fetchData } from "../../Api/ApiRoute";
import { useQuery } from "@tanstack/react-query";
import { wp } from "../../constants/Dimentions";
import { Colors } from "../../constants/Colors";
import Text from "../../components/ScreenComponents/Text";
import moment from "moment";
import RenderHTML from "react-native-render-html";
import { useGlobalState } from "../../constants/GlobalStorage";
import GlobalStyles from "../../constants/GlobalStyles";
import { useTranslation } from "react-i18next";

const HajjGuide = () => {
  const { token } = useGlobalState();
  const { t } = useTranslation();
  const url = "getAllhajjGuides";

  const { data, isLoading, error } = useQuery({
    queryKey: [url],
    queryFn: () => fetchData(url, token),
    enabled: !!token, // Only run query if token is available
  });

  if (error) {
    ToastAndroid.showWithGravity(
      "Check your internet connection!",
      ToastAndroid.TOP,
      ToastAndroid.SHORT
    );
  }

  const tagsStyles = {
    p: {
      paddingHorizontal: 20,
      color: Colors.primary,
      fontSize: wp(3.6),
      ...GlobalStyles.Arabic,
    },
  };
  const imageUrl = "https://hajjbackend.sidtechno.com/uploads/";

  return (
    <>
      {isLoading && <Loading />}
      <Background
        source={require("../../../assets/image.png")}
        backgroundColor={"#ffffff99"}
      >
        <ScreensHeader Title={t("Hajj Guide")} />

        <FlatList
          removeClippedSubviews={false}
          contentContainerStyle={{ gap: 10, margin: 10, paddingBottom: wp(10) }}
          data={data?.data}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.ListContainer,
                {
                  opacity: item.active ? 1 : 0.5,
                },
              ]}
              key={item._id}
            >
              <Image
                style={styles.ListImage}
                // source={require("../../../assets/Frame(1).png")} // Dynamically load images based on index
                source={{ uri: `${imageUrl}${item.image}` }}
              />
              <Text style={styles.name}>{item?.name}</Text>
              <Text style={styles.date}>
                Date: {moment(item?.displayDate).format("MM/DD/YY")}
              </Text>
              {/* <Text style={styles.description}>{item?.description}</Text> */}
              <RenderHTML
                source={{ html: item?.description }}
                contentWidth={wp(85)}
                tagsStyles={tagsStyles}
              />
            </View>
          )}
          keyExtractor={(item) => item?._id} // Ensure unique key for each item
        />
      </Background>
    </>
  );
};

export default HajjGuide;

const styles = StyleSheet.create({
  ListImage: {
    width: wp(30),
    height: wp(30),
    borderRadius: wp(100),
    backgroundColor: Colors.bg,
  },
  ListContainer: {
    // Add any necessary styling for your ListContainer here
    padding: 20,
    backgroundColor: "#ffffff99",
    borderRadius: 20,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#00000055",
  },
  name: {
    fontSize: wp(7),
    color: Colors.primary,
  },
  date: {
    fontSize: wp(5),
    color: Colors.dark,
  },
  description: {
    fontSize: wp(5),
    color: Colors.primary,
  },
});

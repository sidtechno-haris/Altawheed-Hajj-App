import {
  Linking,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import React, { useEffect } from "react";
import {
  Background,
  ContactView,
  Loading,
  ScreensHeader,
} from "../../components";
import { useTranslation } from "react-i18next";
import { wp } from "../../constants/Dimentions";
import { Colors } from "../../constants/Colors";
import Text from "../../components/ScreenComponents/Text";
import { useQuery } from "@tanstack/react-query";
import { useGlobalState } from "../../constants/GlobalStorage";
import { fetchData } from "../../Api/ApiRoute";
import { useMMKVObject } from "react-native-mmkv";
import { Storage } from "../../constants/Store/mmkv";

const TrackingList = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { token } = useGlobalState();

  const url = "trackList";
  const { type } = route?.params || {};

  const [circle, seCircle] = useMMKVObject("circle", Storage);

  const { data, error, isLoading } = useQuery({
    queryKey: [url],
    queryFn: () => fetchData(url, token),
    enabled: !!token,
  });

  console.log(data);

  useEffect(() => {
    seCircle(data);
  }, [data]);

  if (error) {
    ToastAndroid.show("Network Connection Error", ToastAndroid.LONG);
  }

  if (circle === undefined) return <Loading />;

  const renderSections = () => {
    if (type === "General") {
      return (
        <>
          {/* Leader Section */}
          {circle?.leader && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Leader</Text>
              <ContactView
                url={
                  circle.leader.image
                    ? circle.leader.image
                    : require("../../../assets/Logo.png")
                }
                text={circle.leader.name}
                distance={circle.leader.distance}
              />
            </View>
          )}

          {/* Family Section */}
          {circle?.family?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Family</Text>
              {circle?.family?.members.map((member, index) => (
                <ContactView
                  key={index}
                  url={member.image}
                  text={member.name}
                  number={member.phone}
                  onPress={() =>
                    member.phone && Linking.openURL(`tel:${member.phone}`)
                  }
                />
              ))}
            </View>
          )}

          {/* Markups Section */}
          {circle?.markups?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Markups</Text>
              {circle?.markups.map((markup, index) => (
                <ContactView
                  key={index}
                  url={markup.image} // Assuming this is a URI for the image
                  text={markup.title}
                  location={markup.place}
                  onPress={() => {}}
                />
              ))}
            </View>
          )}
        </>
      );
    }

    // If the "type" is something specific (like "family", "leader", etc.), only show that section
    // Check if the 'type' exists in the 'circle' object and is an array
    if (circle && circle[type]) {
      const sectionData = circle[type];

      // Dynamically render content based on the section data
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{type}</Text>
          {Array.isArray(sectionData) ? (
            sectionData.map((item, index) => (
              <ContactView
                key={index}
                url={item.image}
                text={item.name || item.title} // Adjust depending on the structure
                number={item.phone}
                location={item.place}
                onPress={() =>
                  item.phone && Linking.openURL(`tel:${item.phone}`)
                }
              />
            ))
          ) : (
            // If it's not an array, render individual content (like leader)
            <ContactView
              url={sectionData.image}
              text={sectionData.name}
              distance={sectionData.distance}
              location={sectionData.place}
              onPress={() => {
                item.phone && Linking.openURL(`tel:${item.phone}`);
              }}
            />
          )}
        </View>
      );
    }

    // Fallback if no matching group is found
    return <Text>No data available for this type.</Text>;
  };

  return (
    <Background
      backgroundColor={Colors.white + 99}
      source={require("../../../assets/image.png")}
    >
      <ScreensHeader
        Title={t("tracking")}
        add={true}
        circle={"Add User"}
        onPress={() => {
          navigation.navigate("AddUser");
        }}
      />
      <ScrollView
        removeClippedSubviews={false}
        contentContainerStyle={styles.scrollList}
      >
        {renderSections()}
      </ScrollView>
    </Background>
  );
};

export default TrackingList;

const styles = StyleSheet.create({
  scrollList: {
    paddingTop: wp(5),
    paddingHorizontal: 20,
    gap: wp(4),
    paddingBottom: wp(30),
  },
  section: {
    gap: wp(4),
  },
  sectionTitle: {
    textAlign: "center",
    fontSize: wp(6),
    color: Colors.font,
  },
});

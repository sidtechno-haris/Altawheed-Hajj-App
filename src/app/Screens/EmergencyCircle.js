import {
  FlatList,
  RefreshControl,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Background,
  ContactView,
  Loading,
  ScreensHeader,
} from "../../components";
import { useTranslation } from "react-i18next";
import { wp } from "../../constants/Dimentions";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../Api/ApiRoute";
import { useGlobalState } from "../../constants/GlobalStorage";
import { useMMKVObject } from "react-native-mmkv";
import { Storage } from "../../constants/Store/mmkv";
import { useIsFocused } from "@react-navigation/native";

const EmergencyCircle = ({ navigation }) => {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const [contacts, setContacts] = useMMKVObject("contact", Storage);

  const { token, setGroupId } = useGlobalState();
  const url = "getMyCircleContact";
  const { data, error, isLoading, refetch, isRefetching } = useQuery({
    queryKey: [url],
    queryFn: () => fetchData(url, token),
    enabled: !!token,
  });

  useEffect(() => {
    if (data) refetch();
  }, [isFocused]);

  if (error) {
    ToastAndroid.show("Error loading data", ToastAndroid.LONG);
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  const generalContact = {
    groupImage: require("../../../assets/contact.png"),
    groupName: "General",
    number: "All",
  };

  useEffect(() => {
    const listData = [generalContact, ...(data?.data || [])];

    setContacts(listData);
  }, [data]);

  return (
    <>
      {contacts === undefined || isLoading || isRefetching ? <Loading /> : null}
      <Background
        source={require("../../../assets/image.png")}
        backgroundColor={"#ffffff99"}
      >
        <ScreensHeader
          Title={t("circle")}
          circle={t("add")}
          add={true}
          onPress={() => navigation.navigate("AddCircle")}
        />
        <FlatList
          showsHorizontalScrollIndicator={false}
          removeClippedSubviews={false}
          contentContainerStyle={styles.flatlist}
          data={contacts} // Use the combined list
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              progressViewOffset={40}
            />
          }
          renderItem={({ item, index }) => (
            <ContactView
              key={index}
              url={item?.groupImage}
              text={item?.groupName}
              number={item?.number}
              onPress={() => {
                navigation.navigate("TrackingList", { type: item.groupName }),
                  setGroupId(item?._id);
              }}
            />
          )}
        />
      </Background>
    </>
  );
};

export default EmergencyCircle;

const styles = StyleSheet.create({
  flatlist: {
    paddingTop: wp(5),
    flex: 1,
    paddingHorizontal: 20,
    gap: wp(4),
  },
});

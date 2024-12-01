import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchChatData } from "../../Api/ApiRoute";
import { Background, Loading, ScreensHeader } from "../../components";
import { Colors } from "../../constants/Colors";
import { useTranslation } from "react-i18next";
import ChatListComp from "../../components/ScreenComponents/ChatListComp";
import { useGlobalState } from "../../constants/GlobalStorage";
import { useMMKVObject } from "react-native-mmkv";
import { Storage } from "../../constants/Store/mmkv";

const ChatList = () => {
  const { t } = useTranslation();
  const { token } = useGlobalState();
  const [chatList, setChatList] = useMMKVObject("chatList", Storage); // Store chat data in MMKV
  const [storeLogin] = useMMKVObject("login", Storage);

  const [chats, setChats] = useState([]); // State to hold all chat data
  const [perPage, setPerPage] = useState(10); // Items per page
  const [page, setPage] = useState(1); // Current page
  const [isFetchingMore, setIsFetchingMore] = useState(false); // Loading state for pagination

  const { data, error, isLoading } = useQuery({
    queryKey: ["ChatList", page], // Include page in queryKey to refetch on page change
    queryFn: () =>
      fetchChatData(
        `user-list`,
        `perPage=${perPage}&page=${page}`,
        storeLogin?.user?.accessKey
      ),
    enabled: !!storeLogin?.user?.accessKey, // Only fetch when token exists
    keepPreviousData: true, // Preserve previous data during pagination
    gcTime: "Infinity",
  });

  // Handle new data when `data` changes
  useEffect(() => {
    if (data) {
      const newChats = page === 1 ? data?.data : [...chats, ...data?.data]; // Append data for pagination
      setChats(newChats);
      setChatList(newChats); // Store data in MMKV
    }
  }, [data]);

  // Load more chats when the user reaches the end of the list
  const loadMoreChats = () => {
    if (!isFetchingMore && data?.data?.length >= perPage) {
      setIsFetchingMore(true);
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Handle error logging
  if (error) {
    console.error("Error fetching chat data:", error.message);
  }

  return (
    <>
      {isLoading && page === 1 && <Loading />}
      <Background
        backgroundColor={Colors.white + 99}
        source={require("../../../assets/image.png")}
      >
        <ScreensHeader Title={t("Chat")} />
        <View style={styles.main}>
          <FlatList
            removeClippedSubviews={false}
            contentContainerStyle={{
              paddingTop: 10,
              paddingBottom: 40,
              gap: 5,
            }}
            data={chats}
            renderItem={({ item, index }) => (
              <ChatListComp {...{ item, index }} />
            )}
            keyExtractor={(item, index) => index} // Ensure unique key
            onEndReached={loadMoreChats} // Trigger pagination
            onEndReachedThreshold={0.5} // Adjust threshold for triggering loadMoreChats
            ListFooterComponent={isFetchingMore && <ActivityIndicator />}
          />
        </View>
      </Background>
    </>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

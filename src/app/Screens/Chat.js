import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Background, InputView, ScreensHeader } from "../../components";
import { Colors } from "../../constants/Colors";
import { wp } from "../../constants/Dimentions";
import { io } from "socket.io-client";
import { fetchChatData } from "../../Api/ApiRoute";
import { useMMKVObject } from "react-native-mmkv";
import { Storage } from "../../constants/Store/mmkv";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useIsFocused } from "@react-navigation/native";

const Chat = ({ route }) => {
  const { user } = route?.params;
  const flatListRef = useRef(null);
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [paddingBottom, setPaddingBottom] = useState(0);
  const [storeLogin] = useMMKVObject("login", Storage);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const isFocused = useIsFocused();

  const SOCKET_SERVER_URL = "https://api.ahle.chat/";
  const url = "history";

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
      secure: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => console.log("Socket connected"));

    socket.on("newMsges", (message) => {
      if (message.senderId === user._id || message.senderId === user.chatId) {
        setMessages((prevMessages) => [message, ...prevMessages]);
      }
    });

    if (user?.accessKey === null) {
      socket.emit("group", { groupId: user?._id });
    } else {
      socket.emit("joinRoom", { userId: storeLogin?.user?._id });
    }

    return () => socket.disconnect();
  }, [storeLogin, user?._id, isFocused]);

  const fetchData = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const data = await fetchChatData(url, {
        senderId: storeLogin?.user?._id,
        receiverId: user?._id,
        page,
        perPage: 10,
      });

      if (data.messages) {
        setMessages((prevMessages) => [...prevMessages, ...data.messages]);
      }
    } catch (error) {
      console.error("Error fetching chat data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSend = useCallback(
    (text) => {
      if (!text.trim()) return;

      const message =
        user?.accessKey === null
          ? {
              senderId: storeLogin?.user?.chatId,
              messageContent: text,
              accessKey: storeLogin?.user?.accessKey,
              groupId: user?._id,
            }
          : {
              senderId: storeLogin?.user?.chatId,
              receiverId: user?._id,
              messageContent: text,
              accessKey: storeLogin?.user?.accessKey,
            };

      setMessages((prevMessages) => [message, ...prevMessages]);
      socketRef.current.emit("sendMessageUser", message);
    },
    [user, storeLogin]
  );

  // Handle keyboard appearance
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setPaddingBottom(e.endCoordinates.height);
        setTimeout(
          () => flatListRef.current?.scrollToEnd({ animated: true }),
          100
        );
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setPaddingBottom(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <Background
      backgroundColor={Colors.white + 99}
      source={require("../../../assets/image.png")}
    >
      <ScreensHeader Title={user?.name} chat={true} />
      <KeyboardAvoidingView
        style={[styles.chat, { paddingBottom }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -200}
      >
        <FlatList
          ref={flatListRef}
          inverted
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="always"
          contentContainerStyle={styles.flatList}
          data={messages}
          keyExtractor={(item, index) => item._id || `message-${index}`}
          onEndReached={() => {
            if (!loading) setPage((prevPage) => prevPage + 1);
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            loading && (
              <View style={styles.loadingFooter}>
                <Text style={styles.loadingText}>Loading...</Text>
                <ActivityIndicator color={"gray"} size={"small"} />
              </View>
            )
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageview,
                {
                  justifyContent:
                    item.senderId === storeLogin?.user?.chatId ||
                    item.senderId === storeLogin?.user?._id
                      ? "flex-end"
                      : "flex-start",
                },
              ]}
            >
              <View
                style={{
                  flexDirection:
                    item.senderId === storeLogin?.user?._id ||
                    item.senderId === storeLogin?.user?.chatId
                      ? "row-reverse"
                      : "row",
                }}
              >
                <View
                  style={[
                    styles.messageContainer,
                    {
                      backgroundColor:
                        item.senderId === storeLogin?.user?._id ||
                        item.senderId === storeLogin?.user?.chatId
                          ? Colors.primary
                          : Colors.dark,
                    },
                  ]}
                >
                  <Text style={styles.message}>{item.messageContent}</Text>
                </View>
              </View>
            </View>
          )}
        />
        <InputView onSend={onSend} />
      </KeyboardAvoidingView>
    </Background>
  );
};

export default memo(Chat);

const styles = StyleSheet.create({
  chat: {
    flex: 1,
  },
  messageview: {
    paddingVertical: 5,
  },
  messageContainer: {
    maxWidth: "75%",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 10,
  },
  message: {
    color: Colors.white,
    fontWeight: "500",
    fontSize: wp(3.5),
  },
  flatList: {
    paddingHorizontal: wp(2),
  },
  loadingFooter: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  loadingText: {
    color: "#000",
    fontSize: wp(3),
  },
});

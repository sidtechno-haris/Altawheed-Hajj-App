import { FlatList, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Background, NotificationView, ScreensHeader } from "../../components";
import { useTranslation } from "react-i18next";
import { wp } from "../../constants/Dimentions";
import { Colors } from "../../constants/Colors";
import { storeData } from "../../constants/AsyncStorage";

const Notification = () => {
  const { t } = useTranslation();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New message",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      viewed: false,
    },
    {
      id: 2,
      title: "App update",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      viewed: false,
    },
    {
      id: 3,
      title: "App update",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      viewed: false,
    },
    {
      id: 4,
      title: "App update",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      viewed: false,
    },
  ]);

  useEffect(() => {
    const markAllAsViewed = async () => {
      const updatedNotifications = notifications.map((notification) => ({
        ...notification,
        viewed: true,
      }));
      setNotifications(updatedNotifications);

      // Save the updated notifications to AsyncStorage
      await storeData("Notification", updatedNotifications);
    };

    // Only run if there are notifications to mark as viewed
    if (notifications.some((notification) => !notification.viewed)) {
      markAllAsViewed();
    }
  }, []);

  return (
    <Background
      backgroundColor={Colors.white + "11"}
      source={require("../../../assets/image.png")}
    >
      <ScreensHeader Title={t("Notification")} />
      <FlatList
        removeClippedSubviews={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatlist}
        keyExtractor={(item) => item.id.toString()}
        data={notifications}
        renderItem={({ item }) => (
          <NotificationView
            title={item.title}
            content={item.content}
            viewed={item.viewed}
          />
        )}
      />
    </Background>
  );
};

export default Notification;

const styles = StyleSheet.create({
  flatlist: {
    paddingTop: wp(5),
    flex: 1,
    paddingHorizontal: 20,
    gap: wp(4),
  },
});

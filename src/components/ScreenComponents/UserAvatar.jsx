import React, { useEffect } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const UserAvatar = ({ user }) => {
  const imageUrl = "https://hajjbackend.sidtechno.com/uploads/";
  const rotation = useSharedValue(0);

  useEffect(() => {
    const randomAngle = Math.random() * 360;
    rotation.value = withRepeat(
      withTiming(randomAngle + 360, { duration: 60000 }),
      -1
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    "worklet";

    const angle = (rotation.value * Math.PI) / 180;
    const radius = user?.radius || 0;
    const translateX = Math.cos(angle) * radius;
    const translateY = Math.sin(angle) * radius;

    return {
      transform: [
        { translateX: isNaN(translateX) ? 0 : translateX },
        { translateY: isNaN(translateY) ? 0 : translateY },
      ],
    };
  });

  return (
    <Animated.View style={[styles.avatarContainer, animatedStyle]}>
      <Image
        source={{ uri: `${imageUrl}${user?.image}` }}
        style={styles.avatarImage}
      />
      {user?.title && <Text style={styles.avatarName}>{user?.title}</Text>}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    position: "absolute",
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  avatarName: {
    color: "#000",
    fontSize: 10,
    textAlign: "center",
  },
});

export default UserAvatar;

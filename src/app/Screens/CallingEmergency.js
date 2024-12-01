import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text as TEXT,
} from "react-native";
import { Background, Loading, ScreensHeader } from "../../components";
import { useTranslation } from "react-i18next";
import { wp } from "../../constants/Dimentions";
import { Colors } from "../../constants/Colors";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";
import Text from "../../components/ScreenComponents/Text";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../Api/ApiRoute";
import { useGlobalState } from "../../constants/GlobalStorage";
import UserAvatar from "../../components/ScreenComponents/UserAvatar";

const OrbitingImage = () => {
  const rotationValues = useSharedValue(0);

  const { token, language } = useGlobalState();
  const url = "trackList";

  const { data, error, isLoading } = useQuery({
    queryKey: [url],
    queryFn: () => fetchData(url, token),
    enabled: !!token,
  });
  const [orbitingUsers, setOrbitUsers] = useState([]);

  useEffect(() => {
    if (data === undefined) return;

    const mergedArray = mergeData(data);

    if (mergedArray) {
      setOrbitUsers(mergedArray);
    } else {
      return;
    }
  }, [data]);

  const mergeData = (data) => {
    const mergedArray = [];
    for (const key in data) {
      const value = data[key];
      if (value && typeof value === "object") {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            mergedArray.push({
              type: key,
              radius: Math.floor(Math.random() * (250 - 80 + 1)) + 90,
              // rotation: useSharedValue(0), // Initial rotation value
              ...item,
            });
          });
        } else {
          mergedArray.push({
            type: key,
            ...value,
          });
        }
      }
    }
    return mergedArray;
  };

  // useEffect(() => {
  //   orbitingUsers.forEach((user, index) => {
  //     const randomAngle = Math.random() * 360;
  //     user.rotation.value = withRepeat(
  //       withTiming(randomAngle + 360, { duration: 60000 + index * 10000 }),
  //       -1
  //     );
  //   });

  //   // return () => {
  //   //   rotationValues.forEach((user) => cancelAnimation(rotation));
  //   // };
  // }, [orbitingUsers]);

  // const AnimatedStyles = useAnimatedStyle((user) => {
  //   const angle = (user.rotation.value * Math.PI) / 180;
  //   return {
  //     transform: [
  //       { translateX: Math.cos(angle) * user.radius },
  //       { translateY: Math.sin(angle) * user.radius },
  //     ],
  //   };
  // });

  const { t } = useTranslation();

  return (
    <>
      {isLoading && <Loading />}
      <Background
        backgroundColor={Colors.white + 99}
        source={require("../../../assets/image.png")}
      >
        <ScreensHeader Title={t("SOS")} />
        <View style={styles.textContainer}>
          <Text style={styles.containerTextHeading}>{t("calling")}</Text>
          <TEXT
            style={[
              styles.containerTextContent,
              {
                fontFamily:
                  language === "English" ? "Poppins-Medium" : "Cairo-Bold",
              },
            ]}
          >
            {t("callingContext")}
          </TEXT>
        </View>

        <View style={styles.center}>
          <Svg height="400" width="400" style={styles.svg}>
            {[26, 34, 42].map((radius, index) => (
              <Circle
                key={index}
                cx="200"
                cy="200"
                r={wp(radius)}
                stroke="gold"
                strokeWidth="2"
                strokeDasharray="5, 5"
                fill="none"
              />
            ))}
          </Svg>
          <TouchableOpacity>
            <Image
              style={{ width: wp(40), height: wp(40) }}
              source={require("../../../assets/ellipse.png")}
            />
          </TouchableOpacity>
          <Text style={styles.text}>
            {orbitingUsers !== null && orbitingUsers.length}
          </Text>
          {orbitingUsers.map((user, index) => (
            // <Animated.View
            //   key={user._id}
            //   style={[styles.avatarContainer, orbitingStyles[index]]}
            // >
            //   <Image
            //     source={require("../../../assets/user2.png")}
            //     style={styles.avatarImage}
            //   />
            //   {user.title && (
            //     <Text style={styles.avatarName}>{user.title}</Text>
            //   )}
            // </Animated.View>
            <UserAvatar key={index} user={user} />
          ))}
        </View>
      </Background>
    </>
  );
};

export default OrbitingImage;

const styles = StyleSheet.create({
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: wp(5),
    paddingHorizontal: wp(15),
  },
  containerTextHeading: {
    fontSize: wp(6),
    color: Colors.dark,
    paddingBottom: 10,
  },
  containerTextContent: {
    textAlign: "center",
    fontSize: wp(3.2),
    lineHeight: wp(5),
    color: Colors.font,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  svg: {
    position: "absolute",
  },
  avatarContainer: {
    position: "absolute",
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: "#fff",
  },
  avatarName: {
    color: "#000",
    fontSize: 10,
    textAlign: "center",
  },
  text: {
    alignSelf: "center",
    color: "#fff",
    fontSize: wp(10),
    position: "absolute",
  },
});

// const [orbitingUsers, setOrbitUsers] = useState([
//   {
//     _id: "6720bf0a4aaad29c0e3275d2",
//     image: require("../../../assets/user2.png"),
//     title: "Makkah Madina",
//     place: "Jeddah 123",
//     radius: Math.floor(Math.random() * (250 - 80 + 1)) + 90,
//     rotation: useSharedValue(0),
//   },
//   {
//     _id: "6720bf624aaad29c0e3275db",
//     image: require("../../../assets/user2.png"),
//     title: "abc",
//     place: "hello",
//     radius: Math.floor(Math.random() * (250 - 80 + 1)) + 90,
//     rotation: useSharedValue(0),
//   },
//   {
//     _id: "66fd4395983ebe5fb8eb71a1",
//     image: require("../../../assets/user2.png"),
//     title: "Bus stop",
//     place: "Makkah",
//     radius: Math.floor(Math.random() * (250 - 80 + 1)) + 90,
//     rotation: useSharedValue(0),
//   },
// ]);

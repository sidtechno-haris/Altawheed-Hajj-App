import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { Background, ScreensHeader } from "../../components";
import { Colors } from "../../constants/Colors";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useTranslation } from "react-i18next";
import Geolocation from "@react-native-community/geolocation";
import { fetchData } from "../../Api/ApiRoute";
import { useQuery } from "@tanstack/react-query";
import { useGlobalState } from "../../constants/GlobalStorage";
import { useMMKVObject } from "react-native-mmkv";
import { Storage } from "../../constants/Store/mmkv";
import { wp } from "../../constants/Dimentions";

const Tracker = () => {
  const { t } = useTranslation();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true); // Start as loading
  const [storeLogin] = useMMKVObject("login", Storage);
  const [selectedUser, setSelectedUser] = useState(null); // State to store selected user coordinates
  const mapRef = useRef(null); // Reference to the map

  const defaultLocation = {
    latitude: 23.8859,
    longitude: 45.0792,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    requestLocationPermissionAndEnableGPS();
  }, []);

  const requestLocationPermissionAndEnableGPS = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        // If permission is granted, get the location
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          Alert.alert(
            "Permission Denied",
            "Location permission is required to show your current location on the map."
          );
          setLoading(false); // Stop loading if permission is denied
        }
      } catch (err) {
        console.warn(err);
        setLoading(false); // Stop loading on error
      }
    }
  };

  const imageUrl = "https://hajjbackend.sidtechno.com/uploads/";

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position?.coords.latitude,
          longitude: position?.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setLoading(false); // Stop loading once location is retrieved
      },
      (error) => {
        Alert.alert(
          "Error",
          `Failed to get your location: ${error.message}. Make sure your location is enabled.`
        );
        setLocation(defaultLocation); // Fallback to default location
        setLoading(false); // Stop loading on error
      },
      { enableHighAccuracy: true } // Improve accuracy
    );
  };

  const { token } = useGlobalState();

  const url = "trackLocation";

  const { data, error, isLoading } = useQuery({
    queryKey: [url], // queryKey wrapped in array
    queryFn: () => fetchData(url, token),
    enabled: !!token,
    refetchInterval: 30000,
  });

  if (isLoading) {
    ToastAndroid.show("Loading...", ToastAndroid.SHORT);
  }

  if (error) {
    ToastAndroid.show("No user found", ToastAndroid.SHORT);
  }

  // Function to handle marker press and zoom to selected user
  const handleMarkerPress = (userLocation) => {
    setSelectedUser(userLocation); // Update selected user location
    mapRef.current.animateToRegion(
      {
        ...userLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      500
    ); // 500 ms animation duration
  };

  return (
    <Background
      backgroundColor={Colors.white + 99}
      source={require("../../../assets/image.png")}
    >
      <ScreensHeader Title={t("track")} />
      <View style={styles.container}>
        {loading ? ( // Show loading indicator
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View>
        ) : (
          <MapView
            ref={mapRef} // Attach map ref to animate it
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            onMapLoaded={() => {
              setLoading(false);
            }}
            style={styles.map}
            region={location || defaultLocation} // Ensure a valid region is always provided
          >
            {location &&
              !isNaN(location.latitude) &&
              !isNaN(location.longitude) && ( // Only render marker if coordinates are valid
                <Marker coordinate={location}>
                  <View style={styles.userContainer}>
                    <Image
                      source={{ uri: `${imageUrl}${storeLogin?.user?.image}` }}
                      style={styles.userImage}
                    />
                    <Text style={styles.name}>
                      {storeLogin?.user?.firstname}
                    </Text>
                  </View>
                </Marker>
              )}

            {data?.data.map((item, index) => {
              const lat = parseFloat(item?.location?.lat);
              const long = parseFloat(item?.location?.long);

              // Skip rendering marker if latitude or longitude is invalid (NaN)
              if (isNaN(lat) || isNaN(long)) return null;

              const userLocation = {
                latitude: lat,
                longitude: long,
              };

              return (
                <Marker
                  key={index}
                  coordinate={userLocation}
                  onPress={() => handleMarkerPress(userLocation)} // Zoom to the selected user on marker press
                >
                  <View style={styles.userContainer}>
                    <Image
                      source={{ uri: `${imageUrl}${item.image}` }}
                      style={styles.userImage}
                    />
                    <Text style={styles.name}>Hello</Text>
                  </View>
                </Marker>
              );
            })}
          </MapView>
        )}
      </View>
    </Background>
  );
};

export default Tracker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingImage: {
    width: 50,
    height: 50,
  },
  userImage: {
    width: 40,
    height: 40,
    resizeMode: "cover",
    borderRadius: 50,
    borderColor: Colors.white,
    borderWidth: 2,
  },
  userContainer: {
    width: 100,
    height: 100,
    backgroundColor: Colors.primary + 55,
    borderRadius: 50,
    borderColor: Colors.dark,
    borderWidth: 1,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    color: Colors.dark,
    fontFamily: "Cairo-Bold",
    fontSize: wp(3),
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 5,
    marginTop: 4,
  },
});

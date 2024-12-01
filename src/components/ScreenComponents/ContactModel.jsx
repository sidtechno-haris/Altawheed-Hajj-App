import {
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { hp, wp } from "../../constants/Dimentions";
import { XMarkIcon } from "react-native-heroicons/outline";
import { Colors } from "../../constants/Colors";

const ContactModel = ({ visible, setModal, data, language }) => {
  //   console.log(data);

  return (
    <Modal
      statusBarTranslucent
      animationType="fade"
      transparent
      backdropOpacity={0.5}
      backdropColor="black"
      animationIn="fadeIn"
      animationOut="fadeOut"
      needsOffscreenAlphaCompositing
      visible={visible}
    >
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <TouchableOpacity
            onPress={() => {
              setModal(false);
            }}
            style={styles.button}
          >
            <XMarkIcon color={"#000"} size={wp(5)} strokeWidth={2} />
          </TouchableOpacity>
          <View style={{ alignItems: "center", gap: 20 }}>
            <Text
              style={[
                styles.Name,
                {
                  fontFamily:
                    language === "English" ? "Poppins-Bold" : "Cairo-Bold",
                },
              ]}
            >
              {data?.hotelName}
            </Text>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(`tel:${data?.hotelContactNo}`);
              }}
              style={{
                backgroundColor: "#00000011",
                borderRadius: 20,
                width: "80%",
                alignItems: "center",
                justifyContent: "center",
                height: 50,
              }}
            >
              <Text
                style={[
                  styles.Contact,
                  {
                    fontFamily:
                      language === "English" ? "Poppins-Medium" : "Cairo-Bold",
                  },
                ]}
              >
                {data?.hotelContactNo}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ContactModel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: wp(70),
    height: hp(20),
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  button: {
    borderRadius: 50,
    padding: 5,
    backgroundColor: "#00000011",
    alignSelf: "flex-end",
    margin: 10,
  },
  Name: {
    fontSize: wp(5),
    color: Colors.primary,
  },
  Contact: {
    fontSize: wp(4),
    color: Colors.dark,
  },
});

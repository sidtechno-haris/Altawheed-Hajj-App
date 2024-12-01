import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
  Keyboard,
} from "react-native";
import React, { useRef, useState } from "react";
import { Background, Loading, ScreensHeader } from "../../components";
import { Colors } from "../../constants/Colors";
import { hp, wp } from "../../constants/Dimentions";
import GlobalStyles from "../../constants/GlobalStyles";
import { fetchDataWithTokenandParams } from "../../Api/ApiRoute";
import { useToken } from "../../constants/Context";
import { onDisplayNotification } from "../../constants/LocalNotification";
import PhoneInput from "react-native-phone-number-input";
import { useGlobalState } from "../../constants/GlobalStorage";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import { useTranslation } from "react-i18next";

const ContactUs = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [formattedValue, setFormattedValue] = useState("");

  const phoneInput = useRef(null);
  const { token, language } = useGlobalState();
  const [loading, setLoading] = useState(false);

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" })); // Reset error on input change
  };

  const validateForm = () => {
    const { name, email, phoneNumber, message } = formData;
    const newErrors = {};

    if (!name) {
      newErrors.name = "Name is required";
    }
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (phoneInput.current?.isValidNumber(phoneNumber)) {
      newErrors.phoneNumber = "Plese fill the correct number";
    }
    if (!message) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = async () => {
    Keyboard.dismiss();
    if (!validateForm()) return;

    try {
      const data = await fetchDataWithTokenandParams(
        "contactUs",
        token,
        formData,
        setLoading
      );

      console.log(data);

      if (data !== undefined) {
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          message: "",
        });
        ToastAndroid.show("Message sent successfully", ToastAndroid.SHORT);
      }
      onDisplayNotification({
        title: "From Admin",
        body: "Thanks for contacting us",
      });
    } catch (error) {
      console.warn("Error:", error.message);
      ToastAndroid.show(
        "An error occurred. Please try again.",
        ToastAndroid.SHORT
      );
    }
  };

  const entry = [
    { id: 1, name: "Name", key: "name", large: false, type: "default" },
    { id: 2, name: "Email", key: "email", large: false, type: "email-address" },
    {
      id: 3,
      name: "Phone Number",
      key: "phoneNumber",
      large: false,
      type: "number-pad",
    },
    { id: 4, name: "Message", key: "message", large: true, type: "default" },
  ];

  return (
    <>
      {loading && <Loading />}
      <Background
        source={require("../../../assets/image.png")}
        backgroundColor={"#ffffff98"}
      >
        <ScreensHeader Title={t("Contact Us")} />

        <KeyboardAvoidingScrollView
          removeClippedSubviews={false}
          enableOnAndroid={true}
          extraScrollHeight={hp(5)}
          automaticallyAdjustKeyboardInsets={true}
        >
          <View style={{ padding: 15 }}>
            {entry.map((item) => (
              <View key={item.id}>
                <Text
                  style={[
                    styles.Text,
                    {
                      fontFamily:
                        language === "English"
                          ? "Poppins-Medium"
                          : "Cairo-Bold",
                    },
                  ]}
                >
                  {t(item.name)}
                </Text>
                {item.name === "Phone Number" ? (
                  <PhoneInput
                    ref={phoneInput}
                    value={formData[item.key]}
                    defaultCode="US"
                    onChangeText={(value) => handleInputChange(item.key, value)}
                    onChangeFormattedText={(value) =>
                      handleInputChange(item.key, value)
                    }
                    containerStyle={[
                      styles.Input,
                      {
                        borderColor: errors[item.key] ? "red" : Colors.primary,
                        width: wp(93),
                        height: 60,
                        alignItems: "center",
                        overflow: "hidden",
                        backgroundColor: "#fff",
                      },
                    ]}
                    textContainerStyle={{
                      height: 80,
                      backgroundColor: "#fff",
                    }}
                    textInputProps={{
                      placeholderTextColor: "#00000055",
                      placeholder: "00000000000",
                    }}
                  />
                ) : (
                  <TextInput
                    style={[
                      item.large ? styles.InputLarge : styles.Input,
                      {
                        textAlign: isArabic ? "right" : "left",
                        borderColor: errors[item.key] ? "red" : Colors.primary,
                      },
                    ]}
                    value={formData[item.key]}
                    placeholder={t(item.name)}
                    placeholderTextColor={"#00000066"}
                    onChangeText={(text) => handleInputChange(item.key, text)}
                    keyboardType={item.type}
                  />
                )}
                {errors[item.key] && (
                  <Text style={styles.ErrorText}>{errors[item.key]}</Text>
                )}
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.Touchable} onPress={handleSend}>
            <Text
              style={[
                { fontSize: wp(4), color: "#fff" },
                isArabic ? GlobalStyles.Arabic : GlobalStyles.CustomFonts,
              ]}
            >
              {t("Send")}
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingScrollView>
      </Background>
    </>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  Input: {
    borderColor: Colors.primary,
    borderWidth: 1,
    backgroundColor: "#fff",
    borderRadius: 15,
    height: hp(6),
    color: Colors.primary,
    padding: 10,
    fontFamily: "Cairo-Bold",
    fontSize: wp(3.5),
  },
  Text: {
    color: Colors.primary,
    fontSize: wp(4),
    padding: 10,
  },
  InputLarge: {
    borderColor: Colors.primary,
    borderWidth: 1,
    backgroundColor: "#fff",
    borderRadius: 15,
    height: hp(15),
    textAlignVertical: "top",
    padding: 10,
    fontSize: wp(3.5),
    fontFamily: "Cairo-Bold",
    color: Colors.primary,
  },
  Touchable: {
    backgroundColor: Colors.dark,
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  Insta: {
    width: wp(15),
    height: wp(15),
  },
  ErrorText: {
    color: "red",
    fontSize: wp(2.8),
    paddingTop: 5,
  },
});

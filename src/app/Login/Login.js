import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
  ActivityIndicator,
  Vibration,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "../../constants/Colors";
import { hp, wp } from "../../constants/Dimentions";
import * as Icons from "react-native-heroicons/outline";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useTranslation } from "react-i18next";
import { Button } from "../../components";
import Text from "../../components/ScreenComponents/Text";
import GlobalStyles from "../../constants/GlobalStyles";
import { onDisplayNotification } from "../../constants/LocalNotification";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useMMKVObject, useMMKVString } from "react-native-mmkv";
import { Storage } from "../../constants/Store/mmkv";

const backgroundImage = require("../../../assets/image.png");

const Login = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [eye, setEye] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    toggleCheckBox: false,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
  };

  const url = "https://hajjbackend.sidtechno.com/login";

  const [storeLogin, setStoreLogin] = useMMKVObject("login", Storage);
  const [token, setToken] = useMMKVString("token", Storage);

  const validateInputs = () => {
    let valid = true;
    let newErrors = {};

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!loginData.email) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!emailRegex.test(loginData.email)) {
      newErrors.email = "Please enter a valid email.";
      valid = false;
    }

    // Password Validation
    if (!loginData.password) {
      newErrors.password = "Password is required.";
      valid = false;
    } else if (loginData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      valid = false;
    }


    setErrors(newErrors);
    return valid;
  };

  const fetchDataWithParams = async (params) => {
    try {
      setLoading(true);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      console.log(response);
      if (!response.ok) {
        ToastAndroid.showWithGravity(
          "Your login details are incorrect.",
          ToastAndroid.SHORT,
          ToastAndroid.TOP
        );
        setLoading(false);
        return;
      }
      const data = await response.json();

      if (data.data !== null) {
        setStoreLogin(data.data);

        setToken(data?.data?.token);

        onDisplayNotification({
          title: "Login Successful!",
          body: "Welcome to Altawheed Hajj App",
        });

        setLoading(false);
        navigation.navigate("EnableLocation");
      }
    } catch (error) {
      ToastAndroid.showWithGravity(
        "Login failed. Network connection error.",
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
    }
  };

  return (
    <ImageBackground 
      source={backgroundImage} 
      style={styles.mainContainer}
      resizeMode="cover"
    >
    <View 
      style={styles.innerContainer}
    >
      <View style={styles.topLine} />
      <KeyboardAwareScrollView
        removeClippedSubviews={false}
        contentContainerStyle={styles.scrollContentContainer}
        enableOnAndroid={true}
        extraScrollHeight={hp(3)}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.images}>
          <Image
            style={styles.image}
            source={require("../../../assets/Logo.png")}
          />
          <Image
            style={styles.imageSec}
            source={require("../../../assets/group1.png")}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.headText]}>{t("log")}</Text>
          <Text style={[styles.contentText]}>{t("logContent")}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.inputText]}>{t("email")}</Text>
          <View style={styles.inputRow}>
            <Icons.EnvelopeIcon color={Colors.input} size={22} />
            <TextInput
              cursorColor={Colors.primary}
              style={[styles.input, { textAlign: isArabic ? "right" : "left" }]}
              placeholder={t("emailHolder")}
              placeholderTextColor={Colors.input}
              keyboardType="email-address"
              value={loginData.email}
              onChangeText={(value) =>
                handleInputChange("email", value.toLocaleLowerCase())
              }
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.inputText]}>{t("pass")}</Text>
          <View style={[styles.inputRow, { justifyContent: "space-between" }]}>
            <View style={styles.inputContent}>
              <Icons.LockClosedIcon color={Colors.input} size={22} />
              <TextInput
                style={[
                  styles.input,
                  { textAlign: isArabic ? "right" : "left" },
                ]}
                placeholder={t("passHolder")}
                placeholderTextColor={Colors.input}
                cursorColor={Colors.primary}
                secureTextEntry={!eye}
                keyboardType="default"
                value={loginData.password}
                onChangeText={(value) => handleInputChange("password", value)}
              />
            </View>
            <TouchableOpacity
              onPress={() => setEye(!eye)}
              accessibilityLabel={eye ? "Hide password" : "Show password"}
            >
              {eye ? (
                <Icons.EyeIcon color={Colors.input} size={22} />
              ) : (
                <Icons.EyeSlashIcon color={Colors.input} size={22} />
              )}
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        <BouncyCheckbox
          style={{ paddingHorizontal: 30, paddingVertical: 15 }}
          size={25}
          fillColor={Colors.input}
          unFillColor="#FFFFFF"
          text={t("bouncy")}
          innerIconStyle={{ borderWidth: 1 }}
          textStyle={[styles.bouncyText, GlobalStyles.CustomFonts]}
          isChecked={loginData.toggleCheckBox}
          onPress={(isChecked) =>
            handleInputChange("toggleCheckBox", isChecked)
          }
        />

        {loading ? (
          <ActivityIndicator size={"large"} color={Colors.primary} />
        ) : (
          <Button
            onPress={() => {
              if (validateInputs()) {
                fetchDataWithParams({
                  email: loginData.email,
                  password: loginData.password,
                });
              } else {
                Vibration.vibrate(200);
                ToastAndroid.showWithGravity(
                  "Please fill out all required fields",
                  ToastAndroid.SHORT,
                  ToastAndroid.TOP
                );
              }
            }}
            title={"sign"}
          />
        )}
      </KeyboardAwareScrollView>
      </View>
    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  scrollContentContainer: {
  alignItems: "center",
  justifyContent: "flex-start",
  flexGrow: 1,
  width: wp(85),
  },
  mainContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    width: '100%',
    height: '100%',
  },
  innerContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: Colors.white,
    borderColor: Colors.dark,
    borderWidth: 1,
    width: wp(85),
    alignItems: "center",
    alignSelf: "center",
    paddingBottom: hp(5),
    height: hp(80),
    position: "absolute",
    bottom: 0,
  },
  images: {
    paddingVertical: 30,
    gap: 5,
    alignItems: "center",
  },
  image: {
    width: wp(30),
    height: wp(30),
    resizeMode: "cover",
  },
  imageSec: {
    width: 80,
    height: 35,
    resizeMode: "cover",
  },
  topLine: {
    marginVertical: 10,
    width: wp(15),
    height: hp(0.6),
    alignSelf: "center",
    borderRadius: 20,
    backgroundColor: Colors.dark,
  },
  textContainer: { alignItems: "center", gap: 5 },
  inputContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  headText: {
    color: Colors.primary,
    textAlign: "center",
    fontSize: wp(6),
  },
  contentText: {
    color: Colors.dark,
    textAlign: "center",
    fontWeight: "500",
    fontSize: wp(3.6),
  },
  inputContainer: {
    paddingTop: hp(2),
    width: "85%",
    gap: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 10,
    borderRadius: 13,
    borderColor: Colors.input,
    borderWidth: 1,
  },
  inputText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  input: {
    color: Colors.input,
    flex: 1,
  },
  bouncyText: {
    fontSize: wp(3.3),
    textDecorationLine: "none",
  },
  errorText: {
    color: "red",
    fontSize: wp(3),
    marginTop: 5,
  },
});

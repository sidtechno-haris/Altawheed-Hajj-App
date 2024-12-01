import React, { useRef, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
} from "react-native";
import { Background, Button, Loading, ScreensHeader } from "../../components";
import { Colors } from "../../constants/Colors";
import { hp, wp } from "../../constants/Dimentions";
import GlobalStyles from "../../constants/GlobalStyles";
import { PencilIcon } from "react-native-heroicons/outline";
import * as ImagePicker from "react-native-image-picker";
import PhoneInput from "react-native-phone-number-input";
import { useGlobalState } from "../../constants/GlobalStorage";
import { fetchDataWithTokenandParams } from "../../Api/ApiRoute";
import { onDisplayNotification } from "../../constants/LocalNotification";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const AddUser = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [formData, setFormData] = useState({
    groupName: "",
    name: "",
    phoneNumber: "",
    image: null,
  });

  const [errors, setErrors] = useState({}); // Error state for validation
  const { token, groupId } = useGlobalState();
  const phoneInput = useRef(null);
  const [loading, setLoading] = useState(false);

  const entry = [
    { id: 1, name: "Name", field: "name", large: false },
    { id: 2, name: "Location", field: "location", large: false },
    { id: 3, name: "Phone Number", field: "phoneNumber", large: false },
  ];

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: "photo",
      quality: 1,
      presentationStyle: "formSheet",
      selectionLimit: 1,
    });

    if (result.didCancel) {
      ToastAndroid.show(t("No image selected"), ToastAndroid.SHORT);
    } else if (result.assets && result.assets.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        image: result.assets[0],
      }));
      setErrors((prevErrors) => ({ ...prevErrors, image: "" })); // Clear error if any
    }
  };

  const handleChange = (value, field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" })); // Clear error on input
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.image) {
      newErrors.image = t("Image is required");
      isValid = false;
    }
    // if (!formData.groupName) {
    //   newErrors.groupName = t("Group Name is required");
    //   isValid = false;
    // }
    if (!formData.name) {
      newErrors.name = t("Name is required");
      isValid = false;
    }
    if (!formData.location) {
      newErrors.location = t("location is required");
      isValid = false;
    }
    if (
      !formData.phoneNumber ||
      !phoneInput.current?.isValidNumber(formData.phoneNumber)
    ) {
      newErrors.phoneNumber = t("Enter a valid phone number");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (validateForm()) {
      setLoading(true);
      let formPost = new FormData();

      formPost.append("name", formData.name);
      formPost.append("long", 0);
      formPost.append("lat", 0);
      formPost.append("phoneNumber", formData.phoneNumber);
      formPost.append("groupId", groupId);

      if (formData.image) {
        const imageFile = {
          uri: formData?.image?.uri,
          name: formData?.image?.fileName,
          type: formData?.image?.type,
        };

        formPost.append("image", imageFile);
      }

      try {
        // Make POST request using axios
        const response = await fetch(
          "https://hajjbackend.sidtechno.com/addMemberInMyCircle",
          {
            method: "POST",
            headers: {
              "Content-Type": "multipart/form-data", // Make sure the content type is set to multipart/form-data
              Authorization: `Bearer ${token}`, // Add token if needed
            },
            body: formPost, // Attach the FormData
          }
        );

        const responseData = await response.json();

        console.log(responseData);

        if (response.ok) {
          ToastAndroid.show(t("User added successfully"), ToastAndroid.SHORT);

          onDisplayNotification({
            title: "Al-Tawheed",
            body: "Member will be added shortly",
          });
          setFormData({
            name: "",
            phoneNumber: "",
            image: null,
          });
        } else {
          throw new Error(responseData.message || t("Error creating group"));
        }
      } catch (error) {
        console.error(
          "Error adding user:",
          error.response?.data || error.message
        );
        ToastAndroid.show(t("Failed to add user"), ToastAndroid.SHORT);
      } finally {
        // Ensure loading state is reset
        setLoading(false);
      }
    } else {
      // Show validation errors
      ToastAndroid.show(t("Please fix the errors"), ToastAndroid.SHORT);
    }
  };

  return (
    <>
      {loading && <Loading />}

      <Background
        source={require("../../../assets/image.png")}
        backgroundColor={"#ffffff98"}
      >
        <ScreensHeader Title={t("Add Circle")} />
        <KeyboardAwareScrollView
          removeClippedSubviews={false}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "flex-start",
            flexGrow: 1,
          }}
          enableOnAndroid={true}
          extraScrollHeight={hp(3)}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.Container}>
            <View style={{ padding: 15 }}>
              <TouchableOpacity onPress={handleImagePicker}>
                <Image
                  source={
                    formData.image
                      ? { uri: formData?.image?.uri }
                      : require("../../../assets/add.png")
                  }
                  style={styles.Image}
                />
                <View style={styles.pencil}>
                  <PencilIcon color={"#fff"} size={wp(6)} />
                </View>
              </TouchableOpacity>
              {errors.image ? (
                <Text style={[styles.errorText, { textAlign: "center" }]}>
                  {errors.image}
                </Text>
              ) : null}

              {entry.map((item) => (
                <View key={item.id}>
                  <Text style={styles.Text}>{t(item.name)}</Text>

                  {item.name === "Phone Number" ? (
                    <PhoneInput
                      ref={phoneInput}
                      value={formData[item.field]}
                      defaultCode="US"
                      layout="first"
                      onChangeText={(value) => handleChange(value, item.field)}
                      containerStyle={styles.phoneInputContainer}
                      textContainerStyle={styles.phoneTextContainer}
                      textInputProps={{
                        placeholderTextColor: "#00000055",
                        placeholder: "000000000",
                      }}
                    />
                  ) : (
                    <TextInput
                      style={[
                        styles.Input,
                        { textAlign: isArabic ? "right" : "left" },
                      ]}
                      value={formData[item.field]}
                      onChangeText={(value) => handleChange(value, item.field)}
                      placeholder={t(item.name)}
                      placeholderTextColor={"#00000033"}
                    />
                  )}
                  {errors[item.field] ? (
                    <Text
                      style={[
                        styles.errorText,
                        {
                          textAlign: isArabic ? "right" : "left",
                        },
                      ]}
                    >
                      {errors[item.field]}
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>
            <Button
              onPress={() => {
                handleSave();
              }}
              style={{ width: wp(90) }}
              title={t("Save")}
            />
          </View>
        </KeyboardAwareScrollView>
      </Background>
    </>
  );
};

export default AddUser;

const styles = StyleSheet.create({
  Input: {
    borderColor: Colors.primary,
    borderWidth: 1,
    backgroundColor: "#fff",
    borderRadius: 15,
    height: hp(6),
    color: Colors.primary,
    padding: 10,
    fontSize: wp(3.5),
  },
  Text: {
    color: Colors.primary,
    fontSize: wp(3.8),
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
    ...GlobalStyles.CustomFonts,
  },
  Image: {
    width: wp(30),
    height: wp(30),
    alignSelf: "center",
    marginVertical: 20,
    borderRadius: wp(100),
    backgroundColor: Colors.primary,
  },
  Container: { justifyContent: "space-between", flex: 1, paddingBottom: hp(5) },
  pencil: {
    backgroundColor: Colors.dark,
    alignSelf: "center",
    borderRadius: 50,
    width: wp(8),
    height: wp(8),
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 25,
    right: wp(35),
  },
  errorText: {
    color: "red",
    fontSize: wp(2.8),
    marginTop: 5,
    paddingHorizontal: 10,
  },
  phoneInputContainer: {
    width: wp(93),
    height: 60,
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#fff",
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 15,
  },
  phoneTextContainer: {
    height: 80,
    backgroundColor: "#fff",
  },
});

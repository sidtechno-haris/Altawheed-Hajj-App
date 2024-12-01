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

const AddUser = () => {
  const [formData, setFormData] = useState({
    groupName: "",
    name: "",
    phoneNumber: "",
    image: null,
  });

  const [errors, setErrors] = useState({}); // Error state for validation
  const { language, token } = useGlobalState();
  const phoneInput = useRef(null);
  const [loading, setLoading] = useState(false);

  const entry = [
    { id: 1, name: "Group Name", field: "groupName", large: false },
    { id: 2, name: "Name", field: "name", large: false },
    { id: 3, name: "Location", field: "location", large: false },
    { id: 4, name: "Number", field: "phoneNumber", large: false },
  ];

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: "photo",
      quality: 1,
      presentationStyle: "formSheet",
      selectionLimit: 1,
    });

    if (result.didCancel) {
      ToastAndroid.show("No image selected", ToastAndroid.SHORT);
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
      newErrors.image = "Image is required";
      isValid = false;
    }
    if (!formData.groupName) {
      newErrors.groupName = "Group Name is required";
      isValid = false;
    }
    if (!formData.name) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    if (!formData.location) {
      newErrors.location = "location is required";
      isValid = false;
    }
    if (
      !formData.phoneNumber ||
      !phoneInput.current?.isValidNumber(formData.phoneNumber)
    ) {
      newErrors.phoneNumber = "Enter a valid phone number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    let formPost = new FormData(); // Initialize FormData

    if (validateForm()) {
      // Append form data
      formPost.append("groupName", formData.groupName);
      formPost.append("name", formData.name);
      formPost.append("phoneNumber", formData.phoneNumber);

      if (formData.image) {
        const imageFile = {
          uri: formData?.image?.uri,
          name: formData?.image?.fileName,
          type: formData?.image?.type,
        };

        formPost.append("image", imageFile);
      }

      await fetchDataWithTokenandParams(
        "addCircle",
        token,
        formPost,
        setLoading
      )
        .then((data) => {
          console.log(data);
        })
        .catch((error) => console.error(error));

      ToastAndroid.show("Group Created successfully", ToastAndroid.SHORT);

      // Display notification
      onDisplayNotification({
        title: "Al-Tawheed",
        body: "Member will be added shortly",
      });

      // Reset form data
      setFormData({
        groupName: "",
        name: "",
        phoneNumber: "",
        image: null,
      });
    } else {
      ToastAndroid.show("Please fix the errors", ToastAndroid.SHORT);
    }
  };

  return (
    <>
      {loading && <Loading />}

      <Background
        source={require("../../../assets/image.png")}
        backgroundColor={"#ffffff98"}
      >
        <ScreensHeader Title={"Add Circle"} />
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
              <Text style={styles.errorText}>{errors.image}</Text>
            ) : null}

            {entry.map((item) => (
              <View key={item.id}>
                <Text style={styles.Text}>{item.name}</Text>

                {item.name === "Number" ? (
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
                    style={item.large ? styles.InputLarge : styles.Input}
                    value={formData[item.field]}
                    onChangeText={(value) => handleChange(value, item.field)}
                    placeholder={item.name}
                    placeholderTextColor={"#00000033"}
                  />
                )}
                {errors[item.field] ? (
                  <Text
                    style={[
                      styles.errorText,
                      {
                        textAlign: item.name === "image" ? "center" : "left",
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
            title={"Save"}
          />
        </View>
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

import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import {
  PaperAirplaneIcon,
  Squares2X2Icon,
} from "react-native-heroicons/outline";
import { Colors } from "../../constants/Colors";
import { hp, wp } from "../../constants/Dimentions";
import GlobalStyles from "../../constants/GlobalStyles";

const InputView = ({ onSend }) => {
  const [messages, setMessages] = useState("");

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={messages}
        onChangeText={(e) => setMessages(e)}
        placeholder="Type a message..."
        multiline
        placeholderTextColor={Colors.bg}
      />
      <View style={styles.iconContainer}>
        {messages.length < 1 && (
          <TouchableOpacity>
            <Squares2X2Icon color={Colors.primary} size={wp(7)} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => {
            onSend(messages);
            setMessages("");
          }}
        >
          <PaperAirplaneIcon color={Colors.primary} size={wp(7)} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InputView;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: "95%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    paddingVertical: 10,
    borderColor: Colors.primary,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 5,
  },
  iconContainer: {
    gap: 10,
    flexDirection: "row",
  },
  input: {
    fontSize: wp(4),
    color: Colors.dark,
    paddingHorizontal: 10,
    flex: 1,
    maxHeight: hp(15),
    ...GlobalStyles.CustomFonts,
  },
});

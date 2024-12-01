import React from "react";
import { Text as RNText } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { Storage } from "../../constants/Store/mmkv";

const Text = ({ children, style, ...props }) => {
  const [selected] = useMMKVString("language", Storage);

  return (
    <RNText
      lineBreakMode="tail"
      textBreakStrategy="highQuality"
      style={[
        style,
        {
          fontFamily:
            selected === "English" ? "SquadaOne-Regular" : "Cairo-Bold",
        },
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default Text;

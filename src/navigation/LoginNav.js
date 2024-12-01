import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Campaign,
  EnableLocation,
  GetStarted,
  Hajj_Pilgrim,
  Login,
} from "../app";

const LoginNav = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        animation: "slide_from_bottom",
        presentation: "card",
        headerShown: false,
        statusBarTranslucent: true,
        contentStyle: {
          backgroundColor: "transparent",
        },
      }}
    >
      <Stack.Screen name="Hajj_Pilgrim" component={Hajj_Pilgrim} />
      <Stack.Screen name="HajjCampaign" component={Campaign} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="EnableLocation" component={EnableLocation} />
      <Stack.Screen name="GetStarted" component={GetStarted} />
    </Stack.Navigator>
  );
};

export default LoginNav;

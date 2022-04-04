import { useEffect, useRef, useState } from "react";
import { View, Text, SafeAreaView, ScrollView, Animated } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "./loginScreen";
import { SendImage } from "./sendImageProfile";

const Stack = createNativeStackNavigator();
export function Login() {

  return  <NavigationContainer>
     <Stack.Navigator
        screenOptions={{ statusBarHidden: true, headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Image" component={SendImage} />
      </Stack.Navigator>
</NavigationContainer>
}

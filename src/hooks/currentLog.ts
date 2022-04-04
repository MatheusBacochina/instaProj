import { Animated, Dimensions } from "react-native";
import { useState } from "react";
const wd = Dimensions.get("window").width;
export function current() {
    const [register] = useState(new Animated.Value(wd));
    const [login] = useState(new Animated.Value(0));
  const eventsScreen: any = {
    register: () => {
      Animated.parallel([
        Animated.spring(register, {
          toValue: 0,
          velocity: 1000,
          useNativeDriver: true,
        }),

        Animated.spring(login, {
          toValue: -wd,
          velocity: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    },
    login: () => {
      Animated.parallel([
        Animated.spring(register, {
          toValue: wd,
          velocity: 1000,
          useNativeDriver: true,
        }),

        Animated.spring(login, {
          toValue: 0,
          velocity: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    },
  };

  return {eventsScreen, register, login};
}

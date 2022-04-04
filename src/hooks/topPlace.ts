import { useEffect, useState } from "react";
import { Animated } from "react-native";

export function topPlace() {
  const [emailTop] = useState(new Animated.Value(10));
  const [senhaTop] = useState(new Animated.Value(10));
  const [emailTopRegister] = useState(new Animated.Value(10));
  const [usernameRegister] = useState(new Animated.Value(10));
  const [senhaTopRegister] = useState(new Animated.Value(10));
  const canEmail = useState(false);
  const canSenha = useState(false);
  const canEmailRegister = useState(false);
  const canUsername = useState(false);
  const canSenhaRegister = useState(false);
  const eventsCans: any = {
    email: canEmail[0],
    senha: canSenha[0],
    emailRegister: canEmailRegister[0],
    username: canUsername[0],
    senhaRegister: canSenhaRegister[0]
  }


  const eventsEnter: any = {
    enter: (state: any, type: any) => {
      if (!eventsCans[type]) {
        Animated.timing(state, {
          toValue: -10,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } 
    },
  };

  const eventsExit: any = {
    exit: (state: any, type: any) => {
      if (!eventsCans[type]) {
        Animated.timing(state, {
          toValue: 10,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } 
    },
  };

  return {
    eventsEnter,
    eventsExit,
    emailTop,
    senhaTop,
    canEmail,
    canSenha,
    usernameRegister,
    emailTopRegister,
    senhaTopRegister,
    canEmailRegister,
    canUsername,
    canSenhaRegister
  };
}

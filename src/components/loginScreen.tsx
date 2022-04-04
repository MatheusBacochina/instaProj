import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useRef } from "react";
import { getFirestore } from "firebase/firestore";
import { useEffect, useState, useContext } from "react";
import { arrayUnion, updateDoc, doc } from "firebase/firestore";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
  Text,
  Button,
} from "react-native";
import { current } from "../hooks/currentLog";
import { topPlace } from "../hooks/topPlace";
import { MyContext } from "../context/api";
import { Keyboard } from "react-native";
import { Camera } from "expo-camera";

export function LoginScreen({ navigation }: any) {
  const emailLogin = useRef<TextInput>(null);
  const inputSenha = useRef<TextInput>(null);
  const usenameRef = useRef<TextInput>(null);
  const emailRegRef = useRef<TextInput>(null);
  const senhaRegRef = useRef<TextInput>(null);
  const email = useState("");
  const senha = useState("");
  const username = useState("");
  const emailRegister = useState("");
  const senhaRegister = useState("");
  const db = getFirestore();
  const { registerWithEmail, loginWithEmail, apiResp } = useContext(MyContext);
  const { eventsScreen, register, login } = current();
  const {
    eventsEnter,
    eventsExit,
    emailTop,
    senhaTop,
    canEmail,
    canSenha,
    emailTopRegister,
    usernameRegister,
    senhaTopRegister,
    canEmailRegister,
    canUsername,
    canSenhaRegister,
  } = topPlace();

  Keyboard.addListener("keyboardDidHide", () => {
    const refs: any = [
      inputSenha,
      emailLogin,
      usenameRef,
      emailRegRef,
      senhaRegRef,
    ];
    refs.forEach((val: any) => {
      val.current?.blur();
    });
  });

  return (
    <View style={styles.background}>
      <Animated.View
        style={[styles.registerBase, { transform: [{ translateX: login }] }]}
      >
        <Image
          resizeMode="contain"
          style={{ ...styles.logo }}
          source={require("../images/logoGrande.png")}
        ></Image>
        <View style={styles.bgInput}>
          <Animated.Text
            style={[
              styles.placeholder,
              { transform: [{ translateY: emailTop }] },
            ]}
          >
            Email
          </Animated.Text>

          <TextInput
            ref={emailLogin}
            onFocus={(e) => {
              eventsEnter["enter"](emailTop, "email");
            }}
            onBlur={() => eventsExit["exit"](emailTop, "email")}
            onChangeText={(e) => {
              if (e.length > 0) {
                canEmail[1](true);
              } else if (e.length === 0) {
                canEmail[1](false);
              }
              email[1](e);
            }}
            placeholderTextColor="white"
            style={styles.input}
          />
        </View>

        <View style={styles.bgInput}>
          <Animated.Text
            style={[
              styles.placeholder,
              { transform: [{ translateY: senhaTop }] },
            ]}
          >
            Senha
          </Animated.Text>
          <TextInput
            ref={inputSenha}
            secureTextEntry={true}
            onFocus={(e) => {
              eventsEnter["enter"](senhaTop, "senha");
            }}
            onBlur={() => eventsExit["exit"](senhaTop, "senha")}
            onChangeText={(e) => {
              if (e.length > 0) {
                canSenha[1](true);
              } else if (e.length === 0) {
                canSenha[1](false);
              }
              senha[1](e);
            }}
            placeholderTextColor="white"
            style={styles.input}
          />
        </View>
        <TouchableOpacity
          onPress={() => eventsScreen["register"](register, login)}
        >
          <Text style={styles.textTiny}>Não possui conta? Resgistre-se</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            email[0] && senha[0] ? loginWithEmail(email[0], senha[0]) : void 0;
          }}
          style={styles.button}
        >
          <Text style={styles.text}>{apiResp[0].buttom}</Text>
        </TouchableOpacity>
        <Text>{apiResp[0].response && apiResp[0].response}</Text>
      </Animated.View>

      <Animated.View
        style={[styles.registerBase, { transform: [{ translateX: register }] }]}
      >
        <Image
          resizeMode="contain"
          style={{ ...styles.logo }}
          source={require("../images/logoGrande.png")}
        ></Image>
        <View style={styles.bgInput}>
          <Animated.Text
            style={[
              styles.placeholder,
              { transform: [{ translateY: usernameRegister }] },
            ]}
          >
            Username
          </Animated.Text>
          <TextInput
            ref={usenameRef}
            onFocus={(e) => {
              eventsEnter["enter"](usernameRegister, "username");
            }}
            onBlur={() => eventsExit["exit"](usernameRegister, "username")}
            onChangeText={(e) => {
              if (e.length > 0) {
                canUsername[1](true);
              } else if (e.length === 0) {
                canUsername[1](false);
              }
              username[1](e);
            }}
            placeholderTextColor="white"
            style={styles.input}
          />
        </View>
        <View style={styles.bgInput}>
          <Animated.Text
            style={[
              styles.placeholder,
              { transform: [{ translateY: emailTopRegister }] },
            ]}
          >
            Email
          </Animated.Text>
          <TextInput
            ref={emailRegRef}
            onFocus={(e) => {
              eventsEnter["enter"](emailTopRegister, "emailRegister");
            }}
            onBlur={() => eventsExit["exit"](emailTopRegister, "emailRegister")}
            onChangeText={(e) => {
              if (e.length > 0) {
                canEmailRegister[1](true);
              } else if (e.length === 0) {
                canEmailRegister[1](false);
              }
              emailRegister[1](e);
            }}
            placeholderTextColor="white"
            style={styles.input}
          />
        </View>
        <View style={styles.bgInput}>
          <Animated.Text
            style={[
              styles.placeholder,
              { transform: [{ translateY: senhaTopRegister }] },
            ]}
          >
            Senha
          </Animated.Text>
          <TextInput
            ref={senhaRegRef}
            secureTextEntry={true}
            onFocus={(e) => {
              eventsEnter["enter"](senhaTopRegister, "senhaRegister");
            }}
            onBlur={() => eventsExit["exit"](senhaTopRegister, "senhaRegister")}
            onChangeText={(e) => {
              if (e.length > 0) {
                canSenhaRegister[1](true);
              } else if (e.length === 0) {
                canSenhaRegister[1](false);
              }
              senhaRegister[1](e);
            }}
            placeholderTextColor="white"
            style={styles.input}
          />
        </View>
        <TouchableOpacity
          style={{
            width: "70%",
            height: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => eventsScreen["login"](register, login)}
        >
          <Text style={styles.textTiny}>Possui conta? Faça login.</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            if ((username[0], emailRegister[0], senhaRegister[0])) {
              const user = await registerWithEmail(
                username[0],
                emailRegister[0],
                senhaRegister[0]
              );
              user ? navigation.push("Image", user) : console.log("Error");
            }
          }}
          style={styles.button}
        >
          <Text style={styles.text}>{apiResp[0].register}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#987ED1",
    alignItems: "center",
    justifyContent: "center",
  },
  loginBase: {
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: "50%",
  },
  logo: {
    width: "30%",
    height: 30,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: "100%",
    borderBottomColor: "white",
    borderBottomWidth: 1,
    color: "white",
  },
  button: {
    borderRadius: 100,
    marginTop: 10,
    width: 110,
    height: 40,
    backgroundColor: "#62479D",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    opacity: 1,
  },
  textTiny: {
    textAlign: "center",
    fontSize: RFPercentage(1.6),
    color: "white",
    opacity: 0.5,
  },
  registerBase: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: "50%",
  },
  placeholder: {
    position: "absolute",
    left: 0,
    color: "white",
    fontSize: RFPercentage(1.7),
    opacity: 0.8,
  },
  bgInput: {
    marginBottom: 15,
    width: "70%",
    height: 40,
  },
  linkTo: {},
});

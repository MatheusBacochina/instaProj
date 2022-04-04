import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import { updateProfile, getAuth } from "firebase/auth";
import { app } from "../services/firebase";
import * as ImagePicker from "expo-image-picker";
import { useContext } from "react";
import { MyContext } from "../context/api";
import { useState } from "react";
import { useEffect } from "react";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
export const SendImage = ({ navigation, route }: any) => {
  const auth: any = getAuth(app);
  const db = getFirestore();
  const { setcurrentUser } = useContext(MyContext);
  const url = useState<any>("");
  const title = useState("Salvar");
  const { params } = route;
  return (
    <View style={Styles.bg}>
      <View style={Styles.msg}>
        <Text style={Styles.txt}>Selecione sua foto de </Text>
        <Text style={[Styles.txt, Styles.str]}>Perfil</Text>
      </View>
      <Image
        resizeMode="cover"
        style={Styles.image}
        source={
          url[0] ? { uri: url[0].uri } : require("../images/userDefault.png")
        }
      ></Image>
      <TouchableOpacity
        onPress={async () => {
          let result: any = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
          });

          result.uri ? url[1](result) : void 0;
        }}
        style={Styles.bnt}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Selecionar Imagem
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          title[1]("Carrendo...");
          if (url[0]) {
            const blob: Blob = await new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.onload = function () {
                resolve(xhr.response);
              };
              xhr.onerror = function () {
                reject(new TypeError("Network request failed"));
              };
              xhr.responseType = "blob";
              xhr.open("GET", url[0].uri, true);
              xhr.send(null);
            });

            const storage = getStorage();

            const storageRef = ref(storage, `pic/${params.email}`);
            uploadBytes(storageRef, blob).then((snapshot) => {
              title[1]("Salvar");

              getDownloadURL(snapshot.ref).then(async (downloadURL) => {
                console.log("File available at", downloadURL);
                console.log(params);
                await setDoc(doc(db, "users", params.displayName), {
                  name: params.displayName,
                  email: params.email,
                  imageUrl: downloadURL,
                  seguindo: [params.displayName],
                });
                updateProfile(auth.currentUser, {
                  photoURL: downloadURL,
                });
                setcurrentUser({ ...params, photoURL: downloadURL });
              });
            });
          }
        }}
        style={Styles.bnt}
      >
        <Text style={{ color: "white" }}>{title[0]}</Text>
      </TouchableOpacity>
    </View>
  );
};

const Styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9681d9",
    flexDirection: "column",
  },
  msg: {
    width: "50%",
    flexDirection: "row",
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  txt: {
    fontSize: 20,
    color: "white",
  },
  str: {
    fontSize: 23,
    textDecorationLine: "underline",
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
  },
  bnt: {
    justifyContent: "center",
    alignItems: "center",
    width: 130,
    height: 50,
    marginTop: 16,
    borderRadius: 10,
    backgroundColor: "#62479D",
  },
});

import {
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Text,
  TextInput,
  Animated,
  Dimensions,
  Button,
  LogBox,
} from "react-native";
import {
  getFirestore,
  getDoc,
  doc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { Styles } from "../styles/home";
import { Posts } from "../components/Posts";
import { BottomNav } from "../styles/postsStyles";
import { MyContext } from "../context/api";
import { useContext, useState } from "react";
import { useEffect } from "react";
const { height, width } = Dimensions.get("window");
let canAnimat = true;
const db = getFirestore();
export const Feed = ({ props, refScroll, canScroll, scrollWidthRef }: any) => {
  LogBox.ignoreLogs(["Setting a timer"]);
  const lista = useState([]);
  const toScroll = (val: number) => {
    refScroll.current.scrollTo({ x: val, animated: true });
  };
  const { currentUser, getPosts, setposts, posts } = useContext(MyContext);

  useEffect(() => {
    setposts([]);
    getPosts(setposts);
  }, []);

  useEffect(() => {
    console.log(posts, "-----------------------------|");
  }, [posts]);

  const url = useState<any>("");
  const inputNewPost = useState<any>("");
  const [addStyleValue] = useState(new Animated.Value(height));

  useEffect(() => {
    console.log(url[0]);
  }, [url[0]]);

  function timeout(bool: boolean) {
    if (bool === false) {
      const time = setTimeout(() => {
        canScroll[1]((prev: boolean) => !prev);
        canAnimat = true;
        clearInterval(time);
      }, 1000);
    } else {
      canScroll[1]((prev: boolean) => !prev);
      canAnimat = true;
    }
  }

  const animations: any = {
    false: () => {
      console.log("false");
      Animated.timing(addStyleValue, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
      timeout(false);
    },
    true: () => {
      console.log("true");
      Animated.timing(addStyleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      timeout(true);
    },
  };

  return (
    <View {...props}>
      <View style={Styles.Nav}>
        <TouchableOpacity onPress={() =>{
          getPosts(setposts)
        }} style={{width: 70, height:'100%', marginLeft: 16, marginTop: 10 }} >
        <ImageBackground 
        resizeMethod="scale"
        source={require('../images/logo.png')}
        style={{flex: 1}}
        resizeMode="contain"
        ></ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity>
          <ImageBackground
            resizeMode="cover"
            source={
              currentUser.photoURL
                ? { uri: currentUser.photoURL }
                : require("../images/userDefault.png")
            }
            style={{
              width: 50,
              height: 50,
              marginTop: 7,
              marginRight: 10,
              borderRadius: 100,
              overflow: "hidden",
            }}
            imageStyle={{
              resizeMode: "contain",
            }}
          ></ImageBackground>
        </TouchableOpacity>
      </View>
      {posts.length > 0 ? (
        <Posts posts={posts} />
      ) : (
        <Text style={{ color: "white" }}>Carregando...</Text>
      )}
      {!canScroll[0] && (
        <Animated.View
          style={[
            Styles.addStyle,
            { transform: [{ translateY: addStyleValue }] },
          ]}
        >
          <Image
            style={{ width: 340, height: 340 }}
            source={
              !url[0] ? require("../images/noimage.png") : { uri: url[0].uri }
            }
          ></Image>
          <TextInput
            onChangeText={(e) => inputNewPost[1](e)}
            style={{
              color: "white",
              width: "80%",
              height: 40,
              borderBottomWidth: 2,
              borderBottomColor: "white",
              marginTop: 30,
            }}
            placeholderTextColor="white"
            placeholder="Digite Sua Legenda"
          ></TextInput>
          <TouchableOpacity
            style={{
              padding: 16,
              backgroundColor: "#62479D",
              marginTop: 16,
              borderRadius: 10,
            }}
            onPress={async () => {
              let result: any = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1,
              });

              result.uri ? url[1](result) : void 0;
            }}
          >
            <Text style={{ color: "white" }}>Selecionar Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              if (url[0].uri) {
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

                const storageRef = ref(storage, `posts/${Math.random()}}`);
                uploadBytes(storageRef, blob).then((snapshot: any) => {
                  getDownloadURL(snapshot.ref).then(
                    async (downloadURL: any) => {
                      console.log(currentUser);
                      const docRef = await addDoc(collection(db, "posts"), {
                        autor: currentUser.displayName,
                        userUrl: currentUser.photoURL,
                        url: downloadURL,
                        coment: inputNewPost[0],
                      });
                      canScroll[1](true);
                      url[1]("");
                      inputNewPost[1]("");
                      setposts([]);
                      getPosts(setposts);
                    }
                  );
                });
              }
            }}
            disabled={url[0].uri && inputNewPost[0].length > 0 ? false : true}
            style={{
              padding: 16,
              backgroundColor: "#62479D",
              marginTop: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "white" }}>Postar</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      <BottomNav>
        <TouchableOpacity onPress={() => canScroll[0] && toScroll(0)}>
          <ImageBackground
            style={{
              width: 50,
              height: 32,
            }}
            imageStyle={{
              resizeMode: "contain",
            }}
            source={require("../images/users.png")}
          ></ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (canAnimat) {
              canAnimat = false;
              animations[canScroll[0]]();
              url[1]("");
              inputNewPost[1]("");
            }
          }}
        >
          <ImageBackground
            style={{
              width: 50,
              height: 32,
            }}
            imageStyle={{
              resizeMode: "contain",
            }}
            source={require("../images/add.png")}
          ></ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => canScroll[0] && toScroll(width * 2)}>
          <ImageBackground
            style={{
              width: 50,
              height: 32,
            }}
            imageStyle={{
              resizeMode: "contain",
            }}
            source={require("../images/msgs.png")}
          ></ImageBackground>
        </TouchableOpacity>
      </BottomNav>
    </View>
  );
};

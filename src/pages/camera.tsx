import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { Children, useContext, useState } from "react";
import { useEffect } from "react";
import { MyContext } from "../context/api";
import {
  collection,
  query,
  where,
  getDoc,
  getDocs,
  arrayUnion,
  arrayRemove,
  updateDoc,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {
  useFonts,
  Inter_900Black,
  Inter_300Light,
} from "@expo-google-fonts/inter";
import { current } from "../hooks/currentLog";

let canSearch = true;

export const Users = ({ props }: any) => {
  const { currentUser, getPosts, setposts, posts, loaded } =
    useContext(MyContext);
  const [seguindo, setSeguindo] = useState<any>([]);
  const [input, setInput] = useState("");
  const [titulo, setTitulo] = useState("...");
  
  const data = useState<any | null>({});
  let [fontsLoaded] = useFonts({
    Inter_900Black,
    Inter_300Light,
  });
  const db = getFirestore();
 
  async function createRoomChat() {
    let cont: any = false;
  
    const citiesRef = collection(db, "mensages");
    const q = query(citiesRef, where("users", "array-contains", currentUser.displayName));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(v => {
      if(v.data().users.includes(data[0].name)){
        cont = true
      }
    })
  if(cont === false){
    const docRef = await addDoc(collection(db, "mensages"), {
      users: [currentUser.displayName, data[0].name],
    });
  }
  }

  async function iFolow() {
    const docRef = doc(db, "users", currentUser.displayName);
    const docSnap: any = await getDoc(docRef);
    setSeguindo(docSnap.data().seguindo);
  }

  async function searchUsers() {
    const q = query(collection(db, "users"), where("name", "==", input));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc: any) => {
      console.log('carregou')
      data[1](doc.data());
    });
  }
  useEffect(() => {
    if (input.length > 0) {
      iFolow();
  
    }
  }, []);

  useEffect(() =>{
    if(canSearch){
      searchUsers()
    }
  },[input])

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "users", currentUser.displayName),
      (doc) => {
        if (data[0].name && doc.data()?.seguindo.includes(data[0].name)) {
          console.log('aqui1')
          setTitulo("Unfollow");
        } else {
          console.log('aqui2')
          setTitulo("Follow");
        }
        getPosts(setposts);
      }
    );
  }, [seguindo, data[0]]);

  useEffect(() => {
    console.log(data[0]);
  }, [data[0]]);

  return (
    <View style={styles.base} {...props}>
      <Text style={styles.mensageUser}>Pesquisar Usuarios</Text>
      <TextInput
        onChangeText={(e: any) => {
          if (e.length === 0) {
            data[1]({});
          } else {
            if (canSearch) {
              let time = setTimeout(() => {
               
                setInput(e);
                clearTimeout(time);
                
                canSearch = true;
              }, 1000);
            }
          }
        }}
        style={styles.input}
        placeholder="Nome do Usuario"
        placeholderTextColor="gray"
      ></TextInput>
      {!data[0].name && input.length > 1 ? (
        <Text style={{ marginTop: 16, color: "white" }}>Carregando...</Text>
      ) : (
        void 0
      )}
      {data[0].name && data[0].name !== currentUser.displayName && (
        <View style={styles.bar}>
          <Image style={styles.pic} source={{ uri: data[0].imageUrl }}></Image>
          <Text style={{ fontSize: 20, color: "black" }}>{data[0].name}</Text>
          <TouchableOpacity
            style={{
              width: 100,
              height: 40,
              marginTop: 20,
              backgroundColor: "#62479D",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
            }}
            onPress={async () => {
              createRoomChat();
              const docRefer = doc(db, "users", currentUser.displayName);
              if (data[0].name) {
                if (seguindo.includes(data[0].name)) {
                  await updateDoc(docRefer, {
                    seguindo: arrayRemove(data[0].name),
                  });
                } else {
                  await updateDoc(docRefer, {
                    seguindo: arrayUnion(data[0].name),
                  });
                
                }
              }
              iFolow();
            }}
          >
            <Text style={{ color: "white" }}>{titulo}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mensageUser: {
    color: "white",
    marginTop: 150,
    fontSize: RFPercentage(3),
    marginBottom: 16,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  input: {
    marginTop: 16,
    width: 250,
    height: 40,
    backgroundColor: "white",
    textAlign: "center",
    borderRadius: 10,
  },
  bar: {
    paddingTop: 40,
    justifyContent: "flex-start",
    alignItems: "center",
    width: 250,
    height: 350,
    marginTop: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    backgroundColor: "white",
  },
  base: {
    flex: 1,
    justifyContent: "center",
  },
  pic: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 20,
  },
});

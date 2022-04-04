import {
  View,
  TextInput,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
} from "react-native";
import {
  query,
  where,
  collection,
  setDoc,
  getFirestore,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import {
  getDatabase,
  ref,
  onValue,
  get,
  set,
  push,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
} from "firebase/database";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../context/api";
import { app } from "../services/firebase";

let listener: any;


export function Mensages() {
  const database = getDatabase();
  const input = useState("");
  const { currentUser} = useContext(MyContext);
  const [lista, setlista] = useState([])
  const rooms = useState<any>([]);
  const currentRoom = useState<any>({});
  const msgsCurrentRoom = useState<any>({});
  const db = getFirestore();

  async function getUrl(v: [string]) {
    let res = v.filter((val) => val !== currentUser.displayName);
    const docRef = doc(db, "users", res[0]);
    const docSnap = await getDoc(docRef);

    return docSnap.data();
  }

  async function getMensages() {
    async function geter() {
      let arr: any = [];
      const citiesRef = collection(db, "mensages");
      const q = query(
        citiesRef,
        where("users", "array-contains", currentUser.displayName)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (v) => {
        arr.push({ id: v.id, ...v.data() });
      });
      return await arr;
    }


  
    let datasResponse = await geter();
    const response: any = [];

    for await (let i of datasResponse) {
      let res = await getUrl(i.users);
      const { imageUrl, name }: any = res;

      response.push({ id: i.id, imageUrl, name });
    }
    rooms[1](response);
  }

  function RealTimer() {
    for (let val of rooms[0]) {
      const data = ref(database, "salas/" + val.id);
      onValue(data, (resp) => {
        if (resp.exists()) {
          return;
        } else {
          console.log("opa");
          set(ref(database, "salas/" + val.id), {
            qualquer: "11",
          });
         
        }
      });
    }
  }



 onSnapshot(doc(db, "users", currentUser.displayName), (doc) => {

  clearTimeout(listener)
  listener = setTimeout(() =>{
    RealTimer()
    getMensages()
    console.log('executou')
  }, 1000)

  

});

  async function geterList(){
    const docRef = doc(db, "users", currentUser.displayName);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      setlista(docSnap.data().seguindo)
    } else {
     
      console.log("No such document!");
    }
  }

 

  useEffect(() => {
    geterList()
    getMensages();
    RealTimer();
  }, []);



  useEffect(() => {
    if (Object.keys(currentRoom[0]).length > 1) {
      currentRoom[1]({
        ...rooms[0][currentRoom[0].index],
        index: currentRoom[0].index,
      });
    }
  }, [rooms[0]]);

  if (currentRoom[0].id) {
    const db = getDatabase();
    const commentsRef = ref(db, "salas/" + currentRoom[0].id);
    onChildChanged(commentsRef, (data) => {
      
      msgsCurrentRoom[1](data.val());
    });
  }

  useEffect(() => {
    console.log(msgsCurrentRoom[0]);
  }, [msgsCurrentRoom[0]]);

  useEffect(() => {
    if (currentRoom[0].id && msgsCurrentRoom[0]) {
      const db = getDatabase();
      const starCountRef = ref(db, "salas/" + currentRoom[0].id);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        msgsCurrentRoom[1](data);
      });
    }
  }, [currentRoom[0]]);

  
  return (
    <View style={{ width: "100%", height: "100%", alignItems: "center" }}>
      {currentRoom[0].id ? (
        <View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#866AC1",
            position: "absolute",
            paddingBottom: 75,
            zIndex: 10,
          }}
        >
          <View
            style={{
              width: "100%",
              height: 70,
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 10,
            }}
          >
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,

                alignSelf: "flex-start",
              }}
              onPress={() => {
                getMensages();
                msgsCurrentRoom[1]({});
                currentRoom[1]({});
              }}
            >
              <ImageBackground
                style={{
                  flex: 1,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.22,
                  shadowRadius: 2.22,

                  elevation: 3,
                }}
                source={require("../images/ceta.png")}
                resizeMode="contain"
              ></ImageBackground>
            </TouchableOpacity>
            <View
              style={{
                top: 1,
                position: "absolute",
                width: 110,
                height: 110,
                backgroundColor: "#5733a7",
                borderRadius: 100,
                marginTop: 10,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowOpacity: 0.34,
                shadowRadius: 6.27,
                elevation: 10,
                overflow: "hidden",
                borderWidth: 3,
                borderColor: "white",
              }}
            >
              <ImageBackground
                source={{
                  uri: currentRoom[0].imageUrl && currentRoom[0].imageUrl,
                }}
                resizeMode="cover"
                style={{ flex: 1 }}
              ></ImageBackground>
            </View>
          </View>

          <ScrollView style={{ width: "100%", marginTop: 60, paddingTop: 16 }}>
            {msgsCurrentRoom[0] !== null &&
            msgsCurrentRoom[0] !== undefined &&
            msgsCurrentRoom[0].mensages &&
            Object.keys(msgsCurrentRoom[0]).length > 0 ? (
              Object.keys(msgsCurrentRoom[0].mensages).map((val) => (
                <View
                  style={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexDirection: "row",
                    padding: 10,
                    backgroundColor: "#ffffff28",
                    width: "70%",
                    marginBottom: 10,
                    alignSelf:
                      msgsCurrentRoom[0].mensages &&
                      msgsCurrentRoom[0].mensages[val]?.user ===
                        currentUser.displayName
                        ? "flex-end"
                        : "flex-start",
                    borderRadius: 10,
                  }}
                >
                  <Image
                    style={{
                      marginRight: 16,
                      width: 30,
                      height: 30,
                      borderRadius: 100,
                    }}
                    source={{
                      uri:
                        msgsCurrentRoom[0].mensages[val].url !== undefined &&
                        msgsCurrentRoom[0].mensages[val].url,
                    }}
                  ></Image>
                  <Text style={{ color: "white" }}>
                    {msgsCurrentRoom[0] &&
                      msgsCurrentRoom[0].mensages[val].content}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={{ color: "white", marginLeft:'30%' }}>Sem Mensagens</Text>
            )}
          </ScrollView>
          <View
            style={{
              width: "100%",
              height: 70,
              backgroundColor: "white",
              position: "absolute",
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <TextInput
              onChangeText={(e) => input[1](e)}
              placeholder="Digite sua Mensagem"
              style={{
                width: "80%",
                height: "100%",
                alignSelf: "flex-start",
                textAlign: "left",
                marginLeft: 20,
                fontSize: 15,
              }}
            ></TextInput>
            <TouchableOpacity
              onPress={async () => {
                const db = ref(
                  database,
                  "salas/" + currentRoom[0].id + "/mensages"
                );
                const res = push(db);

                set(res, {
                  user: currentUser.displayName,
                  content: input[0],
                  url: currentUser.photoURL,
                });
              }}
              style={{ width: "20%", height: "90%", }}
            ><ImageBackground  resizeMode="contain" source={require('../images/s.png')} style={{flex: 1}}></ImageBackground></TouchableOpacity>
          </View>
        </View>
      ) : (
        void 0
      )}
      <Text
        style={{
          color: "white",
          marginTop: 16,
          fontSize: 30,
          marginBottom: 16,
          textShadowColor: "rgba(0, 0, 0, 0.25)",
          textShadowOffset: { width: -1, height: 1 },
          textShadowRadius: 10,
        }}
      >
        Mensagens
      </Text>
      {rooms[0].length > 0 &&
        rooms[0].map((val: any, index: number) => (
          <TouchableOpacity
            onPress={() => currentRoom[1]({ ...val, index })}
            style={{
              alignItems: "center",
              flexDirection: "row",
              width: "80%",
              height: 70,
              backgroundColor: "white",
              borderRadius: 10,
              marginBottom: 16,
            }}
          >
            <Image
              style={{
                marginLeft: 16,
                width: 50,
                height: 50,
                borderRadius: 100,
              }}
              source={{ uri: val.imageUrl }}
            ></Image>
            <Text
              style={{
                fontSize: 20,
                marginLeft: 10,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
              }}
            >
              {val.name}
            </Text>
          </TouchableOpacity>
        ))}
        {rooms[0].length ===0 && <Text style={{color:'white'}}>Carregando...</Text>}
    </View>
  );
}

import { createContext, ReactNode, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { getFirestore, getDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  getAuth,
} from "firebase/auth";
import { app } from "../services/firebase";
import { useEffect } from "react";
export const MyContext = createContext<any | null>(null);
const auth: any = getAuth(app);
export const ContextProvider = ({ children }: any) => {
  const db = getFirestore();
  const apiResp = useState({ buttom: "Login", register: "Registre-se" });
  const [currentUser, setcurrentUser] = useState<any>(null);

  async function toFirestoreUser(username: string, email: string) {
    await setDoc(doc(db, "users", username), {
      name: username,
      email: email,
    });
  }

  async function setDisplayname(
    username: string,
    email: string,
    senha: string
  ) {
    let resp = await updateProfile(auth.currentUser, {
      displayName: username,
      photoURL: "",
    })
      .then(async (e) => {
        let can: any = await signInWithEmailAndPassword(auth, email, senha)
          .then((userCredential) => {
            const user = userCredential.user;
            apiResp[1]((prev) => ({ ...prev, register: "Registre-se" }));
            return user;
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
          });
        return can;
      })
      .catch((error) => {
        console.log(error);
      });
    return resp;
  }

  async function registerWithEmail(
    username: string,
    email: string,
    senha: string
  ) {
    apiResp[1]((prev) => ({ ...prev, register: "Carregando" }));
    let res = await createUserWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        const user = userCredential.user;
        toFirestoreUser(username, email);
        return setDisplayname(username, email, senha);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
    return res;
  }

  async function getPosts(seter: any) {
    const q = query(
      collection(db, "users"),
      where("name", "==", currentUser.displayName)
    );

    const querySnapshot = await getDocs(q, );
    let cont = 0;
    let arr: any = [];
    querySnapshot.forEach(async (doc) => {
      let arrUsers = await doc.data().seguindo;
      const q = query(collection(db, "posts"), where("autor", "in", arrUsers));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (cont === 0) {
          arr = [];
        }

        arr.push(doc.data());

        cont += 1;
      });

      setposts(arr);
    });
  }
  async function loginWithEmail(email: string, password: string) {
    apiResp[1]((prev) => ({ ...prev, buttom: "Carregando" }));
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        apiResp[1]((prev) => ({ ...prev, buttom: "Login" }));
        apiResp[1]((prev) => ({ ...prev, response: "" }));
        setcurrentUser(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        apiResp[1]((prev) => ({
          ...prev,
          response: errorMessage,
          buttom: "Login",
        }));
      });
  
    }
const loaded = useState('loaded')
    
  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);
  const [posts, setposts] = useState([]);
  return (
    <MyContext.Provider
      value={{
        registerWithEmail,
        loginWithEmail,
        currentUser,
        apiResp,
        setcurrentUser,
        getPosts,
        posts,
        setposts,
        loaded
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

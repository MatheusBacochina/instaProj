import { initializeApp } from "firebase/app";
import {API_FIREBASE_KEY} from '@env'
import { getDatabase } from "firebase/database";
import { getAuth } from "@firebase/auth";
const firebaseConfig = {
  apiKey: API_FIREBASE_KEY,
  authDomain: "insta-3d123.firebaseapp.com",
  projectId: "insta-3d123",
  storageBucket: "insta-3d123.appspot.com",
  messagingSenderId: "377078310423",
  appId: "1:377078310423:web:8d5a2e48e9334c8bb51e52",
  measurementId: "G-4CKWHCKNJ1"
};

export const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
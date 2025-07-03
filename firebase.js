// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyB9mIW9QuD2PflXOX62mBeFt2ecqFW-qOE",
  authDomain: "chatapp-e9e80.firebaseapp.com",
  projectId: "chatapp-e9e80",
  storageBucket: "chatapp-e9e80.firebasestorage.app",
  messagingSenderId: "165400749924",
  appId: "1:165400749924:web:af86388ecacebeb166bc71",
  measurementId: "G-LYVQV5N08L",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

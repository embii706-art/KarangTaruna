import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC5L623gExYou8GXWvOlaKJAw-5An35ukI",
  authDomain: "karteji-e367d.firebaseapp.com",
  projectId: "karteji-e367d",
  storageBucket: "karteji-e367d.firebasestorage.app",
  messagingSenderId: "877730599886",
  appId: "1:877730599886:web:754465058330f6853ed19f",
  measurementId: "G-4KNXCFGTE6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
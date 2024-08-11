// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnwH8f-HX6Ck17T8PEH7vZ5wtPZVK-kyE",
  authDomain: "helpnet-336a3.firebaseapp.com",
  projectId: "helpnet-336a3",
  storageBucket: "helpnet-336a3.appspot.com",
  messagingSenderId: "627733533084",
  appId: "1:627733533084:web:fa37db4b4c207e0eb67859",
  measurementId: "G-Q31539SGG6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth=getAuth(app)
export const db = getFirestore(app);




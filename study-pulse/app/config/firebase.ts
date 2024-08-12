// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "study-pulse-3a060.firebaseapp.com",
  projectId: "study-pulse-3a060",
  storageBucket: "study-pulse-3a060.appspot.com",
  messagingSenderId: "923585583964",
  appId: "1:923585583964:web:7a4ba86e21e49e674bbf99"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export {db};
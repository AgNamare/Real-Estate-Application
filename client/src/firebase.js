// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "edge-estate.firebaseapp.com",
  projectId: "edge-estate",
  storageBucket: "edge-estate.appspot.com",
  messagingSenderId: "418913452907",
  appId: "1:418913452907:web:98a3a686b513beb962822e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

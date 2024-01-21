import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyABNYXDjca-xIZe_saY2Jj2qG7oaQOEP1g",
  authDomain: "the-goals.firebaseapp.com",
  databaseURL: "https://the-goals-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "the-goals",
  storageBucket: "the-goals.appspot.com",
  messagingSenderId: "470499945615",
  appId: "1:470499945615:web:da4cc30fdce26dd9dd14fa",
  measurementId: "G-4BTGNB37GB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);
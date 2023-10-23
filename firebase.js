// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAl5DJh7_HtBuScLne-qwZLdKtjjPbxOvY",
  authDomain: "eduxchange-e83fa.firebaseapp.com",
  projectId: "eduxchange-e83fa",
  storageBucket: "eduxchange-e83fa.appspot.com",
  messagingSenderId: "94899532454",
  appId: "1:94899532454:web:1dbc8dd6d4a1d4ccd03a67"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const auth = getAuth();
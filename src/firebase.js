// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrgfD4e7kkLtKUiIAeV-m01L8w7raHgks",
  authDomain: "twitter-clone-2-4a24c.firebaseapp.com",
  projectId: "twitter-clone-2-4a24c",
  storageBucket: "twitter-clone-2-4a24c.firebasestorage.app",
  messagingSenderId: "414906916727",
  appId: "1:414906916727:web:2251b1c1567044cb2c4b72",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };

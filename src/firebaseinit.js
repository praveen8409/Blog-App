// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArnNnV7NoSOGjwqvVLaonnJEtlIYlJ7zA",
  authDomain: "blogging-app-b32db.firebaseapp.com",
  projectId: "blogging-app-b32db",
  storageBucket: "blogging-app-b32db.appspot.com",
  messagingSenderId: "628678049846",
  appId: "1:628678049846:web:6f5e05493754bf39fdd897"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
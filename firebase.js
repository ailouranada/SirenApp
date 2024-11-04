// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
	getAuth,
	initializeAuth,
	getReactNativePersistence,
} from "firebase/auth"; // Updated import
import { getDatabase } from "firebase/database";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
// 	// put your conifg here
// 	apiKey: "AIzaSyCvvUa21D8f7HfvqXJj-Z8yzteGADBgjt0",
//   authDomain: "capstone-e7874.firebaseapp.com",
//   projectId: "capstone-e7874",
//   storageBucket: "capstone-e7874.appspot.com",
//   messagingSenderId: "704617332713",
//   appId: "1:704617332713:web:5ad7e973a28ae3e9a41578"
// };

const firebaseConfig = {
  apiKey: "AIzaSyApD58N73DvjXWqNMRyCrmfp3CrioQ2U5o",
  authDomain: "siren-2cc7c.firebaseapp.com",
  databaseURL: "https://siren-2cc7c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "siren-2cc7c",
  storageBucket: "siren-2cc7c.appspot.com",
  messagingSenderId: "715443261009",
  appId: "1:715443261009:web:7dd2d6952d568769daf270",
  measurementId: "G-VNF4P6TET3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// Initialize Firebase Auth with AsyncStorage
export const authInstance = initializeAuth(app, {
	persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const auth = getAuth(app);
export const storage = getStorage(app);

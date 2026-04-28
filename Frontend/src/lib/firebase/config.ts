// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCF89Hk_Wki7ZNapStAuSxmIUfL05VlSw8",
  authDomain: "room-ai-4b099.firebaseapp.com",
  projectId: "room-ai-4b099",
  storageBucket: "room-ai-4b099.firebasestorage.app",
  messagingSenderId: "897129899799",
  appId: "1:897129899799:web:c6e675e9d4a289ce98b952",
  measurementId: "G-1YBRJYZ95T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Authentication and the Google Login Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
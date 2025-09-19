// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNvGq5IMX1RzU090-YaM3S-FVmUs8g25w",
  authDomain: "aarath-72ec4.firebaseapp.com",
  projectId: "aarath-72ec4",
  storageBucket: "aarath-72ec4.firebasestorage.app",
  messagingSenderId: "750871633058",
  appId: "1:750871633058:web:59371c533c7a2348954bfb",
  measurementId: "G-VEFWY4H3BV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();

export default app;

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-72dff.firebaseapp.com",
  projectId: "mern-estate-72dff",
  storageBucket: "mern-estate-72dff.firebasestorage.app",
  messagingSenderId: "166194623119",
  appId: "1:166194623119:web:1d0b701a986e8fca3d76fa",
  measurementId: "G-SYN8GSL73Y",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAjaxhIUPjpPqSpGl4GjMEZvX6SfHXD_Tc",
    authDomain: "chatbot-e120e.firebaseapp.com",
    projectId: "chatbot-e120e",
    storageBucket: "chatbot-e120e.firebasestorage.app",
    messagingSenderId: "251920806182",
    appId: "1:251920806182:web:cc6acbe2c1ab42b22911e7",
    measurementId: "G-3E7MDE6B2S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//export default db;
export default db;
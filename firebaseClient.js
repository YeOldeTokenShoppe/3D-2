// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7kG4aVh88eOhOyfmvA31ufh52cYWiYho",
  authDomain: "d-rl80.firebaseapp.com",
  projectId: "d-rl80",
  storageBucket: "d-rl80.appspot.com",
  messagingSenderId: "406312415990",
  appId: "1:406312415990:web:bfa75c8314b686bdeef2d7",
  measurementId: "G-P6T8VHHXJ7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

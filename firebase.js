// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSMx4E0CVuP8yY5y6HOgHp-6lS7K8QVso",
  authDomain: "pantry-d3aef.firebaseapp.com",
  projectId: "pantry-d3aef",
  storageBucket: "pantry-d3aef.appspot.com",
  messagingSenderId: "1091902836761",
  appId: "1:1091902836761:web:66072db450e7cc121a5a88",
  measurementId: "G-DSQ4RYW8XF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);


export { firestore };

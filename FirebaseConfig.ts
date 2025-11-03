// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ← AGREGAR
import { getFirestore } from "firebase/firestore"; // ← AGREGAR

const firebaseConfig = {
  apiKey: "AIzaSyD7blxFJsEX-gvh2-p-y8KW1CZ_O-Wqi64",
  authDomain: "deber4-d5aff.firebaseapp.com",
  projectId: "deber4-d5aff",
  storageBucket: "deber4-d5aff.firebasestorage.app",
  messagingSenderId: "976020016800",
  appId: "1:976020016800:web:281f5a925394dd7afdc3c5",
  measurementId: "G-6Q3BWZY9J3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ← AGREGAR ESTAS EXPORTACIONES
export const auth = getAuth(app);
export const db = getFirestore(app);
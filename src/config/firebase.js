// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // apiKey: "YOUR_API_KEY",
  // authDomain: "YOUR_AUTH_DOMAIN",
  // projectId: "YOUR_PROJECT_ID",
  // storageBucket: "YOUR_STORAGE_BUCKET",
  // messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  // appId: "YOUR_API_ID",
  // measurementId: "YOUR_MEASUREMENT_ID"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export { app, auth, db };
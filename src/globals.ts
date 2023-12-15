import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

/**
 * Firebase configuration details.
 */
const firebaseConfig = {
  apiKey: "AIzaSyCTX2mqiWZKsJLVXYlST8KQcE2WBl2GxPM",
  authDomain: "civic-circle-ee679.firebaseapp.com",
  projectId: "civic-circle-ee679",
  storageBucket: "civic-circle-ee679.appspot.com",
  messagingSenderId: "210525871048",
  appId: "1:210525871048:web:fa886ae8b7e2454184fefd",
  measurementId: "G-Z6PTBDBDTG"
};

// Initialize Firebase with the provided configuration
export const fireApp = initializeApp(firebaseConfig);

// Firebase Authentication instance
export const auth = getAuth(fireApp);

// Firestore database instance
export const db = getFirestore(fireApp);

// Firebase Analytics instance
export const analytics = getAnalytics(fireApp);

// Object to store user data, initialized as empty
export let userData = { data: {} };

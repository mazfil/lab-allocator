// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCxyXLvHEqWgoDAHtNxzPojgxY_MElbWs",
  authDomain: "soco-lab-allocator.firebaseapp.com",
  projectId: "soco-lab-allocator",
  storageBucket: "soco-lab-allocator.appspot.com",
  messagingSenderId: "435915583201",
  appId: "1:435915583201:web:cf0ea4097d6c8079da51a0",
  measurementId: "G-933Q71Z2WV"
};



// Initialize Firebase


const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app);
export const db = getFirestore(app);


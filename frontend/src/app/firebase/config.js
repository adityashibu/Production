import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyBw2I37VWBZJSpX_w7K2dPgSc5WrV55Bf4",
  authDomain: "powerhouse-62f4d.firebaseapp.com",
  projectId: "powerhouse-62f4d",
  storageBucket: "powerhouse-62f4d.firebasestorage.app",
  messagingSenderId: "374708939236",
  appId: "1:374708939236:web:72ea30aeb6347b6b04fff1",
  measurementId: "G-80YKRHDP7X",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };

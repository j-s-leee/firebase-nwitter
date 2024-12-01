import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBJ63Jlm4f488PACZuoL5TwqRNTA45qBbs",
  authDomain: "nwitter-reloaded-7441f.firebaseapp.com",
  projectId: "nwitter-reloaded-7441f",
  storageBucket: "nwitter-reloaded-7441f.firebasestorage.app",
  messagingSenderId: "568131128874",
  appId: "1:568131128874:web:1267667beaeacf2fd53d53"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
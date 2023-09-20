import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA55m99YmsMnnCaSsvzy0TRCx5f11wO-rc",
  authDomain: "codewave-forum.firebaseapp.com",
  databaseURL: "https://codewave-forum-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "codewave-forum",
  storageBucket: "codewave-forum.appspot.com",
  messagingSenderId: "419524937617",
  appId: "1:419524937617:web:e1a660872d59a360d33c30"
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);

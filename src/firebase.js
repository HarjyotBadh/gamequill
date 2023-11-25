import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCluanebSV2sTW2CJ2Wza364A83JIvc3Vw",
  authDomain: "gamequill-3bab8.firebaseapp.com",
  projectId: "gamequill-3bab8",
  storageBucket: "gamequill-3bab8.appspot.com",
  messagingSenderId: "214027637857",
  appId: "1:214027637857:web:f482142def73ff89684620",
  measurementId: "G-JMY22R8ZLN",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
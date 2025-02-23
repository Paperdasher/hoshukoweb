import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, addDoc  } from "firebase/firestore"; // import for collection and adding documents
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import Storage functions

const firebaseConfig = {
  apiKey: "AIzaSyCQSJeXLlwqsU7dhFrXEc1g5c-CTzCoqio",
  authDomain: "jwsnyli-voting.firebaseapp.com",
  projectId: "jwsnyli-voting",
  storageBucket: "jwsnyli-voting.firebasestorage.app",
  messagingSenderId: "220696859966",
  appId: "1:220696859966:web:305d891139a6f7d697486f",
  measurementId: "G-RMR92X642Z"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
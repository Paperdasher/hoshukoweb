// firebase.js
import firebase from 'firebase/app';
import 'firebase/firestore';  // Add other Firebase services you need

const firebaseConfig = {
  apiKey: "AIzaSyCQSJeXLlwqsU7dhFrXEc1g5c-CTzCoqio",
  authDomain: "jwsnyli-voting.firebaseapp.com",
  projectId: "jwsnyli-voting",
  storageBucket: "jwsnyli-voting.firebasestorage.app",
  messagingSenderId: "220696859966",
  appId: "1:220696859966:web:305d891139a6f7d697486f",
  measurementId: "G-RMR92X642Z"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
export const db = firebaseApp.firestore();  // Example of exporting Firestore
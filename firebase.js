import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCi45ZHpUKKAVVYEXl9ASxHn4Fn3SjJHpo",
  authDomain: "succes-rega-learning.firebaseapp.com",
  projectId: "succes-rega-learning",
  storageBucket: "succes-rega-learning.firebasestorage.app",
  messagingSenderId: "257244709472",
  appId: "1:257244709472:web:f965362a34e713bfe27905"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };

console.log("✅ Firebase initialisé");
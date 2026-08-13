import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
getAuth,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
getFirestore,
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyCi45ZHpUKKAVVYEXl9ASxHn4Fn3SjJHpo",
  authDomain: "succes-rega-learning.firebaseapp.com",
  projectId: "succes-rega-learning",
  storageBucket: "succes-rega-learning.firebasestorage.app",
  messagingSenderId: "257244709472",
  appId: "1:257244709472:web:f965362a34e713bfe27905"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);



onAuthStateChanged(auth, async (user)=>{

    if(!user){

        window.location.href = "login.html";
        return;

    }


    const utilisateur = await getDoc(
        doc(db,"utilisateurs",user.email)
    );


    if(utilisateur.exists()){

        let role = utilisateur.data().role;


        // Protection admin

        if(window.location.pathname.includes("admin.html")){

if(role !== "Enseignant" && role !== "Admin"){

    window.location.href = "eleve.html";

}

        }


        // Protection élève

        if(window.location.pathname.includes("eleve.html")){
if(role !== "Eleve"){

    window.location.href = "admin.html";

}

        }

    }

});
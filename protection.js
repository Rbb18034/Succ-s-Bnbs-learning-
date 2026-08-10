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
    apiKey: "AIzaSyCi45ZHpUKKAVVYEXl9ASxH4Fn3SjJHpo",
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

        window.location.href="login.html";
        return;

    }

    try{

        const utilisateur = await getDoc(
            doc(db,"utilisateurs",user.email)
        );

        if(!utilisateur.exists()){

            alert("Compte introuvable");
            window.location.href="login.html";
            return;

        }

        const role = utilisateur.data().role;

        const page = window.location.pathname;



        // ADMIN
        if(page.includes("gestion-utilisateurs.html") ||
           page.includes("gestion-lycees.html")){

            if(role !== "Admin"){

                alert("⛔ Accès réservé à l'administrateur");

                window.location.href="admin.html";
                return;

            }

        }



        // ESPACE ADMIN / ENSEIGNANT / PROVISEUR
        if(page.includes("admin.html")){

            if(
                role !== "Admin" &&
                role !== "Enseignant" &&
                role !== "Proviseur"
            ){

                window.location.href="eleve.html";
                return;

            }

        }



        // ESPACE ÉLÈVE
        if(page.includes("eleve.html")){

            if(role !== "Eleve"){

                window.location.href="admin.html";
                return;

            }

        }

    }

    catch(error){

        console.error(error);

    }

});
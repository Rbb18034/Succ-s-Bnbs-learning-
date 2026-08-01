import { db } from "./firebase.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const auth = getAuth();

auth.onAuthStateChanged(async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const utilisateur = await getDoc(doc(db, "utilisateurs", user.email));

    if (utilisateur.exists()) {

        const data = utilisateur.data();

        document.getElementById("nomUtilisateur").textContent = data.nom;
        document.getElementById("emailUtilisateur").textContent = data.email;
        document.getElementById("roleUtilisateur").textContent = data.role;

    }

});
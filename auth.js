import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { auth, db } from "./firebase.js";


// INSCRIPTION
window.inscription = async function(){

    let nom = document.getElementById("nom").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;
    let classe = document.getElementById("classe").value;


    try {

        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );


await setDoc(doc(db,"utilisateurs",email),{

    nom: nom,
    email: email,
    role: role,
    classe: classe,
    matiere: "",
    salle: ""

});


alert("Compte créé avec succès !");

if(role === "Enseignant"){

    window.location.href="admin.html";

}else{

    window.location.href="eleve.html";

}


    } catch(error){

if(error.code === "auth/email-already-in-use"){

    alert("⚠️ Cette adresse e-mail possède déjà un compte.");

}else{

    alert(error.message);

}

    }

};



// CONNEXION
window.connexion = async function(){

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;


    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );


        localStorage.setItem("email", email);


        const utilisateur = await getDoc(
            doc(db,"utilisateurs",email)
        );


        if(utilisateur.exists()){

            let data = utilisateur.data();

let role = data.role.trim();

console.log("ROLE LU :", role);

alert("Connexion réussie !");


if(role === "Admin"){

    window.location.href="admin.html";

}
else if(role === "Enseignant"){

    window.location.href="admin.html";

}
else{

    window.location.href="eleve.html";

}

        }


    } catch(error){

        alert(error.message);

    }

};



// DECONNEXION
window.deconnexion = async function(){

    await signOut(auth);

    alert("Déconnexion réussie !");

    window.location.href="login.html";

};
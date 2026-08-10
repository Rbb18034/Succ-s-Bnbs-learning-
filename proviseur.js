import { db, auth } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// Charger le lycée du proviseur connecté

async function chargerLycee(){

    const email = localStorage.getItem("email");

    if(!email){
        alert("Utilisateur non connecté");
        return;
    }


    try{

        // récupérer le profil du proviseur

        const utilisateur = await getDoc(
            doc(db,"utilisateurs",email)
        );


        if(!utilisateur.exists()){
console.log("Email trouvé :", email);
console.log("Données utilisateur :", utilisateur.data());
            alert("Profil introuvable");
            return;

        }


        const data = utilisateur.data();


        const lyceeId = data.lyceeId;


        if(!lyceeId){

            alert("Aucun lycée associé à ce compte");
            return;

        }



        // récupérer le lycée correspondant

        const lycee = await getDoc(
            doc(db,"lycees",lyceeId)
        );


        if(lycee.exists()){


            const infos = lycee.data();


            document.getElementById("nomLycee").innerHTML =
            "🏫 " + infos.nom;


            document.getElementById("villeLycee").innerHTML =
            "📍 " + infos.ville;


            document.getElementById("proviseur").innerHTML =
            "👤 Proviseur : " + infos.proviseur;


        }


    }catch(error){

        console.error(error);

        alert(error.message);

    }

}


chargerLycee();
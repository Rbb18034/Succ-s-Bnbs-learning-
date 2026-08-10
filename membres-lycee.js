import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// Lycée du compte connecté
let monLyceeId = null;


// Rendre accessible
window.ajouterMembre = ajouterMembre;
window.supprimerMembre = supprimerMembre;



// Récupérer le lycée du proviseur connecté

async function recupererLycee(){

    const email = localStorage.getItem("email");


    if(!email){
        alert("Utilisateur non connecté");
        return;
    }


    const utilisateur = await getDoc(
        doc(db,"utilisateurs",email)
    );


    if(utilisateur.exists()){
console.log("Données utilisateur :", JSON.stringify(utilisateur.data()));
        monLyceeId = utilisateur.data().lyceeId;

    }


    if(!monLyceeId){

        alert("Aucun lycée associé à ce compte");

    }

}



// Ajouter un membre

async function ajouterMembre(){


    const nom =
    document.getElementById("nomMembre").value;


    const email =
    document.getElementById("emailMembre").value;


    const role =
    document.getElementById("roleMembre").value;


const information =
document.getElementById("informationMembre").value;


const matiere =
document.getElementById("matiereMembre").value;


const classe =
document.getElementById("classeMembre").value;


const salle =
document.getElementById("salleMembre").value;


const matricule =
document.getElementById("matriculeMembre").value;



    if(!nom || !email){

        alert("Veuillez remplir les informations");

        return;

    }


    if(!monLyceeId){

        alert("Lycée introuvable");

        return;

    }



    try{


        await addDoc(
            collection(db,"membres"),
            {

                nom: nom,

                email: email,

                role: role,

information: information,

matiere: matiere,

classe: classe,

salle: salle,

matricule: matricule,

lyceeId: monLyceeId,

                date: new Date()

            }
        );


        alert("Membre ajouté avec succès");


        afficherMembres();


    }catch(error){

        console.error(error);

        alert(error.message);

    }


}





// Afficher uniquement les membres de son lycée

async function afficherMembres(){


    const liste =
    document.getElementById("listeMembres");


    if(!liste) return;


    liste.innerHTML="Chargement...";


    const resultat = await getDocs(
        collection(db,"membres")
    );


    let contenu="";



    resultat.forEach((document)=>{


        const membre = document.data();



        if(membre.lyceeId === monLyceeId){


            contenu += `


<div class="card">


<h3>👤 ${membre.nom}</h3>

<p>📧 ${membre.email}</p>

<p>Rôle : ${membre.role}</p>

<p>📚 Matière : ${membre.matiere || "Non renseignée"}</p>

<p>🏫 Classe : ${membre.classe || "Non renseignée"}</p>

<p>🚪 Salle : ${membre.salle || "Non renseignée"}</p>

<p>🆔 Matricule : ${membre.matricule || "Non renseigné"}</p>


<button onclick="supprimerMembre('${document.id}')">

🗑️ Supprimer

</button>


</div>


`;

        }


    });



    liste.innerHTML =
    contenu || "<p>Aucun membre enregistré</p>";

}





// Supprimer seulement un membre de son lycée

async function supprimerMembre(id){


    if(!confirm("Supprimer ce membre ?"))
    return;



    const membreRef =
    await getDoc(
        doc(db,"membres",id)
    );


    if(!membreRef.exists()){

        alert("Membre introuvable");

        return;

    }



    const membre = membreRef.data();



    if(membre.lyceeId !== monLyceeId){

        alert("Vous ne pouvez pas supprimer un membre d'un autre lycée");

        return;

    }



    await deleteDoc(
        doc(db,"membres",id)
    );


    afficherMembres();


}





// Démarrage

async function demarrer(){

    await recupererLycee();

    afficherMembres();

}


demarrer();
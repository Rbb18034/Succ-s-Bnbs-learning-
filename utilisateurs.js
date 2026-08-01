import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


let utilisateurs = [];
let estAdmin = false;


// Fonctions accessibles HTML
window.rechercherUtilisateur = rechercherUtilisateur;
window.supprimerUtilisateur = supprimerUtilisateur;
window.changerRole = changerRole;


// Vérifier le rôle de l'utilisateur connecté

async function verifierAdmin(){

    const email = localStorage.getItem("email");

    if(!email) return;


    const utilisateur = await getDoc(
        doc(db,"utilisateurs",email)
    );


    if(utilisateur.exists()){

        const role = utilisateur.data().role;

        if(role === "Admin"){

            estAdmin = true;

        }

    }

}



// Charger les utilisateurs

async function afficherUtilisateurs(){

    const liste = document.getElementById("listeUtilisateurs");

    if(!liste) return;


    liste.innerHTML = "<p>Chargement...</p>";


    try{

        const snapshot = await getDocs(
            collection(db,"utilisateurs")
        );


        utilisateurs = [];


        snapshot.forEach((document)=>{

            utilisateurs.push({

                id: document.id,
                ...document.data()

            });

        });


        afficherListe(utilisateurs);


    }catch(error){

        liste.innerHTML = error.message;

    }

}



// Afficher la liste

function afficherListe(listeUtilisateurs){

    const liste = document.getElementById("listeUtilisateurs");


    let html = "";


    listeUtilisateurs.forEach((user)=>{


        html += `

        <div class="card">

            <h3>👤 ${user.nom}</h3>

            <p>📧 ${user.email}</p>

            <p>🎓 Rôle : ${user.role}</p>

            <p>🏫 Classe : ${user.classe || "-"}</p>


        `;


        // Seulement Admin voit les boutons

        if(estAdmin){

            html += `

            <button onclick="changerRole('${user.id}','${user.role}')">

            ${
            user.role === "Enseignant"
            ?
            "👨‍🎓 Passer en élève"
            :
            "👨‍🏫 Passer en enseignant"
            }

            </button>


            <br><br>

            <button onclick="supprimerUtilisateur('${user.id}')">

            🗑️ Supprimer

            </button>

            `;

        }


        html += `

        </div>

        `;


    });


    if(html === ""){

        html = "<p>Aucun utilisateur trouvé.</p>";

    }


    liste.innerHTML = html;

}



// Recherche

function rechercherUtilisateur(){

    const texte =
    document.getElementById("rechercheUtilisateur")
    .value
    .toLowerCase();


    const resultat = utilisateurs.filter(user =>

        user.nom.toLowerCase().includes(texte) ||
        user.email.toLowerCase().includes(texte)

    );


    afficherListe(resultat);

}



// Changer rôle

async function changerRole(id,roleActuel){


    if(!estAdmin){

        alert("Accès refusé");

        return;

    }


    let nouveauRole =
    roleActuel === "Enseignant"
    ?
    "Eleve"
    :
    "Enseignant";


    await updateDoc(
        doc(db,"utilisateurs",id),
        {
            role:nouveauRole
        }
    );


    alert("Rôle modifié");


    afficherUtilisateurs();

}



// Supprimer utilisateur

async function supprimerUtilisateur(id){


    if(!estAdmin){

        alert("Accès refusé");

        return;

    }


    const utilisateur = await getDoc(
        doc(db,"utilisateurs",id)
    );


    if(utilisateur.exists()){

        if(utilisateur.data().role === "Admin"){

            alert("Impossible de supprimer un administrateur.");

            return;

        }

    }


    if(!confirm("Supprimer cet utilisateur ?"))
    return;


    await deleteDoc(
        doc(db,"utilisateurs",id)
    );


    alert("Utilisateur supprimé");


    afficherUtilisateurs();

}



// Démarrage

verifierAdmin().then(()=>{

    afficherUtilisateurs();

});
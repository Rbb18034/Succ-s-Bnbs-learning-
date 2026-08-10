import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
let lycees = [];
function nomDuLycee(id){

    if(!id){
        return "Aucun lycée";
    }


    const lycee = lycees.find((l)=> l.id === id);


    if(lycee){

        return lycee.nom + (lycee.ville ? " - " + lycee.ville : "");

    }


    return "Lycée inconnu";

}
// Vérifier que seul l'Admin peut accéder

async function verifierAdmin(){

    const email = localStorage.getItem("email");

    if(!email){

        window.location.href="login.html";
        return;

    }


    const utilisateur = await getDoc(
        doc(db,"utilisateurs",email)
    );


    if(!utilisateur.exists()){

        alert("Utilisateur introuvable");
        window.location.href="index.html";
        return;

    }


    const role = utilisateur.data().role;


    if(role !== "Admin"){

        alert("⛔ Accès réservé à l'administrateur");

        window.location.href="admin.html";

        return;

    }


await chargerUtilisateurs();

}

// Stocker tous les utilisateurs
let utilisateurs = [];
async function chargerLycees(){

    const snapshot = await getDocs(
        collection(db,"lycees")
    );


    lycees = [];


    snapshot.forEach((document)=>{

        lycees.push({

            id: document.id,

            ...document.data()

        });

    });

}


// Charger les utilisateurs

async function chargerUtilisateurs(){

const liste = document.getElementById("listeUtilisateurs");

if(!liste){
    return;
}
await chargerLycees();
    liste.innerHTML = "Chargement...";

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


    afficherUtilisateurs(utilisateurs);

}



// Affichage

function afficherUtilisateurs(liste){

    const zone = document.getElementById("listeUtilisateurs");

    if(!zone){
        return;
    }


let html = "";


liste.forEach((utilisateur)=>{


html += `

<div class="card">

<h3>👤 ${utilisateur.nom || "Sans nom"}</h3>

<p>📧 ${utilisateur.email}</p>

<p>🎭 Rôle : ${utilisateur.role}</p>

<p>🏫 Lycée :
${nomDuLycee(utilisateur.lyceeId)}
</p>


<select id="role-${utilisateur.id}">

<option ${utilisateur.role=="Eleve"?"selected":""}>
Eleve
</option>

<option ${utilisateur.role=="Enseignant"?"selected":""}>
Enseignant
</option>

<option ${utilisateur.role=="Proviseur"?"selected":""}>
Proviseur
</option>

<option ${utilisateur.role=="Admin"?"selected":""}>
Admin
</option>

</select>


<select id="lycee-${utilisateur.id}">

<option value="">
Aucun lycée
</option>


${
lycees.map((lycee)=>`

<option value="${lycee.id}"
${utilisateur.lyceeId === lycee.id ? "selected" : ""}>

${lycee.nom} - ${lycee.ville}

</option>

`).join("")
}


</select>


<button onclick="modifierUtilisateur('${utilisateur.id}')">

💾 Enregistrer

</button>


</div>


`;

});


zone.innerHTML =
html || "<p>Aucun utilisateur</p>";
}



// Recherche

window.rechercherUtilisateur = function(){


    const texte =
    document.getElementById("rechercheUtilisateur")
    .value
    .toLowerCase();


    const resultat = utilisateurs.filter((u)=>{


        return (

            u.nom?.toLowerCase().includes(texte)

            ||

            u.email?.toLowerCase().includes(texte)

        );


    });


    afficherUtilisateurs(resultat);


};



// Modifier

window.modifierUtilisateur = async function(id){


    const role =
    document.getElementById("role-"+id).value;


    const lyceeId =
    document.getElementById("lycee-"+id).value;



    await updateDoc(
        doc(db,"utilisateurs",id),
        {

            role: role,

            lyceeId: lyceeId

        }
    );


    alert("✅ Utilisateur modifié");


    chargerUtilisateurs();


};

// Démarrage

verifierAdmin();
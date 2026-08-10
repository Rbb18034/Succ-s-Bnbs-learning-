import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// rendre la fonction accessible au bouton HTML
window.ajouterAnnonce = ajouterAnnonce;


// Ajouter une annonce

async function ajouterAnnonce(){

    const titre = document.getElementById("titreAnnonce").value;
    const description = document.getElementById("descriptionAnnonce").value;
    const image = document.getElementById("imageAnnonce").value;
    const lien = document.getElementById("lienAnnonce").value;
    const duree = document.getElementById("dureeAnnonce").value;


    if(!titre || !description){

        alert("Veuillez remplir les champs obligatoires");
        return;

    }


    try{

 await addDoc(
    collection(db,"annoncesSponsorisees"),
    {
        titre:titre,
        description:description,
        image:image,
        lien:lien,
        actif:true,
        vues:0,
        clics:0,
        date:new Date(),
        expiration:new Date(
            Date.now() + duree * 24 * 60 * 60 * 1000
        )
    }
);


        alert("Annonce publiée avec succès");


        afficherAnnonces();


    }catch(error){

        alert(error.message);

    }

}



// Afficher les annonces

async function afficherAnnonces(){

    const liste = document.getElementById("listeAnnonces");

    if(!liste) return;


    liste.innerHTML="Chargement...";


    const resultat = await getDocs(
        collection(db,"annoncesSponsorisees")
    );


    let html="";


    resultat.forEach((annonce)=>{


        let data = annonce.data();


        html += `

        <div class="card">

        <h3>${data.titre}</h3>

<p>👀 Vues : ${data.vues || 0}</p>

<p>🖱️ Clics : ${data.clics || 0}</p>


        ${
        data.image
        ?
        `<img src="${data.image}">`
        :
        ""
        }


        ${
        data.lien
        ?
        `<a href="${data.lien}">
        Voir l'annonce
        </a>`
        :
        ""
        }


        <br><br>

        <button onclick="supprimerAnnonce('${annonce.id}')">
        🗑️ Supprimer
        </button>


        </div>

        `;


    });


    liste.innerHTML = html || "<p>Aucune annonce</p>";

}



// Supprimer

window.supprimerAnnonce = supprimerAnnonce;


async function supprimerAnnonce(id){


    if(!confirm("Supprimer cette annonce ?"))
    return;


    await deleteDoc(
        doc(db,"annoncesSponsorisees",id)
    );


    afficherAnnonces();

}



// démarrage

afficherAnnonces();
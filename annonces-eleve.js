import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const salle = localStorage.getItem("salle");
const matiere = localStorage.getItem("matiere");
console.log("Salle :", salle);
console.log("Matière :", matiere);

const nomSalle = document.getElementById("nomSalle");
const nomMatiere = document.getElementById("nomMatiere");

if(nomSalle){
    nomSalle.textContent = "🏫 Salle : " + salle;
}

if(nomMatiere){
    nomMatiere.textContent = "📚 Matière : " + matiere;
}

async function afficherAnnoncesEleve(){

    const liste = document.getElementById("listeAnnonces");

    if(!liste) return;

    liste.innerHTML = "<p>Chargement des annonces...</p>";

    try{

        const snapshot = await getDocs(collection(db,"annonces"));

        let html = "";

        snapshot.forEach((doc)=>{

            const annonce = doc.data();
console.log(annonce.salle, annonce.matiere);
            if(
                annonce.salle === salle &&
                annonce.matiere === matiere
            ){

                html += `
                <div class="card">

                    <h3>📢 ${annonce.titre}</h3>

                    <p>${annonce.message}</p>

                </div>
                `;

            }

        });

        if(html === ""){

            liste.innerHTML = "<p>Aucune annonce disponible pour cette salle et cette matière.</p>";

        }else{

            liste.innerHTML = html;

        }

    }catch(error){

        liste.innerHTML = "Erreur : " + error.message;

    }

}

afficherAnnoncesEleve();
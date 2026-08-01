import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
async function afficherResultats(){

    const liste = document.getElementById("listeResultats");

    if(!liste) return;

    liste.innerHTML = "<p>Chargement des résultats...</p>";

    try{

        const snapshot = await getDocs(collection(db,"resultats"));

        if(snapshot.empty){

            liste.innerHTML = "<p>Aucun résultat disponible.</p>";
            return;

        }

        let html = "";

        snapshot.forEach((document)=>{

            const resultat = document.data();

            html += `
            <div class="card">

                <h3>👨‍🎓 ${resultat.nom}</h3>

                <p>📝 Quiz : ${resultat.question}</p>

                <p>📊 Score : ${resultat.score}</p>

<button onclick="supprimerResultat('${document.id}')">
    🗑️ Supprimer
</button>
            </div>
            `;

        });

        liste.innerHTML = html;

    }catch(error){

        liste.innerHTML = "Erreur : " + error.message;

    }

}

afficherResultats();
window.supprimerResultat = async function(id){

    if(!confirm("Voulez-vous vraiment supprimer ce résultat ?")){
        return;
    }

    try{

        await deleteDoc(doc(db,"resultats",id));

        alert("✅ Résultat supprimé avec succès !");

        afficherResultats();

    }catch(error){

        alert("Erreur : " + error.message);

    }

};
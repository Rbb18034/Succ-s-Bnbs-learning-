import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

window.publierAnnonce = async function(){

    const salle = document.getElementById("salleAnnonce").value;
    const matiere = document.getElementById("matiereAnnonce").value;
    const titre = document.getElementById("titreAnnonce").value;
    const message = document.getElementById("messageAnnonce").value;

    if(!salle || !matiere || !titre || !message){

        alert("Veuillez remplir tous les champs.");
        return;

    }

    try{

        await addDoc(collection(db,"annonces"),{

            salle: salle,
            matiere: matiere,
            titre: titre,
            message: message,
            date: serverTimestamp()

        });

        alert("✅ Annonce publiée avec succès !");

        document.getElementById("salleAnnonce").value = "";
        document.getElementById("matiereAnnonce").value = "";
        document.getElementById("titreAnnonce").value = "";
        document.getElementById("messageAnnonce").value = "";

        afficherAnnonces();

    }catch(error){

        alert("Erreur : " + error.message);

    }

};

async function afficherAnnonces(){

    const liste = document.getElementById("listeAnnonces");

    if(!liste) return;

    liste.innerHTML = "<p>Chargement...</p>";

    try{

        const snapshot = await getDocs(collection(db,"annonces"));

        if(snapshot.empty){

            liste.innerHTML = "<p>Aucune annonce.</p>";
            return;

        }

        let html = "";

        snapshot.forEach((document)=>{

            const annonce = document.data();

            html += `
            <div class="card">

                <h3>📢 ${annonce.titre}</h3>

                <p><strong>🏫 Salle :</strong> ${annonce.salle}</p>

                <p><strong>📚 Matière :</strong> ${annonce.matiere}</p>

                <p>${annonce.message}</p>

                <br>

                <button onclick="supprimerAnnonce('${document.id}')">
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

window.supprimerAnnonce = async function(id){

    if(!confirm("Supprimer cette annonce ?")) return;

    try{

        await deleteDoc(doc(db,"annonces",id));

        alert("✅ Annonce supprimée.");

        afficherAnnonces();

    }catch(error){

        alert("Erreur : " + error.message);

    }

};

afficherAnnonces();
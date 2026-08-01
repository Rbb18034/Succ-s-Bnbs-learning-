import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// Envoyer un message

window.publierMessage = async function(){

    const titre = document.getElementById("titreMessage").value;
    const contenu = document.getElementById("contenuMessage").value;

    if(!titre || !contenu){

        alert("Veuillez remplir tous les champs.");
        return;

    }

    try{

        await addDoc(collection(db,"messages"),{

            titre: titre,
            contenu: contenu,
            date: serverTimestamp()

        });

        alert("✅ Message envoyé avec succès !");

        document.getElementById("titreMessage").value = "";
        document.getElementById("contenuMessage").value = "";

        afficherMessages();

    }catch(error){

        alert("Erreur : " + error.message);

    }

};


// Afficher les messages

async function afficherMessages(){

    const liste = document.getElementById("listeMessages");

    if(!liste) return;

    liste.innerHTML = "<p>Chargement...</p>";

    try{

        const snapshot = await getDocs(collection(db,"messages"));

        if(snapshot.empty){

            liste.innerHTML = "<p>Aucun message.</p>";
            return;

        }

        let html = "";

        snapshot.forEach((document)=>{

            const message = document.data();

            html += `
            <div class="card">

                <h3>💬 ${message.titre}</h3>

                <p>${message.contenu}</p>

                <button onclick="supprimerMessage('${document.id}')">
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


afficherMessages();


// Supprimer un message

window.supprimerMessage = async function(id){

    if(!confirm("Voulez-vous supprimer ce message ?")){
        return;
    }

    try{

        await deleteDoc(doc(db,"messages",id));

        alert("✅ Message supprimé !");

        afficherMessages();

    }catch(error){

        alert("Erreur : " + error.message);

    }

};
import { db } from "./firebase.js";

import { getAuth, onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const CLOUD_NAME = "kpgui0fj";
const UPLOAD_PRESET = "succes-bnbs-videos";


async function envoyerVideoCloudinary(fichier){

    const formData = new FormData();

    formData.append("file", fichier);
    formData.append("upload_preset", UPLOAD_PRESET);


    const reponse = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
        {
            method:"POST",
            body:formData
        }
    );


    const data = await reponse.json();

    return data.secure_url;

}
async function envoyerPDFCloudinary(fichier){

    const formData = new FormData();

    formData.append("file", fichier);
    formData.append("upload_preset", UPLOAD_PRESET);

    const reponse = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        {
            method: "POST",
            body: formData
        }
    );

    const data = await reponse.json();

    return data.secure_url.replace(
        "/upload/",
        "/upload/fl_attachment/"
    );

}

window.publierVideo = async function(){

    const salle = document.getElementById("salleVideo").value;
    const matiere = document.getElementById("matiereVideo").value;
    const titre = document.getElementById("titreVideo").value;
    const fichier = document.getElementById("fichierVideo").files[0];

    if(!salle || !matiere || !titre || !fichier){

        alert("Veuillez remplir tous les champs.");
        return;

    }

    try{

        alert("Envoi de la vidéo en cours...");

        const lien = await envoyerVideoCloudinary(fichier);

        await addDoc(collection(db,"videos"),{

            salle: salle,
            matiere: matiere,
            titre: titre,
            lien: lien,
            date: serverTimestamp()

        });

        alert("✅ Vidéo publiée avec succès !");

        document.getElementById("salleVideo").value = "";
        document.getElementById("matiereVideo").value = "";
        document.getElementById("titreVideo").value = "";
        document.getElementById("fichierVideo").value = "";

        afficherVideos();

    }catch(error){

        alert("Erreur : " + error.message);

    }

};
async function afficherBibliotheque() {

    const liste = document.getElementById("listePDF");

    if (!liste) return;

    liste.innerHTML = "<p>Chargement...</p>";

    try {

        const snapshot = await getDocs(collection(db, "bibliotheque"));

        if (snapshot.empty) {
            liste.innerHTML = "<p>Aucun document disponible.</p>";
            return;
        }

        let html = "";

snapshot.forEach((document) => {

    let pdf = document.data();

    html += `
    <div class="card">

        <h3>📄 ${pdf.titre}</h3>

        <a href="${pdf.lien}" target="_blank">
            📖 Ouvrir le document
        </a>

        <br><br>

        <button onclick="supprimerPDF('${document.id}')">
            🗑️ Supprimer
        </button>

    </div>
    `;
});

        liste.innerHTML = html;

    } catch (error) {

        liste.innerHTML = "Erreur : " + error.message;

    }

}

window.afficherBibliotheque = afficherBibliotheque;
afficherBibliotheque();
async function afficherEleves(){

    const liste = document.getElementById("listeEleves");

    if(!liste) return;

    liste.innerHTML = "<p>Chargement des élèves...</p>";

    try{

        const snapshot = await getDocs(collection(db,"utilisateurs"));

        let html = "";

        snapshot.forEach((doc)=>{

            const utilisateur = doc.data();

            if(utilisateur.role === "Élève"){

                html += `
                <div class="card">
                    <h3>👨‍🎓 ${utilisateur.nom}</h3>
                    <p>📧 ${utilisateur.email}</p>
                    <p>📚 Classe : ${utilisateur.classe}</p>
                </div>
                `;

            }

        });


        if(html === ""){

            liste.innerHTML = "<p>Aucun élève trouvé.</p>";

        }else{

            liste.innerHTML = html;

        }


    }catch(error){

        liste.innerHTML = "Erreur : " + error.message;

    }

}

window.afficherEleves = afficherEleves;

afficherEleves();
// =======================
// MESSAGERIE
// =======================

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

snapshot.forEach((doc) => {

    let documentPDF = doc.data();

    html += `
    <div class="card">

        <h3>📄 ${documentPDF.titre}</h3>

        <a href="${documentPDF.lien}" target="_blank">
            📖 Ouvrir le document PDF
        </a>

        <br><br>

        <button onclick="supprimerPDF('${doc.id}')">
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
async function afficherStatistiques() {

    const nbEleves = document.getElementById("nbEleves");
    const nbCours = document.getElementById("nbCours");
    const nbVideos = document.getElementById("nbVideos");
    const nbPDF = document.getElementById("nbPDF");
    const nbQuiz = document.getElementById("nbQuiz");
    const nbMessages = document.getElementById("nbMessages");

    if (!nbEleves) return;

    nbEleves.textContent =
        (await getDocs(collection(db, "utilisateurs"))).size;

    nbCours.textContent =
        (await getDocs(collection(db, "cours"))).size;

    nbVideos.textContent =
        (await getDocs(collection(db, "videos"))).size;

    nbPDF.textContent =
        (await getDocs(collection(db, "bibliotheque"))).size;

    nbQuiz.textContent =
        (await getDocs(collection(db, "quiz"))).size;

    nbMessages.textContent =
        (await getDocs(collection(db, "messages"))).size;

}

afficherStatistiques();
window.supprimerPDF = async function(id){

    const confirmation = confirm("Voulez-vous vraiment supprimer ce document ?");

    if(!confirmation){
        return;
    }

    try{

        await deleteDoc(doc(db,"bibliotheque",id));

        alert("✅ Document supprimé avec succès !");

        afficherBibliotheque();

    }catch(error){

        alert("Erreur : " + error.message);

    }

};
async function afficherVideos(){

    const liste = document.getElementById("listeVideos");

    if(!liste) return;

    liste.innerHTML = "<p>Chargement des vidéos...</p>";

    try{

        const snapshot = await getDocs(collection(db,"videos"));

        if(snapshot.empty){

            liste.innerHTML = "<p>Aucune vidéo publiée.</p>";
            return;

        }

        let html = "";

snapshot.forEach((document)=>{

    const video = document.data();

    html += `
    <div class="card">

<h3>🎥 ${video.titre}</h3>

<p>🏫 Salle : ${video.salle}</p>

<p>📚 Matière : ${video.matiere}</p>

<video width="100%" controls>
    <source src="${video.lien}" type="video/mp4">
</video>

        <br><br>

        <button onclick="supprimerVideo('${document.id}')">
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

afficherVideos();
window.supprimerVideo = async function(id){

    if(!confirm("Voulez-vous supprimer cette vidéo ?")){
        return;
    }

    try{

        await deleteDoc(doc(db,"videos",id));

        alert("✅ Vidéo supprimée avec succès !");

        afficherVideos();

    }catch(error){

        alert("Erreur : " + error.message);

    }

};
window.publierCours = async function () {

    const salle = document.getElementById("salleCours").value;
    const matiere = document.getElementById("matiereCours").value;
    const titre = document.getElementById("titre").value;
    const description = document.getElementById("description").value;

    if (!salle || !matiere || !titre || !description) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    try {

        await addDoc(collection(db, "cours"), {
            salle: salle,
            matiere: matiere,
            titre: titre,
            description: description,
            date: new Date()
        });

        alert("✅ Cours publié avec succès !");

        document.getElementById("salleCours").value = "";
        document.getElementById("matiereCours").value = "";
        document.getElementById("titre").value = "";
        document.getElementById("description").value = "";

    } catch (error) {

        alert("Erreur : " + error.message);

    }

};
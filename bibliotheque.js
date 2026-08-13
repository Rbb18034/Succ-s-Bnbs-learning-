import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
window.publierPDF = async function(){

    const salle = document.getElementById("sallePDF").value.trim();
    const matiere = document.getElementById("matierePDF").value.trim();
    const titre = document.getElementById("titrePDF").value.trim();
    const lien = document.getElementById("lienPDF").value.trim();


    if(!salle || !matiere || !titre || !lien){

        alert("Veuillez remplir tous les champs.");
        return;

    }


    try{

        await addDoc(collection(db,"bibliotheque"),{

            salle: salle,
            matiere: matiere,
            titre: titre,
            lien: lien,
            auteur: "enseignant",
            date: serverTimestamp()

        });


        alert("✅ PDF ajouté avec succès !");


        document.getElementById("sallePDF").value = "";
        document.getElementById("matierePDF").value = "";
        document.getElementById("titrePDF").value = "";
        document.getElementById("lienPDF").value = "";


        if(typeof afficherBibliotheque === "function"){

            afficherBibliotheque();

        }


    }catch(error){

        alert("Erreur : " + error.message);

    }

};
async function afficherBibliotheque(){

    const liste = document.getElementById("listePDF");

    if(!liste) return;

    const salleChoisie = localStorage.getItem("salle");
    const matiereChoisie = localStorage.getItem("matiere");
    console.log("Salle élève :", salleChoisie);
console.log("Matière élève :", matiereChoisie);

    liste.innerHTML = "<p>Chargement...</p>";

    try{

        const snapshot = await getDocs(collection(db,"bibliotheque"));

        let html = "";

        snapshot.forEach((document)=>{

            const pdf = document.data();
console.log("PDF :", pdf.salle, pdf.matiere);
            if(
                pdf.salle === salleChoisie &&
                pdf.matiere === matiereChoisie
            ){

                html += `
                <div class="card">

                    <h3>📄 ${pdf.titre}</h3>

                    <p>🏫 Salle : ${pdf.salle}</p>

                    <p>📚 Matière : ${pdf.matiere}</p>

                    <a href="${pdf.lien}" target="_blank">
                        📖 Ouvrir le document
                    </a>

                </div>
                `;

            }

        });


        if(html === ""){

            liste.innerHTML = "<p>Aucun document disponible pour cette salle et cette matière.</p>";

        }else{

            liste.innerHTML = html;

        }


    }catch(error){

        liste.innerHTML = "Erreur : " + error.message;

    }

}

afficherBibliotheque();
window.supprimerPDF = async function(id){

    if(!confirm("Voulez-vous vraiment supprimer ce document ?")){
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
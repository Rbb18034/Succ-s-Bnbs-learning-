import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


let monLyceeId = "";
let monEmail = "";


// Récupérer les informations utilisateur

async function recupererUtilisateur(){

    const email = localStorage.getItem("email");

    if(!email){
        return;
    }

    monEmail = email;

    const utilisateur = await getDoc(
        doc(db,"utilisateurs",email)
    );

    if(utilisateur.exists()){

        const data = utilisateur.data();

        monLyceeId = data.lyceeId || "";

        console.log("Nom :", data.nom);
        console.log("Lycée :", monLyceeId);
        console.log("Rôle :", data.role);

    }

}

// Publier un quiz

window.publierQuiz = async function(){


    const salle =
    document.getElementById("salleQuiz").value;


    const matiere =
    document.getElementById("matiereQuiz").value;


    const question =
    document.getElementById("questionQuiz").value.trim();


    const bonneReponse =
    document.getElementById("bonneReponse").value.trim();


    const mauvaiseReponse =
    document.getElementById("mauvaiseReponse").value.trim();


    const visibilite =
    document.getElementById("visibiliteQuiz").value;

    if(
        !salle ||
        !matiere ||
        !question ||
        !bonneReponse ||
        !mauvaiseReponse
    ){

        alert("Veuillez remplir tous les champs.");

        return;

    }

    if(visibilite === "lycee" && !monLyceeId){

        alert("Vous n'êtes rattaché à aucun lycée.");

        return;

    }

    try{

        console.log("Utilisateur :", monEmail);

        console.log("Lycée :", monLyceeId);

        await addDoc(collection(db,"quiz"),{

            question: question,

            bonneReponse: bonneReponse,

            mauvaiseReponse: mauvaiseReponse,

            salle: salle,

            matiere: matiere,

            visibilite: visibilite,

            lyceeId:
            visibilite === "lycee"
            ? monLyceeId
            : "",

            auteur: monEmail,

            date: serverTimestamp()

        });


        alert("✅ Quiz publié avec succès !");

        document.getElementById("questionQuiz").value = "";

        document.getElementById("bonneReponse").value = "";

        document.getElementById("mauvaiseReponse").value = "";

        afficherQuiz();

    }catch(error){

        alert("Erreur : " + error.message);
    }

};
// Afficher les quiz

async function afficherQuiz(){
    const liste =
    document.getElementById("listeQuiz");
    if(!liste) return;
    liste.innerHTML =
    "<p>Chargement...</p>";
    try{

        const snapshot =
        await getDocs(collection(db,"quiz"));
        let html = "";
        snapshot.forEach((document)=>{
            const quiz = document.data();

            if(

                quiz.lyceeId === monLyceeId

                ||

                quiz.visibilite === "public"

            ){


                html += `

                <div class="card">


                <h3>📝 ${quiz.question}</h3>

                <p>🏫 Salle : ${quiz.salle}</p>

                <p>📚 Matière : ${quiz.matiere}</p>

                <p>🌍 Visibilité : ${quiz.visibilite}</p>

                <p>✅ Bonne réponse :
                ${quiz.bonneReponse}
                </p>

                <p>❌ Mauvaise réponse :
                ${quiz.mauvaiseReponse}
                </p>

                ${
                quiz.auteur === monEmail
                ?
                `
                <button onclick="supprimerQuiz('${document.id}')">
                🗑️ Supprimer
                </button>
                `
                :
                ""
                }

                </div>

                `;

            }

        });

        if(html === ""){


            liste.innerHTML =
            "<p>Aucun quiz disponible.</p>";

        }else{

            liste.innerHTML = html;

        }
    }catch(error){

        liste.innerHTML =
        "Erreur : " + error.message;

    }

}

// Supprimer un quiz

window.supprimerQuiz = async function(id){

    if(!confirm("Supprimer ce quiz ?")){

        return;

    }
    try{
        await deleteDoc(
            doc(db,"quiz",id)
        );

        alert("✅ Quiz supprimé");

        afficherQuiz();
    }catch(error){
        alert(error.message);
    }

};

// Démarrage

async function demarrer(){

    await recupererUtilisateur();

    afficherQuiz();

}

demarrer();
import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
window.publierQuiz = async function(){

    const question = document.getElementById("questionQuiz").value;
    const bonneReponse = document.getElementById("bonneReponse").value;
    const mauvaiseReponse = document.getElementById("mauvaiseReponse").value;

    if(!question || !bonneReponse || !mauvaiseReponse){

        alert("Veuillez remplir tous les champs.");
        return;

    }

    try{

        await addDoc(collection(db,"quiz"),{

            question: question,
            bonneReponse: bonneReponse,
            mauvaiseReponse: mauvaiseReponse,
            date: serverTimestamp()

        });

        alert("✅ Quiz publié avec succès !");

        document.getElementById("questionQuiz").value = "";
        document.getElementById("bonneReponse").value = "";
        document.getElementById("mauvaiseReponse").value = "";

    }catch(error){

        alert("Erreur : " + error.message);

    }

};
async function afficherQuiz(){

    const liste = document.getElementById("listeQuiz");

    if(!liste) return;

    liste.innerHTML = "<p>Chargement...</p>";

    try{

        const snapshot = await getDocs(collection(db,"quiz"));

        if(snapshot.empty){

            liste.innerHTML = "<p>Aucun quiz.</p>";
            return;

        }

        let html = "";

        snapshot.forEach((document)=>{

            const quiz = document.data();

            html += `
            <div class="card">

                <h3>${quiz.question}</h3>

                <p>✅ Bonne réponse : ${quiz.bonneReponse}</p>

                <p>❌ Mauvaise réponse : ${quiz.mauvaiseReponse}</p>

                <button onclick="supprimerQuiz('${document.id}')">
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

afficherQuiz();
window.supprimerQuiz = async function(id){

    if(!confirm("Voulez-vous supprimer ce quiz ?")){
        return;
    }

    try{

        await deleteDoc(doc(db,"quiz",id));

        alert("✅ Quiz supprimé avec succès !");

        afficherQuiz();

    }catch(error){

        alert("Erreur : " + error.message);

    }

};
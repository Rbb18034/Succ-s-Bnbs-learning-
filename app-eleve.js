import { db } from "./firebase.js";

import {
    doc,
    collection,
    getDocs,
    getDoc,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
// Affichage du nom de l'élève

const nomEleve = localStorage.getItem("nom");

const bienvenue = document.getElementById("bienvenue");

if(nomEleve && bienvenue){

    bienvenue.textContent = "Bonjour " + nomEleve + " ";

}
async function afficherCoursEleve() {

    const liste = document.getElementById("listeCours");

    if (!liste) return;

    const email = localStorage.getItem("email");

    liste.innerHTML = "<p>Chargement des cours...</p>";

    try {

        if (!email) {
            liste.innerHTML = "<p>Utilisateur non connecté.</p>";
            return;
        }

        // =========================
        // RÉCUPÉRER L'ÉLÈVE
        // =========================

        const utilisateurSnap = await getDoc(
            doc(db, "utilisateurs", email)
        );

        if (!utilisateurSnap.exists()) {

            liste.innerHTML =
                "<p>Compte élève introuvable.</p>";

            return;
        }

        const eleve = utilisateurSnap.data();

        const lyceeId = eleve.lyceeId || "";

        console.log("📚 Affichage des cours");
        console.log("📧 Élève :", email);
        console.log("🏫 Lycée :", lyceeId);


        if (!lyceeId) {

            liste.innerHTML =
                "<p>Votre compte n'est rattaché à aucun lycée.</p>";

            return;
        }


        // =========================
        // RÉCUPÉRER LES COURS
        // =========================

        const snapshot =
            await getDocs(
                collection(db, "cours")
            );


        let html = "";


        snapshot.forEach((document) => {

            const cours = document.data();


            console.log("📚 Cours :", cours);


            // L'élève voit uniquement
            // les cours de son lycée

            if (
                cours.lyceeId === lyceeId
            ) {

                html += `

                <div class="card">

                    <h3>
                        📚 ${cours.titre || "Cours sans titre"}
                    </h3>

                    <p>
                        🏫 Salle :
                        ${cours.salle || "Non précisée"}
                    </p>

                    <p>
                        📖 Matière :
                        ${cours.matiere || "Non précisée"}
                    </p>

                    ${
                        cours.description
                        ?
                        `<p>${cours.description}</p>`
                        :
                        ""
                    }

                    ${
                        cours.lien
                        ?
                        `
                        <p>
                            <a
                                href="${cours.lien}"
                                target="_blank"
                            >
                                📖 Ouvrir le cours
                            </a>
                        </p>
                        `
                        :
                        ""
                    }

                </div>

                `;

            }

        });


        // =========================
        // AFFICHAGE
        // =========================

        if (html === "") {

            liste.innerHTML =
                "<p>Aucun cours disponible pour votre lycée.</p>";

        } else {

            liste.innerHTML = html;

        }


    } catch (error) {

        console.error(
            "❌ Erreur affichage cours :",
            error
        );

        liste.innerHTML =
            "Erreur : " + error.message;

    }

}

afficherCoursEleve();

async function afficherQuizEleve() {

    const liste = document.getElementById("listeQuizEleve");

    if (!liste) return;

    liste.innerHTML = "<p>Chargement des quiz...</p>";

    try {

        const snapshot = await getDocs(collection(db, "quiz"));

        if (snapshot.empty) {
            liste.innerHTML = "<p>Aucun quiz disponible.</p>";
            return;
        }

        let html = "";

        snapshot.forEach((doc) => {

            const quiz = doc.data();

            html += `
            <div class="card">

                <h3>${quiz.question}</h3>

<button onclick="verifierReponse('${quiz.bonneReponse}','${quiz.bonneReponse}')">
    ${quiz.bonneReponse}
</button>

<br><br>

<button onclick="verifierReponse('${quiz.mauvaiseReponse}','${quiz.bonneReponse}')">
    ${quiz.mauvaiseReponse}
</button>

            </div>
            `;

        });

        liste.innerHTML = html;

    } catch (error) {

        liste.innerHTML = "Erreur : " + error.message;

    }

}

window.verifierReponse = async function(reponseChoisie, bonneReponse){

    let score;

    if(reponseChoisie === bonneReponse){

        alert("✅ Bonne réponse !");
        score = "1/1";

    }else{

        alert("❌ Mauvaise réponse.");
        score = "0/1";

    }

    try{

        await addDoc(collection(db,"resultats"),{

            nom: "Élève",
            question: bonneReponse,
            score: score,
            date: serverTimestamp()

        });

    }catch(error){

        console.log(error);

    }

};

function corrigerQuiz(index) {

    let quiz = JSON.parse(localStorage.getItem("quiz")) || [];

    let reponse = document.querySelector('input[name="quiz'+index+'"]:checked');

    if (!reponse) {
        alert("Veuillez choisir une réponse.");
        return;
    }

    let resultat = document.getElementById("resultat"+index);

    if (reponse.value === quiz[index].bonne) {
        resultat.innerHTML = "✅ Bonne réponse !";
        resultat.style.color = "green";
    } else {
        resultat.innerHTML = "❌ Mauvaise réponse.";
        resultat.style.color = "red";
    }
}

afficherQuizEleve();

async function afficherVideosEleve() {

    const liste = document.getElementById("listeVideos");

    if (!liste) return;

    const salleChoisie = localStorage.getItem("salle");
    const matiereChoisie = localStorage.getItem("matiere");
    console.log("Salle choisie :", salleChoisie);
console.log("Matière choisie :", matiereChoisie);

    liste.innerHTML = "<p>Chargement des vidéos...</p>";

    try {

        const snapshot = await getDocs(collection(db, "videos"));

        let html = "";

        snapshot.forEach((doc) => {

            const video = doc.data();
console.log(video.salle, video.matiere);
            if (
                video.salle === salleChoisie &&
                video.matiere === matiereChoisie
            ) {

                html += `
                <div class="card">

                    <h3>🎥 ${video.titre}</h3>

                    <p>🏫 Salle : ${video.salle}</p>

                    <p>📚 Matière : ${video.matiere}</p>

                    <video width="100%" controls>
                        <source src="${video.lien}" type="video/mp4">
                    </video>

                </div>
                `;

            }

        });

        if (html === "") {

            liste.innerHTML = "<p>Aucune vidéo disponible pour cette salle et cette matière.</p>";

        } else {

            liste.innerHTML = html;

        }

    } catch (error) {

        liste.innerHTML = "Erreur : " + error.message;

    }

}

afficherVideosEleve();
// =======================
// MESSAGES DES ÉLÈVES
// =======================

async function afficherMessagesEleve(){

    const liste = document.getElementById("listeMessages");

    if(!liste) return;

    liste.innerHTML = "<p>Chargement des messages...</p>";

    try{

const snapshot = await getDocs(collection(db,"messages"));

alert("Nombre de messages trouvés : " + snapshot.size);

alert("Nombre de messages trouvés : " + snapshot.size);
console.log("Nombre de messages :", snapshot.size);

        if(snapshot.empty){

            liste.innerHTML = "<p>Aucun message disponible.</p>";
            return;

        }

        let html = "";

        snapshot.forEach((doc)=>{

            const message = doc.data();

            html += `
            <div class="card">
                <h3>📢 ${message.titre}</h3>
                <p>${message.contenu}</p>
            </div>
            `;

        });

        liste.innerHTML = html;

    }catch(error){

        liste.innerHTML = "Erreur : " + error.message;

    }

}

afficherMessagesEleve();
window.rechercherPDF = function(){

    const texte = document
        .getElementById("recherchePDF")
        .value
        .toLowerCase();

    const cartes = document.querySelectorAll("#listePDF .card");

    cartes.forEach((carte)=>{

        const contenu = carte.textContent.toLowerCase();

        if(contenu.includes(texte)){

            carte.style.display = "";

        }else{

            carte.style.display = "none";

        }

    });

};
async function chargerStatistiques(){

    try{

        const email = localStorage.getItem("email");

        if(!email){
            console.log("Aucun utilisateur connecté");
            return;
        }


        // Récupérer l'élève
        const utilisateurRef = doc(db,"utilisateurs",email);

        const utilisateurSnap = await getDoc(utilisateurRef);


        if(!utilisateurSnap.exists()){

            console.log("Utilisateur introuvable");
            return;

        }


        const eleve = utilisateurSnap.data();


        const lyceeId = eleve.lyceeId || "";
const salle = "";
const matiere = "";


        console.log("📧 Élève :", email);
        console.log("🏫 Lycée :", lyceeId);
        console.log("📚 Salle :", salle);
        console.log("📖 Matière :", matiere);


        // =========================
        // COURS
        // =========================

        const coursSnapshot =
        await getDocs(
            collection(db,"cours")
        );
        let nombreCours = 0;
        coursSnapshot.forEach((document)=>{

            const cours = document.data();
if(
    cours.lyceeId === lyceeId
){
                nombreCours++;

            }

        });
const compteurCours = document.getElementById("nombreCours");

if(compteurCours){
    compteurCours.textContent = nombreCours;
}



        // =========================
        // PDF
        // =========================

        const pdfSnapshot =
        await getDocs(
            collection(db,"bibliotheque")
        );

        let nombrePDF = 0;

        pdfSnapshot.forEach((document)=>{

            const pdf = document.data();
            if(

                (
                    pdf.visibilite === "public"

                    ||

                    (
                        pdf.visibilite === "lycee" &&
                        pdf.lyceeId === lyceeId
                    )
                )

            ){

                nombrePDF++;

            }

        });


const compteurPDF = document.getElementById("nombrePDF");

if(compteurPDF){
   compteurPDF.textContent = nombrePDF;
}

        // =========================
        // VIDEOS
        // =========================

        const videosSnapshot =
        await getDocs(
            collection(db,"videos")
        );

        document.getElementById("nombreVideos").textContent =
        videosSnapshot.size;

        // =========================
        // QUIZ
        // =========================

        const quizSnapshot =
        await getDocs(
            collection(db,"quiz")
        );

        let nombreQuiz = 0;
        quizSnapshot.forEach((document)=>{
            const quiz = document.data();

            if(
               (
                    quiz.visibilite === "public"

                    ||

                    (
                        quiz.visibilite === "lycee" &&
                        quiz.lyceeId === lyceeId
                    )
                )
            ){
                nombreQuiz++;
            }
        });
const compteurQuiz = document.getElementById("nombreQuiz");

if(compteurQuiz){
    compteurQuiz.textContent = nombreQuiz;
}
        console.log("📊 Statistiques chargées :");

        console.log("Cours :", nombreCours);

        console.log("PDF :", nombrePDF);

        console.log("Vidéos :", videosSnapshot.size);

        console.log("Quiz :", nombreQuiz);
    }catch(error){

        console.error(
            "Erreur statistiques :",
            error
        );

    }

}
chargerStatistiques();
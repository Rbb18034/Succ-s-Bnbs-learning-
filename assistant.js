import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const auth = getAuth();
import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
    orderBy,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


window.envoyerQuestion = async function(){

    const question = document.getElementById("question").value;
const image = document.getElementById("imageQuestion").files[0];

let lienImage = "";

if(image){

    lienImage = await envoyerImageCloudinary(image);

}

    if(!question && !image){

        alert("Écrivez une question ou ajoutez une image.");
        return;

    }


    try{
console.log("Début envoi question");
console.log("Image Cloudinary :", lienImage);
await addDoc(collection(db,"assistant_questions"),{
uid: auth.currentUser.uid,
    question: question,
image: lienImage,
    auteur: "eleve",
    niveau: localStorage.getItem("salle") || "",
    matiere: localStorage.getItem("matiere") || "",
    reponseIA: "",
    date: serverTimestamp()

});


        afficherMessage(question, image);

setTimeout(()=>{

    afficherReponseIA(
        "🤖 Analyse en cours... Votre problème sera expliqué étape par étape."
    );

},1000);
        document.getElementById("question").value = "";
        document.getElementById("imageQuestion").value = "";


    }catch(error){

        alert("Erreur : " + error.message);

    }

};



function afficherMessage(question, image){

    const conversation = document.getElementById("conversation");


    let html = `

    <div class="card">

    <h3>👨‍🎓 Vous :</h3>

    <p>${question}</p>

    `;


    if(image){

        html += `
        <p>📷 Image envoyée : ${image.name}</p>
        `;

    }


    html += `</div>`;


    conversation.innerHTML += html;

}
function afficherReponseIA(reponse){

    const conversation = document.getElementById("conversation");

    conversation.innerHTML += `

    <div class="card">

    <h3>🤖 Assistant :</h3>

    <p>${reponse}</p>

    </div>

    `;

}
async function envoyerImageCloudinary(image){

    const url = "https://api.cloudinary.com/v1_1/kpgui0fj/image/upload";

    const formData = new FormData();

    formData.append("file", image);
    formData.append("upload_preset", "succes-bnbs-videos");

    const response = await fetch(url,{
        method:"POST",
        body:formData
    });

    const data = await response.json();

    console.log(data);

    if(data.secure_url){
        return data.secure_url;
    }else{
        throw new Error(data.error?.message || "Échec de l'envoi vers Cloudinary");
    }
}
async function chargerHistorique() {

    const conversation = document.getElementById("conversation");

    conversation.innerHTML = "<p>Chargement...</p>";

    try {

const q = query(
    collection(db, "assistant_questions"),
    where("uid", "==", auth.currentUser.uid),
    orderBy("date", "asc")
);

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            conversation.innerHTML =
                "<p>👋 Bonjour ! Posez votre première question scientifique.</p>";
            return;
        }

        let html = "";

        snapshot.forEach((doc) => {

            const data = doc.data();

            html += `
            <div class="card">

                <h3>👨‍🎓 Vous</h3>

                <p>${data.question}</p>
            `;

            if(data.image){

                html += `
                <img src="${data.image}"
                     width="100%"
                     style="border-radius:10px;margin-top:10px;">
                `;

            }

            if(data.reponseIA){

                html += `
                <br><br>

                <h3>🤖 Assistant</h3>

                <p>${data.reponseIA}</p>
                `;

            }

            html += "</div>";

        });

        conversation.innerHTML = html;

    } catch(error){

        conversation.innerHTML =
            "Erreur : " + error.message;

    }

}

chargerHistorique();
window.nouvelleDiscussion = function(){

    document.getElementById("conversation").innerHTML = `
        <p>👋 Nouvelle discussion démarrée.</p>
    `;

    document.getElementById("question").value = "";

    document.getElementById("imageQuestion").value = "";

}
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


// Informations utilisateur connecté

let monLyceeId = "";
let monEmail = "";
let monRole = "";


// Récupérer le lycée de l'utilisateur

async function recupererMonLycee(){

    const email = localStorage.getItem("email");

    if(!email) return;


    monEmail = email;


    const utilisateur = await getDoc(
        doc(db,"utilisateurs",email)
    );


    if(utilisateur.exists()){


        const donnees = utilisateur.data();


        monLyceeId = donnees.lyceeId || "";
monRole = donnees.role || "";

        console.log("Nom :", donnees.nom);
        console.log("Rôle :", donnees.role);
        console.log("Lycée ID :", monLyceeId);


    }

}





// Publier un PDF

window.publierPDF = async function(){


    const salle =
    document.getElementById("sallePDF").value.trim();


    const matiere =
    document.getElementById("matierePDF").value.trim();


    const titre =
    document.getElementById("titrePDF").value.trim();


    const lien =
    document.getElementById("lienPDF").value.trim();


    const visibilite =
    document.getElementById("visibilitePDF").value;



    if(!salle || !matiere || !titre || !lien){

        alert("Veuillez remplir tous les champs.");

        return;

    }



    if(visibilite === "lycee" && !monLyceeId){

        alert("Vous n'êtes rattaché à aucun lycée.");

        return;

    }



    try{


        await addDoc(
            collection(db,"bibliotheque"),
            {


                salle: salle,

                matiere: matiere,

                titre: titre,

                lien: lien,


                visibilite: visibilite,


                lyceeId:
                visibilite === "lycee"
                ?
                monLyceeId
                :
                "",

auteur: monEmail,
auteurNom: localStorage.getItem("nom") || "Enseignant",


                date: serverTimestamp()


            }
        );



        alert("✅ PDF ajouté avec succès !");



        document.getElementById("sallePDF").value="";

        document.getElementById("matierePDF").value="";

        document.getElementById("titrePDF").value="";

        document.getElementById("lienPDF").value="";



        afficherBibliotheque();



    }catch(error){


        alert("Erreur : " + error.message);


    }


};





// Afficher les documents

async function afficherBibliotheque(){


    const liste =
    document.getElementById("listePDF");


    if(!liste) return;



    const salleChoisie =
    localStorage.getItem("salle");


    const matiereChoisie =
    localStorage.getItem("matiere");
console.log("Salle élève :", salleChoisie);
console.log("Matière élève :", matiereChoisie);


    liste.innerHTML =
    "<p>Chargement...</p>";



    try{


        const snapshot =
        await getDocs(
            collection(db,"bibliotheque")
        );



        let html="";



        snapshot.forEach((document)=>{


            const pdf = document.data();
console.log(JSON.stringify(pdf));


            // L'auteur voit toujours ses documents

            const estAuteur =
            pdf.auteur === monEmail;



            // Élèves voient selon salle/matière/lycée

            const estPourEleve =

            pdf.salle === salleChoisie &&

            pdf.matiere === matiereChoisie &&

            (

                pdf.visibilite === "public"


                ||

                (
                    pdf.visibilite === "lycee"
                    &&
                    pdf.lyceeId === monLyceeId
                )

            );



            if(estAuteur || estPourEleve){



                html += `

                <div class="card">


                <h3>📄 ${pdf.titre}</h3>


                <p>🏫 Salle : ${pdf.salle}</p>


                <p>📚 Matière : ${pdf.matiere}</p>


                <p>🌍 Visibilité :
                ${pdf.visibilite}
                </p>



                <a href="${pdf.lien}" target="_blank">

                📖 Ouvrir le document

                </a>


                <br><br>

${
(
    pdf.auteur === monEmail
)

||

(
    monRole === "Proviseur"
    &&
    pdf.lyceeId === monLyceeId
)

||

(
    monRole === "Admin"
)

?

`
<br><br>

<button onclick="supprimerPDF('${document.id}')">
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



        if(html===""){


            liste.innerHTML =
            "<p>Aucun document disponible.</p>";


        }else{


            liste.innerHTML=html;


        }



    }catch(error){


        liste.innerHTML =
        "Erreur : "+error.message;


    }


}





// Supprimer un PDF

window.supprimerPDF = async function(id){


    if(!confirm("Voulez-vous supprimer ce document ?")){

        return;

    }


    try{


        const documentPDF = await getDoc(
            doc(db,"bibliotheque",id)
        );


        if(!documentPDF.exists()){

            alert("Document introuvable");
            return;

        }


        const pdf = documentPDF.data();



const autorise =

(
    pdf.auteur === monEmail
)

||

(
    monRole === "Proviseur"
    &&
    pdf.lyceeId === monLyceeId
)

||

(
    monRole === "Admin"
);



if(!autorise){

    alert("⛔ Vous ne pouvez pas supprimer ce document");

    return;

}



        await deleteDoc(
            doc(db,"bibliotheque",id)
        );


        alert("✅ Document supprimé");


        afficherBibliotheque();



    }catch(error){


        alert("Erreur : " + error.message);


    }


};


// Démarrage

async function demarrer(){

    await recupererMonLycee();

    afficherBibliotheque();

}


demarrer();
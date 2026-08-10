import { db } from "./firebase.js";

import {
collection,
addDoc,
getDocs,
deleteDoc,
doc,
getDoc,
updateDoc,
query,
where
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// Vérification Admin

async function verifierAdmin(){

    const email = localStorage.getItem("email");


    if(!email){

        window.location.href="login.html";
        return;

    }


    const utilisateur = await getDoc(
        doc(db,"utilisateurs",email)
    );


    if(!utilisateur.exists() || utilisateur.data().role !== "Admin"){

        alert("⛔ Accès réservé à l'administrateur");

        window.location.href="admin.html";

        return;

    }


    afficherLycees();

}



window.ajouterLycee = async function(){


    const nom =
    document.getElementById("nomLycee").value.trim();


    const ville =
    document.getElementById("villeLycee").value.trim();


    const logo =
    document.getElementById("logoLycee").value.trim();


    const contact =
    document.getElementById("contactLycee").value.trim();


    const proviseur =
    document.getElementById("proviseurLycee").value.trim();


    const emailProviseur =
    document.getElementById("emailProviseur").value.trim();



    if(!nom || !ville){

        alert("Veuillez remplir le nom et la ville du lycée");

        return;

    }



    try{


        // 1 - Création du lycée

        const nouveauLycee = await addDoc(
            collection(db,"lycees"),
            {

                nom: nom,

                ville: ville,

                logo: logo,

                contact: contact,

                proviseur: proviseur,

                emailProviseur: emailProviseur,

                date: new Date()

            }
        );



        // 2 - Rattacher automatiquement le proviseur

        if(emailProviseur){


            const recherche = query(
                collection(db,"utilisateurs"),
                where("email","==",emailProviseur)
            );


            const resultat = await getDocs(recherche);



            if(!resultat.empty){


                resultat.forEach(async (utilisateur)=>{


                    await updateDoc(
                        doc(db,"utilisateurs",utilisateur.id),
                        {

                            lyceeId: nouveauLycee.id

                        }
                    );


                });


                alert("✅ Lycée ajouté et proviseur rattaché avec succès");


            }else{


                alert(
                "✅ Lycée ajouté. Aucun compte trouvé pour ce proviseur."
                );


            }


        }else{


            alert("✅ Lycée ajouté avec succès");


        }



        // Nettoyage des champs

        document.getElementById("nomLycee").value="";
        document.getElementById("villeLycee").value="";
        document.getElementById("logoLycee").value="";
        document.getElementById("contactLycee").value="";
        document.getElementById("proviseurLycee").value="";
        document.getElementById("emailProviseur").value="";


        afficherLycees();



    }catch(error){


        console.error(error);

        alert("Erreur : " + error.message);


    }


};


// Afficher les lycées

async function afficherLycees(){


const liste =
document.getElementById("listeLycees");


if(!liste) return;


liste.innerHTML="Chargement...";


const snapshot =
await getDocs(collection(db,"lycees"));


let html="";


snapshot.forEach((document)=>{


const lycee=document.data();



html += `

<div class="card">


<h3>🏫 ${lycee.nom}</h3>


<p>📍 Ville : ${lycee.ville}</p>


<p>📞 Contact : ${lycee.contact || "Non renseigné"}</p>


<p>👨‍💼 Proviseur : ${lycee.proviseur || "Non renseigné"}</p>


<p>📧 ${lycee.emailProviseur || ""}</p>


<button onclick="supprimerLycee('${document.id}')">

🗑️ Supprimer

</button>


</div>

`;

});


liste.innerHTML =
html || "<p>Aucun lycée enregistré</p>";


}



// Supprimer

window.supprimerLycee = async function(id){


if(!confirm("Supprimer ce lycée ?")) return;



await deleteDoc(
doc(db,"lycees",id)
);


alert("Lycée supprimé");


afficherLycees();


};



// Démarrage

verifierAdmin();
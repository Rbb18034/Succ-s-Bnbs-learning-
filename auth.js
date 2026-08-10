import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { auth, db } from "./firebase.js";


// INSCRIPTION
window.inscription = async function(){


    let nom = document.getElementById("nom").value;

    let email = document.getElementById("email").value;

    let password = document.getElementById("password").value;

    let role = document.getElementById("role").value;



    let lyceeId = "";

    let classe = "";

    let matiere = "";



    try {


        // Cas élève

        if(role === "Eleve"){


            classe = document.getElementById("classe").value;


            let typeEleve =
            document.getElementById("typeEleve").value;


            let codeLycee =
            document.getElementById("codeLycee").value;



            // Élève avec lycée

            if(typeEleve === "lycee"){


                if(!codeLycee){

                    alert("Veuillez entrer le code du lycée");

                    return;

                }



                const resultat = await getDocs(
                    collection(db,"lycees")
                );



                let trouve = false;



                resultat.forEach((doc)=>{


                    let lycee = doc.data();


if(lycee.code && lycee.code.toUpperCase() === codeLycee.toUpperCase().trim()){


                        lyceeId = doc.id;

                        trouve = true;


                    }


                });



                if(!trouve){

                    alert("Code lycée incorrect");

                    return;

                }


            }


        }



        // Cas enseignant

        if(role === "Enseignant"){


            matiere =
            document.getElementById("matiere").value;


            classe =
            document.getElementById("classeEnseignant").value;


        }




        await createUserWithEmailAndPassword(

            auth,

            email,

            password

        );





        await setDoc(

            doc(db,"utilisateurs",email),

            {


                nom: nom,

                email: email,

                role: role,

                classe: classe,

                matiere: matiere,

                lyceeId: lyceeId,


                statut:"Actif"


            }

        );



        alert("Compte créé avec succès !");



        window.location.href="login.html";



    }catch(error){


        console.error(error);


        alert(error.message);


    }


};


// CONNEXION
window.connexion = async function(){

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;


    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );


        localStorage.setItem("email", email);


        const utilisateur = await getDoc(
            doc(db,"utilisateurs",email)
        );


        if(utilisateur.exists()){

            let data = utilisateur.data();

let role = data.role.trim();

console.log("ROLE LU :", role);

alert("Connexion réussie !");


if(role === "Admin"){

    window.location.href="admin.html";

}
else if(role == "Proviseur"){

    window.location.href = "proviseur.html";

}
else if(role === "Enseignant"){

    window.location.href="admin.html";

}
else{

    window.location.href="eleve.html";

}

        }


    } catch(error){

        alert(error.message);

    }

};



// DECONNEXION
window.deconnexion = async function(){

    await signOut(auth);

    alert("Déconnexion réussie !");

    window.location.href="login.html";

};
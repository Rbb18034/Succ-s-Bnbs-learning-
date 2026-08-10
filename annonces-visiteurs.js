import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

async function afficherAnnoncesVisiteurs() {

    const zone = document.getElementById("annoncesVisiteurs");

    if (!zone) return;

    zone.innerHTML = "<p>Chargement des annonces...</p>";

    try {

        const q = query(
            collection(db, "annoncesSponsorisees"),
            where("actif", "==", true)
        );

        const resultat = await getDocs(q);

        let contenu = "";

        resultat.forEach((document) => {

            const annonce = document.data();

            if (annonce.expiration) {

                const dateExpiration = annonce.expiration.toDate();

                if (dateExpiration < new Date()) {
                    return;
                }

            }

            contenu += `

<div class="card annonce-card">

${annonce.image ? `<img src="${annonce.image}" class="annonce-image" alt="Annonce">` : ""}

<h3>🌟 ${annonce.titre}</h3>

<p>${annonce.description}</p>

${annonce.lien ? `
<a href="${annonce.lien}" target="_blank">
<button>📲 En savoir plus</button>
</a>
` : ""}

<p class="sponsorise">Annonce sponsorisée</p>

</div>

`;

        });

        zone.innerHTML = contenu || "<p>Aucune annonce disponible pour le moment.</p>";

    } catch (error) {

        console.error(error);

        zone.innerHTML = "<p>Impossible de charger les annonces.</p>";

    }

}

afficherAnnoncesVisiteurs();
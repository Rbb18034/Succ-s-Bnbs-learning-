const salle = localStorage.getItem("salle");

const titre = document.getElementById("nomSalle");

if (salle) {
    titre.textContent = "🏫 Salle : " + salle;
} else {
    titre.textContent = "🏫 Aucune salle sélectionnée";
}

window.ouvrirMatiere = function(matiere){

    localStorage.setItem("matiere", matiere);

    const ressource = localStorage.getItem("ressource");

    if(ressource === "cours"){

        window.location.href = "cours-eleve.html";

    }else if(ressource === "pdf"){

        window.location.href = "bibliotheque-eleve.html";

    }else if(ressource === "video"){

        window.location.href = "videos-eleve.html";

    }else if(ressource === "quiz"){

        window.location.href = "quiz-eleve.html";

    }else if(ressource === "annonce"){

        window.location.href = "annonces-eleve.html";

    }else{

        alert("Aucune ressource sélectionnée.");

    }

};
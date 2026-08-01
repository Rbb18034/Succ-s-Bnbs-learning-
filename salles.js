window.ouvrirSalle = function(nomSalle){

    localStorage.setItem("salle", nomSalle);

    window.location.href = "matieres.html";

}
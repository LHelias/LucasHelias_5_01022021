
let idCommandes;
idCommandes = JSON.parse(localStorage.orderIds);
console.log(JSON.parse(localStorage.orderIds))

//Crée un élémént enfant de idCommandes pour y afficher l'id d'une commande.
function createIdCommandesElement(idCommande) {
    let mainElement = document.getElementById("idCommandes");
    let idCommandesElement = document.createElement("p");
    mainElement.appendChild(idCommandesElement);
    idCommandesElement.innerHTML = `<p id="${idCommande}"> ${idCommande}</p>`;
}

//On crée un élément affichant l'id commande pour chaque commande passée.
function printAllIdCommandes() {
    for (i in idCommandes) {
        createIdCommandesElement(idCommandes[i]);
    }
};

function main(){
    printAllIdCommandes();
}

main();
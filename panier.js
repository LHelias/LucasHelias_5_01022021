//const { format } = require("path");

let basket = JSON.parse(localStorage.panier);
let sortedBasket = [[], [], []];
let basketPrice = localStorage.prix;
let products = [];
let orderIds;
//Gestion du formulaire de contact
let contactForm = document.getElementById("contact-form");
items = basket;

// Crée le constructeur des items
class Item {
    constructor(option, description, imageUrl, name, price, _id, _category) {
        this.option = option;
        this.description = description;
        this.imageUrl = imageUrl;
        this.name = name;
        this.price = price;
        this._id = _id;
        this._category = _category;
    }
}

function main() {
    listenToClearBasket();
    createBasketElements(basket);
    printBasketPrice(basketPrice);
    listenToFields();
    submitForm(basket);
    console.log("basket :", basket);
    console.log("localStorage.panier :", localStorage.panier);
}

function createBasketElements(items) {
    for (let i in items) {
        let myItem = new Item(items[i].option, items[i].description, items[i].imageUrl, items[i].name, items[i].price, items[i]._id, items[i]._category);
        let itemCard = document.createElement("div");
        let mainElement = document.getElementById("main");
        mainElement.appendChild(itemCard);
        itemCard.innerHTML = `<div class="card mx-auto mt-3" style="max-width: 750px;"><div class="row g-0"><div class="col-md-4"><img src="${myItem.imageUrl}" class="img-thumbnail" alt="image produit"></div><div class="col-md-8"><div class="card-body"><a href="produit.html?category=${myItem._category}&idProduit=${myItem._id}"><h5 class="card-title">${myItem.name}</h5></a><p class="card-text">${myItem.description}</p><div class="d-flex justify-content-between align-items-center"> <p class="fw-bolder">${(myItem.price / 100 + ",00")}€</p><a class="btn btn-danger ml-auto text-decoration-none" id=${items[i]._id}>Retirer du panier</a> </div></div></div></div></div></div>`;

        // permet de supprimer le produit du panier et met à jour le prix
        const supprimerDuPanier = document.getElementById(items[i]._id);
        supprimerDuPanier.addEventListener("click", function () {
            for (j in basket) {
                if (basket[j]._id === items[i]._id) {
                    basket.splice(j, 1);
                    console.log("basket", basket);
                    calculateBasketPrice(basket);
                    basketPriceElement.innerHTML = `${basketPrice / 100},00€`;
                    parseProducts(basket);
                }
            }
            localStorage.setItem("panier", JSON.stringify(basket));
            clearMainElement();
            createBasketElements(basket);
        });
    };
}

function clearMainElement() {
    let mainElement = document.getElementById("main");
    mainElement.innerHTML = "";
}


function calculateBasketPrice(basket) {
    basketPrice = 0;
    if (basket == []) {
        basketPrice = 0;
    } else {
        for (let i in basket) {
            console.log(basket[i].price);
            basketPrice += basket[i].price;
        }
    }
    console.log("prix du panier", basketPrice);
    localStorage.setItem("prix", basketPrice);
}

//Afficher le prix du panier en haut de la page
const basketPriceElement = document.getElementById("basketPrice");
function printBasketPrice(basketPrice){
    basketPriceElement.innerHTML = `${basketPrice / 100},00€`;
}

//Permet de vider le panier en cliquant sur le bouton "vider panier"
function listenToClearBasket() {
    const clearBasketElement = document.getElementById("clear-basket");
    clearBasketElement.addEventListener("click", function (basket) {
        basket = [];
        localStorage.setItem("panier", JSON.stringify(basket));
        clearMainElement();
        calculateBasketPrice(basket);
        localStorage.setItem("prix", basketPrice);
        basketPriceElement.innerHTML = `${basketPrice / 100},00€`;
        parseProducts(basket);
    });
}

//cette fonction extrait les _id d'une liste d'objets pour les placer dans l'array products
function parseProducts(pool) {
    products = [];
    for (i in pool) {
        products.push(pool[i]._id);
    }
    console.log("products", products);
}

// Cette fonction classe les éléments de basket par _category dans sortedBasket
function sortBasket(basket) {
    for (i in basket) {
        if (basket[i]._category === "TEDDY") {
            sortedBasket[0].push(basket[i]);
        } else if (basket[i]._category === "CAMERA") {
            sortedBasket[1].push(basket[i]);
        } else if (basket[i]._category === "FURNITURE") {
            sortedBasket[2].push(basket[i]);
        }
    }
}

//Cette fonction crée l'objet contact
function createPostData(contact, postData) {
    contact.firstName = contactForm.input_prenom.value;
    contact.lastName = contactForm.input_nom.value;
    contact.address = contactForm.input_adresse.value;
    contact.city = contactForm.input_ville.value;
    contact.email = contactForm.input_email.value;
    postData.contact = contact;
    postData.products = products;
}


//ecouter la modification de l'email
function listenToFields(){
    contactForm.input_email.addEventListener('change', function () {
        validEmail(this);
    });
    //ecouter la modification du prenom
    contactForm.input_prenom.addEventListener('change', function () {
        validFirstName(this);
    });
    //ecouter la modification du Nom
    contactForm.input_nom.addEventListener('change', function () {
    validLastName(this);
    });
    //ecouter la modification de l'adresse
    contactForm.input_adresse.addEventListener('change', function () {
        validAddress(this);
    });
    //ecouter la modification de la ville
    contactForm.input_ville.addEventListener('change', function () {
    validCity(this);
    });
};

//Validation Email
function validEmail(inputEmail) {
    let emailRegExp = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$", "g");
    // regEx trouvée sur https://www.youtube.com/watch?v=CreEhp8I-XA
    let testEmail = emailRegExp.test(inputEmail.value);
    console.log(testEmail);
    let smallEmail = inputEmail.nextElementSibling;
    if (testEmail) {
        smallEmail.innerHTML = "adresse valide";
        smallEmail.classList.add("text-success");
        smallEmail.classList.remove("text-danger");
        return (true);
    }
    else {
        smallEmail.innerHTML = "adresse invalide";
        smallEmail.classList.add("text-danger");
        smallEmail.classList.remove("text-success");
        return (false);
    }
}

//Validation prenom
function validFirstName(inputFirstName) {
    let firstNameRegExp = new RegExp("^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$");
    // regEx trouvée sur https://openclassrooms.com/forum/sujet/regex-prenom-et-nom
    let testFirstName = firstNameRegExp.test(inputFirstName.value);
    console.log(testFirstName);
    let smallFirstName = inputFirstName.nextElementSibling;
    if (testFirstName) {
        smallFirstName.innerHTML = "champ valide";
        smallFirstName.classList.add("text-success");
        smallFirstName.classList.remove("text-danger");
        return (true);
    }
    else {
        smallFirstName.innerHTML = "champ invalide";
        smallFirstName.classList.add("text-danger");
        smallFirstName.classList.remove("text-success");
        return (false);
    }
}

//Validation Nom
function validLastName(inputLastName) {
    let lastNameRegExp = new RegExp("^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$");
    // regEx trouvée sur https://openclassrooms.com/forum/sujet/regex-prenom-et-nom
    let testLastName = lastNameRegExp.test(inputLastName.value);
    console.log(testLastName);
    let smallLastName = inputLastName.nextElementSibling;
    if (testLastName) {
        smallLastName.innerHTML = "champ valide";
        smallLastName.classList.add("text-success");
        smallLastName.classList.remove("text-danger");
        return (true);
    }
    else {
        smallLastName.innerHTML = "champ invalide";
        smallLastName.classList.add("text-danger");
        smallLastName.classList.remove("text-success");
        return (false);
    }
}

//Validation adresse
function validAddress(inputAddress) {
    let addressRegExp = new RegExp("^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$");
    // regEx trouvée sur https://openclassrooms.com/forum/sujet/regex-prenom-et-nom
    let testAddress = addressRegExp.test(inputAddress.value);
    console.log(testAddress);
    let smallAddress = inputAddress.nextElementSibling;
    if (testAddress) {
        smallAddress.innerHTML = "champ valide";
        smallAddress.classList.add("text-success");
        smallAddress.classList.remove("text-danger");
        return (true);
    }
    else {
        smallAddress.innerHTML = "champ invalide";
        smallAddress.classList.add("text-danger");
        smallAddress.classList.remove("text-success");
        return (false);
    }
}

//Validation Ville
function validCity(inputCity) {
    let cityRegExp = new RegExp("^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$");
    // regEx trouvée sur https://openclassrooms.com/forum/sujet/regex-prenom-et-nom
    let testCity = cityRegExp.test(inputCity.value);
    console.log(testCity);
    let smallCity = inputCity.nextElementSibling;
    if (testCity) {
        smallCity.innerHTML = "champ valide";
        smallCity.classList.add("text-success");
        smallCity.classList.remove("text-danger");
        return (true);
    }
    else {
        smallCity.innerHTML = "champ invalide";
        smallCity.classList.add("text-danger");
        smallCity.classList.remove("text-success");
        return (false);
    }
}

//écouter la soumission du formulaire
function submitForm(basket) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        //on initialise la variable orderIds qui contiendra les Id des commandes sous la forme d'un array.
        orderIds = [];

        //Si tous les champs sont valides, on continue la création de la commande.
        if (validFirstName(contactForm.input_prenom) &&
            validLastName(contactForm.input_nom) &&
            validAddress(contactForm.input_adresse) &&
            validCity(contactForm.input_ville) &&
            validEmail(contactForm.input_email)) {
            if (basket.length == 0) {
                //Si le panier est vide, on affiche une alerte
                window.alert("Le panier est vide !");
            } else {
                //On trie le panier selon les catégories pour envoyer une commande par catégorie du panier.
                sortBasket(basket);
                
                //Si une catégorie existe dans le panier trié, on lance la commande.
                if (sortedBasket[0].length != 0) {
                    //validation de la commande de teddies
                    parseProducts(sortedBasket[0]);
                    let contact = new Object;
                    let postData = new Object;
                    createPostData(contact, postData);
                    fetch("https://oc-p5-api.herokuapp.com/api/teddies/order", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify(postData)
                    })
                        .then(response => response.json())
                        .then(function (json) {
                            orderIds.push(json.orderId);
                            localStorage.setItem("orderIds", JSON.stringify(orderIds));
                            console.log(orderIds);
                            return console.log(json);
                        })
                        .catch(err => console.log(err));
                };
                if (sortedBasket[1].length != 0) {
                    //validation de la commande de d'appareils photo
                    parseProducts(sortedBasket[1]);
                    let contact = new Object;
                    let postData = new Object;
                    createPostData(contact, postData);
                    fetch("https://oc-p5-api.herokuapp.com/api/cameras/order", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify(postData)
                    })
                        .then(response => response.json())
                        .then(function (json) {
                            orderIds.push(json.orderId);
                            localStorage.setItem("orderIds", JSON.stringify(orderIds));
                            console.log(orderIds);
                            return console.log(json);
                        })
                        .catch(err => console.log(err));
                };
                if (sortedBasket[2].length != 0) {
                    //validation de la commande de meubles
                    parseProducts(sortedBasket[2]);
                    let contact = new Object;
                    let postData = new Object;
                    createPostData(contact, postData);
                    fetch("https://oc-p5-api.herokuapp.com/api/furniture/order", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify(postData)
                    })
                        .then(response => response.json())
                        .then(function (json) {
                            orderIds.push(json.orderId);
                            localStorage.setItem("orderIds", JSON.stringify(orderIds));
                            console.log(orderIds);
                            return console.log(json);
                        })
                        .catch(err => console.log(err));
                }
                document.getElementById("submit_btn").setAttribute("disabled","");
                document.getElementById("submit_btn").innerHTML = "validation commande...";
                //Ouverture de la fenètre de confirmation
                setTimeout(function(){window.open("confirmation.html")}, 2000);
            }
        } else {
            window.alert("Un des champs est invalide !");
            // si un des champs des invalide, on affiche une alerte
        }

    });
}


main();

var items=[];
var basket = JSON.parse(localStorage.panier);
var basketPrice = localStorage.prix;
var teddies;
var furniture;
var cameras;
const TEDDY="teddy";

// Crée le constructeur des items
class Item {
    constructor(option, description, imageUrl, name, price, _id, _category){
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
    displayBasketPrice(basketPrice);
    printItemsByCategoryFetch("teddies", "TEDDY", "https://oc-p5-api.herokuapp.com/api/teddies");
}

//Crée la requete vers le serveur pour appeller les items par catégorie et les affiche à l'écran

function printItemsByCategoryFetch(Items, Category, ItemsUrl){
    fetch(ItemsUrl, {
                        method: "GET",
                        headers: {
                             "Content-Type": "application/json",
                             "Accept": "application/json"
                        },
                    })
                        .then(response => response.json())
                        .then(function (json) {
                            var response = json;
                            console.log("response", response);
                            Items = response;
                            Items = parseItems(Items, Category);
                            createItemsElements(Items);
                            console.log(Category, Items);
                            return console.log(json);
                        })
                        .catch(err => console.log(err));
}


// Cette fonction crée un objet myItem pour tous les items et ajoute la catégorie aux items
function parseItems(items, category) {
    let itemsTemp = [];
    for (let i in items) {
        let myItem = new Item(items[i][Object.keys(items[i])[0]], items[i].description, items[i].imageUrl, items[i].name, items[i].price, items[i]._id, category);
        itemsTemp.push(myItem);
    }
    //ici on donne une valeur aux variables teddies, camera et furniture.
    if (category == "TEDDY") {
        teddies = itemsTemp;
        console.log("teddies:", teddies);
    }
    return itemsTemp;
}

// cette fonction crée les éléments cartes pour chaque item de items
function createItemsElements(items) {
    for (let i in items) {
        let myItem = new Item(items[i].option, items[i].description, items[i].imageUrl, items[i].name, items[i].price, items[i]._id, items[i]._category);
        let itemCard = document.createElement("div");
        let mainElement = document.getElementById("main");
        mainElement.appendChild(itemCard);
        itemCard.innerHTML = `<div class="card mx-auto mt-3" style="max-width: 750px;"><div class="row g-0"><div class="col-md-4"><img src="${myItem.imageUrl}" class="img-thumbnail" alt="image produit"></div><div class="col-md-8"><div class="card-body"><a href="produit.html?category=${myItem._category}&idProduit=${myItem._id}"><h5 class="card-title">${myItem.name}</h5></a><p class="card-text">${myItem.description}</p><div class="d-flex justify-content-between align-items-baseline"> <p class="fw-bolder">${(myItem.price / 100 + ",00")}€</p><select class="form-select"  id="option-menu${myItem._id}" aria-label="select option" style="max-width: 160px;"></select><a class="btn btn-secondary text-decoration-none" id=${myItem._id}>Ajouter au panier</a> </div></div></div></div></div></div>`;
        let optionMenu = document.getElementById(`option-menu${myItem._id}`);
        for (let j in myItem.option) {
            optionMenu.innerHTML += `<option value="${myItem.option[j]}">${myItem.option[j]}</option>`;
        }

        //ici on crée la fonction qui permet d'ajouter au panier l'objet choisi
        const ajouterAuPanier = document.getElementById(items[i]._id);
        ajouterAuPanier.addEventListener("click", function () {
            basket.push(items[i]);
            localStorage.setItem("panier", JSON.stringify(basket));
            console.log("basket", basket);
            //ici on calcule le prix du panier et on l'enregistre dans le localStorage
            calculateBasketPrice(basket);
            displayBasketPrice(basketPrice);
        });
    }
}

main();

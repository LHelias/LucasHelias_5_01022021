
var items=[];
var basket = JSON.parse(localStorage.panier);
var basketPrice = localStorage.prix;
var teddies;
var furniture;
var cameras;
const TEDDY="teddy";
const basketPriceElement= document.getElementById("basketPrice");

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
    basketPriceElement.innerHTML = `${basketPrice/100},00€`;
    printItemsByCategory("teddies", "TEDDY", "https://oc-p5-api.herokuapp.com/api/teddies");
    getItemsByCategory("cameras", "CAMERA", "https://oc-p5-api.herokuapp.com/api/cameras");
    getItemsByCategory("furniture", "FURNITURE", "https://oc-p5-api.herokuapp.com/api/furniture");
}


//Crée la requete AJAX vers le serveur pour appeller les items par catégorie et les affiche à l'écran
function printItemsByCategory(Items, Category, ItemsUrl) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            var response = JSON.parse(this.responseText);
            console.log("response", response);
            Items = response;
            Items = parseItems(Items, Category);
            createItemsElements(Items);
            console.log(Category, Items);
        }
    };
    request.open("GET", ItemsUrl);
    request.send();
}
//Crée la requete AJAX vers le serveur pour appeller les items par catégorie et stocke les données dans une variable teddy/camera/furniture
function getItemsByCategory(Items, Category, ItemsUrl) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            var response = JSON.parse(this.responseText);
            console.log("response", response);
            Items = response;
            Items = parseItems(Items, Category);
            //createItemsElements(Items);
            console.log(Category, Items);
        }
    };
    request.open("GET", ItemsUrl);
    request.send();
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
    else if (category == "CAMERA") {
        cameras = itemsTemp;
        console.log("Cameras:", cameras);
    }
    else if (category == "FURNITURE") {
        furniture = itemsTemp;
        console.log("furniture:", furniture);
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

function calculateBasketPrice(basket) {
    basketPrice = 0;
    if (basket === []) {
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

function displayBasketPrice(basketPrice) {
    if (basketPrice == 0) {
        basketPriceElement.innerHTML = `0€`;
    } else { basketPriceElement.innerHTML = `${basketPrice / 100},00€`; };
    console.log("basket price", basketPrice);
}

//Cette fonction vide l'élément main de tous les éléments enfants.
function clearMainElement() {
    let mainElement = document.getElementById("main");
    mainElement.innerHTML = "";
}

//Ici on écoute les clics sur les boutons de catégories et on crée les cartes item correspondantes.

    // const allCategories = document.getElementById("allCategories");
    // allCategories.addEventListener("click",function(){
    //     items = [];
    //     for(let i in teddies){
    //         items.push(teddies[i]);
    //     }
    //     for(let i in furniture){
    //         items.push(furniture[i]);
    //     }
    //     for(let i in cameras){
    //         items.push(cameras[i]);
    //     }
    //     clearMainElement();
    //     createItemsElements(items);
    //     console.log(items)
    // });

    const category1 = document.getElementById("category1");
    category1.addEventListener("click",function(){
        items = [];
        console.log("teddies", teddies);
        for(let i in teddies){
            items.push(teddies[i]);
        }
        clearMainElement();
        createItemsElements(items);
        console.log(items)
    });

    const category2 = document.getElementById("category2");
    category2.addEventListener("click",function(){
        items = [];
        for(let i in cameras){
            items.push(cameras[i]);
        }
        clearMainElement();
        createItemsElements(items);
        console.log(items)
    });

    const category3 = document.getElementById("category3");
    category3.addEventListener("click",function(){
        items = [];
        for(let i in furniture){
            items.push(furniture[i]);
        }
        clearMainElement();
        createItemsElements(items);
        console.log(items)
    });

main();

const urlParams = new URLSearchParams(window.location.search);
const productCategory = urlParams.get('category');
const productId = urlParams.get('idProduit')
console.log(productCategory, productId);
let product = [];
let items =[];
let basket = [];
let basketPrice = parseInt(localStorage.prix);


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


let main = function(){
    getSingleItem(productCategory,productId);
    if(localStorage.panier != undefined){
        basket = JSON.parse(localStorage.panier);
    };
    console.log("LocalStorage:",JSON.parse(localStorage.panier))
};

let getSingleItem = function(productCategory,productId){
    if (productCategory == "TEDDY"){
        let request = new XMLHttpRequest();
        request.onreadystatechange = function(){
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                var response = JSON.parse(this.responseText);
                console.log("response",response);
                product = response;
                product = parseItems(product, productCategory);
                createItemElements(product);
                console.log(productId, product);
            }
        }; 
        request.open("GET", `https://oc-p5-api.herokuapp.com/api/teddies/${productId}` );
        request.send(); 
    
    }
        else if (productCategory == "CAMERA"){
            let request = new XMLHttpRequest();
            request.onreadystatechange = function(){
                if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    console.log("response",response);
                    product = response;
                    product = parseItems(product, productCategory);
                    createItemElements(product);
                    console.log(productId, product);
                }
            }; 
            request.open("GET", `https://oc-p5-api.herokuapp.com/api/cameras/${productId}` );
            request.send(); 
        }
        else if (productCategory == "FURNITURE"){
            let request = new XMLHttpRequest();
            request.onreadystatechange = function(){
                if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    console.log("response",response);
                    product = response;
                    product = parseItems(product, productCategory);
                    createItemElements(product);
                    console.log(productId, product);
                }
            }; 
            request.open("GET", `https://oc-p5-api.herokuapp.com/api/furniture/${productId}` );
            request.send(); 
        };
   
}

//crée un objet myItem auquel on ajoute l'option de choix, et une catégorie.
let parseItems = function(items, category){
    console.log(items);
    let myItem = new Item(items[Object.keys(items)[0]], items.description, items.imageUrl, items.name ,items.price , items._id,category)
    console.log(myItem);
    return myItem;
}

//Affiche à l'écran l'élément associé à l'objet choisi.
let createItemElements = function(items){
    let myItem = new Item(items.option, items.description, items.imageUrl, items.name ,items.price , items._id, items._category)
    let itemCard = document.createElement("div");
    let mainElement = document.getElementById("main");
    mainElement.appendChild(itemCard);
    itemCard.innerHTML = `<div class="card mx-auto mt-3 container"><div class="row g-0"><div class="mx-auto"><img src="${myItem.imageUrl}" class="img-thumbnail rounded" alt="image produit" style="max-height: 800px"></div><div class="w-100"><div class="card-body h-100 d-flex flex-column"> <a href="produit.html?category=${myItem._category}&idProduit=${myItem._id}"><h5 class="card-title">${myItem.name}</h5> </a><p class="card-text">${myItem.description}</p><div class="d-flex justify-content-between align-items-center mt-auto"><p class="fw-bolder">${(myItem.price / 100 + ",00")}€</p><select class="form-select ml-auto"  id="option-menu${myItem._id}" aria-label="select option" style="max-width: 160px;"></select> <a class="btn btn-secondary text-decoration-none ml-4" id=${myItem._id}>Ajouter au panier</a></div></div></div></div></div>`;
    let optionMenu = document.getElementById(`option-menu${myItem._id}`);
        for (let j in myItem.option) {
            optionMenu.innerHTML += `<option value="${myItem.option[j]}">${myItem.option[j]}</option>`;
        }
    
    //On écoute le clic sur le bouton "ajouter au panier" pour ajouter l'objet au panier.
    const ajouterAuPanier = document.getElementById(myItem._id);
    ajouterAuPanier.addEventListener("click",function(){
        basket.push(product);
        localStorage.setItem("panier", JSON.stringify(basket));
        console.log(JSON.stringify(localStorage.panier));
        console.log("basket",basket);
        calculateBasketPrice(basket);
        displayBasketPrice(basketPrice);
    });
    displayBasketPrice(basketPrice);
}

let calculateBasketPrice = function(basket){
    basketPrice = 0;
    if (basket == []){
        basketPrice = 0;
    } else {
        for (let i in basket){
            console.log(basket[i].price);
            basketPrice += basket[i].price;
        }
    }
    console.log("prix du panier", basketPrice);
    localStorage.setItem("prix", JSON.stringify(basketPrice));
}

let displayBasketPrice = function(basketPrice){
    if (basketPrice == 0){
        basketPriceElement.innerHTML = `0€`;
    } else {basketPriceElement.innerHTML = `${basketPrice/100},00€`};
    console.log("basket price", basketPrice);
}

const basketPriceElement= document.getElementById("basketPrice");
basketPriceElement.innerHTML = `${basketPrice/100},00€`;

main();
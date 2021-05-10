const basketPriceElement = document.getElementById("basketPrice");
var defaultPanier = JSON.stringify([]);
var defaultPrix = 0;


//initialisation du LocalStorage
window.onbeforeunload = function(){
    if (localStorage.panier === undefined){
        localStorage.setItem("panier", defaultPanier);
    }
    if (localStorage.prix === undefined){
        localStorage.setItem("prix", defaultPrix);
    }
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

function displayBasketPrice(basketPrice) {
    if (basketPrice === 0 || basketPrice === NaN){
        basketPriceElement.innerHTML = "0,00€";
    } else { basketPriceElement.innerHTML = `${basketPrice / 100},00€`; };
    console.log("basket price", basketPrice);
}

//Cette fonction vide l'élément main de tous les éléments enfants.
function clearMainElement() {
    let mainElement = document.getElementById("main");
    mainElement.innerHTML = "";
}
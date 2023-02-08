/****** récupération de l'id de la commande ********/
const str = window.location.href;
console.log(str);

//instancier un nvl objet URL(window.location.href)
const url = new URL(str);
console.log(url);

let orderId = url.searchParams.get("id");
console.log(orderId);

document.querySelector("#orderId").innerHTML=orderId;

// vider le local Storage
localStorage.clear();


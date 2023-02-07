/****** récupération de l'id de la commande ********/
const url = window.location.href;
console.log(url);

let urlId = url.searchParams.get("id");
console.log(urlId);

document.querySelector("#orderId").innerHTML=urlId;

// vider le local Storage
localStorage.clear();


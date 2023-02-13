/****** récupération et affichage de l'id de la commande ********/
const str = window.location.href;
const url = new URL(str);
console.log(url);

let orderId = url.searchParams.get("id");
console.log(orderId);
document.querySelector("#orderId").innerHTML=orderId;

localStorage.clear();


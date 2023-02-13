/****** RECUPERATION ET AFFICHAGE DE L'ORDER-ID ********/
const str = window.location.href;
const url = new URL(str);
console.log(url);

let orderId = url.searchParams.get("id");
console.log(orderId);
document.querySelector("#orderId").innerHTML=orderId;

localStorage.clear();


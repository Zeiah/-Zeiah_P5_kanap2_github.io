/*************** AFFICHAGE DE LA PAGE PRODUIT  ******************
 * récupérer sur l'API les data du produit à partir de son id
 * affichage des éléments avec leurs options couleur
*****************************************************************/

const localisation = window.location.href;
const url = new URL(localisation);
console.log("url de la page:", url);
const urlId = url.searchParams.get("id");
console.log("id du produit:", urlId); 
const urlProduct = 'http://localhost:3000/api/products/' + urlId;

fetch(urlProduct)
    .then(Response => {
        if (Response.ok) {
            console.log(Response);
            Response.json().then(data => {
                document.title = data.name;
                const image = document.createElement("img");
                document.querySelector('.item__img').appendChild(image);
                image.src = data.imageUrl;
                image.alt = data.altTxt;
                document.querySelector('#title').textContent = data.name;
                document.querySelector('#price').textContent = data.price;
                document.querySelector('#description').textContent = data.description;
                const couleur = document.querySelector('#colors');
                for (let i = 0; i < data.colors.length; i++) {
                    couleur.innerHTML += `<option value="${data.colors[i]}">${data.colors[i]}</option>`;
                }
                console.log("couleurs disponibles:", data.colors);
            })
        } else {
            console.log("erreur de communication avec l'API");
            alert("problème de communication avec le serveur");
        }
    }).catch(error => {
        console.log("récupération de l'erreur:", error);
    });



/************** AJOUTER UN ITEM DANS LE PANIER ******************** 
 * créer un évenement au click sur le bouton ajouter au panier 
 * créer l'objet à ajouter (3 propriétés: id, quantité, couleur)
 * condition : avoir sélectionné une quantite et une couleur
 * condition : pas plus de 100 articles pour un item dans le panier
 * envoyer l'objet dans le localStorage
 * ******************************************************************/

const btnAddToCart = document.querySelector("#addToCart");
btnAddToCart.addEventListener("click", function () {
    let quantite = parseInt(document.querySelector("#quantity").value);
    console.log("nbre item:", quantite);
    let couleur = document.querySelector("#colors").value;
    console.log("couleur:", couleur);
    let selectionItem = {
        id: urlId,
        quantite: quantite,
        couleur: couleur,
    };
    console.log(selectionItem);
    if (quantite <= 100) {
        addLocalStorage(selectionItem);     
    } else {
        console.log("non ajouté : nbre items > 100");
        alert("Vous ne pouvez pas choisir plus de 100 articles pour chaque canapé");
    };
})

function addLocalStorage(selectionItem) {
    if (selectionItem.quantite === 0 || selectionItem.couleur === "") {
        alert("Veuillez choisir une couleur et un nombre d'articles");
        console.log("quantité:", selectionItem.quantite);
        console.log("couleur:", selectionItem.couleur);
        console.log("non ajouté: quantité ou couleur non renseignée");
    }
    else {
        console.log("couleur et quantité renseignées")
        let monPanier = JSON.parse(localStorage.getItem('monPanier')); 
        if (monPanier === null) {
            monPanier = [];
            console.log("Le panier est vide:", monPanier);
        };
        let _selectionItem = monPanier.find(item => 
            item.id === selectionItem.id 
            && item.couleur === selectionItem.couleur
        )
        if (_selectionItem) {
            console.log("item déjà ds le panier:", _selectionItem)
            let totalQuantite = (selectionItem.quantite + _selectionItem.quantite);
            console.log("quantité totale:", totalQuantite);
            if (totalQuantite > 100) {
                console.log("quantité totale >100");
                _selectionItem.quantite === _selectionItem.quantite;
                alert("Commande limitée à 100 articles pour chaque couleur, merci de vérifier votre panier et d'ajuster le nombre d'articles");
                console.log("non ajouté");
            } else {
                console.log("quantité totale <100, nvlle quantité ajoutée");
                _selectionItem.quantite += selectionItem.quantite;
                alert("La quantité pour cet article a été modifiée dans votre panier");
            }
        } else {
            console.log("aucun item avec mm id + couleur ds panier > ajout")
            monPanier.push(selectionItem);
            alert("Article ajouté au panier!");
        }
        localStorage.setItem("monPanier", JSON.stringify(monPanier));
        console.log("envoi localStorage");
    }
};

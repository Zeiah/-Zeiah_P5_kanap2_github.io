//indiquer la localisation, la page où on se trouve
const localisation = window.location.href;

//créer un nvl objet URL(window.location.href)
const url = new URL(localisation);
console.log("url de la page:", url);

//chercher l'id du produit ds le lien url (paramètre id après le ?)
let urlId = url.searchParams.get("id");
console.log("id du produit:", urlId);

//récupérer sur l'API les datas du produit à partir de son id + 
let urlProduct = 'http://localhost:3000/api/products/' + urlId;
console.log("url api avec id du produit:", urlProduct);

fetch(urlProduct)
    .then(Response => {
        if (Response.ok) {
            console.log(Response);
            Response.json().then(data => {

                //nommer la page avec le nom du produit
                document.title = data.name;
                console.log("nom de la page:", data.name)

                // affichage des propriétés de l'élément du DOM suivant le modèle html
                let image = document.createElement("img");
                document.querySelector('.item__img').appendChild(image);
                image.src = data.imageUrl;
                image.alt = data.altTxt;
                document.querySelector('#title').textContent = data.name;
                document.querySelector('#price').textContent = data.price;
                document.querySelector('#description').textContent = data.description;

                //boucle pour affichage des valeurs couleur disponibles de l'option couleur
                let couleur = document.querySelector('#colors');
                for (let i = 0; i < data.colors.length; i++) {
                    // Les variables entre la balise <option> seront celles visibles par l'utilisateur
                    couleur.innerHTML += `<option value="${data.colors[i]}">${data.colors[i]}</option>`;
                }
                console.log("couleurs disponibles:", data.colors);
            })
        }
        else {
            console.log("erreur de communication avec l'API");
            alert("problème de communication avec le serveur");
        }

    }).catch(error => {
        console.log("récupération de l'erreur:", error);
    });

/***** ajouter un produit dans le panier (id, couleur, quantite) ************/

//sélectionner le bouton qui activera l'événement "addToCart" au click
const btnAddToCart = document.querySelector("#addToCart");
btnAddToCart.addEventListener("click", function () {

    // récupérer le nombre (qui doit être un entier) sélectionné
    let quantite = parseInt(document.querySelector("#quantity").value);
    console.log("nbre item:", quantite);

    //récupérer la couleur sélectionnée
    let couleur = document.querySelector("#colors").value;
    console.log("couleur:", couleur);

    //créer un objet avec 3 propriétés (id, quantité, couleur) 
    let selectionItem = {
        id: urlId,
        quantite: quantite,
        couleur: couleur,
    };
    console.log(selectionItem);

    //Pour ajouter au panier, la quantité doit être inférieure ou égale à 100
    if (quantite <= 100) {
        //// si quantité ok, appel de la fonction qui t l'item dans le localStorage
        addLocalStorage(selectionItem);
        // afficher le type de la variable (qui doit être "number") + la quantité sélectionnée
        console.log("nbre d'items sélectionnés:", quantite + " type:", typeof quantite);     
    } else {
        console.log("refus ajout car nbre items > 100");
        alert("Vous ne pouvez pas choisir plus de 100 items pour chaque canapé");
    };
})

/**** fonction d'ajout au localStorage******/  
function addLocalStorage(selectionItem) {
    //condition : avoir sélectionné une couleur ET une quantité
    if (selectionItem.quantite === 0 || selectionItem.couleur === "") {
        alert("Veuillez choisir une couleur et un nombre d'articles");
        console.log("quantité:", selectionItem.quantite);
        console.log("couleur:", selectionItem.couleur);
        console.log("refus ajout car quantité ou couleur non renseignée");
    }
    else {
        console.log("couleur et quantité renseignées")
        // si couleur et quantité renseignées, vérifier si cela est compatible avec panier existant
       
        // récupérer le tableau monPanier (comportant les items ajoutés) dans le localStorage
        let monPanier = JSON.parse(localStorage.getItem('monPanier'));
        
        //si panier vide, créer un tableau pr ajouter l'item 
        if (monPanier === null) {
            monPanier = [];
            console.log("Le panier est vide:", monPanier);
        };

        // si panier non vide, voir si on peut trouver un item avec mm id et mm couleur que l'item à ajouter
        // nommer dans une variable cet item retrouvé = _selectionItem
        let _selectionItem = monPanier.find(item => 
            item.id === selectionItem.id 
            && item.couleur === selectionItem.couleur
        );

        // s'il y a un item avec mm id et mm couleur = additionner les quantités
        if (_selectionItem) {
            console.log("item déjà dans le panier:", _selectionItem)
            let totalQuantite = (selectionItem.quantite + _selectionItem.quantite);
            console.log("quantité totale:", totalQuantite);
            
            // Condition : la quantité totale ne doit pas être >100, sinon on bloque la commande
            if (totalQuantite > 100) {
                console.log("quantité totale >100");
                _selectionItem.quantite === _selectionItem.quantite;
                alert("Commande limitée à 100 articles pour chaque couleur, merci de vérifier votre panier et d'ajuster le nombre d'articles");
                console.log("refus ajout");
            } else {
                console.log("quantité totale <100, nvlle quantité ajoutée");
                _selectionItem.quantite += selectionItem.quantite;
                alert("La quantité a été modifiée");
            }
        }
        // si pas d'item ds le panier avec mm id et mm couleur alors ajouter la selection ds LS
        else {
            console.log("pas d'item avec mm id et mm couleur ds le panier, produit ajouté")
            monPanier.push(selectionItem);
            alert("Produit ajouté au panier");
        }

        // stocker le (nvx) panier dans le localStorage
        localStorage.setItem("monPanier", JSON.stringify(monPanier));
        console.log("envoi (nvx) panier dans localStorage");
    }
};

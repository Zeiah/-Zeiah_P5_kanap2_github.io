// nommer la page 
document.title = "Mon panier";

// récupérer les éléments sélectionnés et ajoutés au panier
function getPanier() {
  let monPanier = localStorage.getItem('monPanier');
  if (monPanier == null) {
    return [];
    //alert("votre panier est vide")
  }
  else {
    return JSON.parse(monPanier);
  };
}

const itemsPanier = getPanier(); // créer une variable qui appelle la fonction


fetch("http://localhost:3000/api/products")
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // aller chercher les données API JSON

    // affichage des éléments du pannier
    document.querySelector('#cart__items').innerHTML = ""; // récupérer structure html qui va les accueillir
    for (let i = 0; i < itemsPanier.length; i++) {
      // variables qui récupèrent 3 données de chaque item ds localStorage (id, quantite, couleur)
      const id = itemsPanier[i].id;
      let quantite = itemsPanier[i].quantiteKey;
      const couleur = itemsPanier[i].couleurKey;
      const item = data.find(p => id === p._id); // id de chaque item correspond à l'id ds json
      console.log("1", item);

      // ajout article "cart__item"
      const article = document.createElement("article");
      document.querySelector('#cart__items').appendChild(article);
      article.className = "cart__item";
      article.setAttribute("data-id", id);//attribuer à élément article id et couleur
      article.setAttribute("data-colors", couleur);

      // ajout div "cart__item_img"
      const cartItemImg = document.createElement("div");
      article.appendChild(cartItemImg);
      cartItemImg.className = "cart__item__img";

      const imageCartItemImg = document.createElement("img");
      cartItemImg.appendChild(imageCartItemImg);
      imageCartItemImg.src = item.imageUrl;
      imageCartItemImg.alt = item.altTxt;

      // ajout div "cart__item__content"
      const contentCartItem = document.createElement("div");
      article.appendChild(contentCartItem);
      contentCartItem.className = "cart__item__content";

      //ajout div "cart__item__content__description"
      const descriptionContentCartItem = document.createElement("div");
      contentCartItem.appendChild(descriptionContentCartItem);
      descriptionContentCartItem.className = "cart__item__content__description";

      const titreDescription = document.createElement("h2");
      descriptionContentCartItem.appendChild(titreDescription);
      titreDescription.textContent = item.name;

      const couleurDescription = document.createElement("p");
      descriptionContentCartItem.appendChild(couleurDescription);
      couleurDescription.textContent = "Couleur: " + couleur;

      const prixDescription = document.createElement("p");
      descriptionContentCartItem.appendChild(prixDescription);
      prixDescription.textContent = "Prix: " + item.price;

      //ajout div "cart__item__content__settings"
      const settingsContentCartItem = document.createElement("div");
      contentCartItem.appendChild(settingsContentCartItem);
      settingsContentCartItem.className = "cart__item__content__settings";

      //ajout settings : quantite
      const quantiteSettings = document.createElement("p");
      settingsContentCartItem.appendChild(quantiteSettings);
      quantiteSettings.className = "cart__item__content__settings__quantity";
      quantiteSettings.textContent = "Qté: " + quantite;

      // ajout choix de la quantite Input
      const choixQuantiteSettings = document.createElement("input");
      settingsContentCartItem.appendChild(choixQuantiteSettings);
      choixQuantiteSettings.className = "itemQuantity";
      choixQuantiteSettings.value = quantite;
      choixQuantiteSettings.setAttribute("type", "number");
      choixQuantiteSettings.setAttribute("name", "itemQuantity");
      choixQuantiteSettings.setAttribute("min", "1");
      choixQuantiteSettings.setAttribute("max", "100");

      //Ajout setting : supprimer

      const supprimerSettings = document.createElement("div");
      settingsContentCartItem.appendChild(supprimerSettings);
      supprimerSettings.className = "cart__item__content__settings__delete";

      const deleteItem = document.createElement("p");
      supprimerSettings.appendChild(deleteItem);
      deleteItem.className = "delete__item";
      deleteItem.textContent = "Supprimer";
      //mettre un événement localStorage.removeItem ()

    }  
    
    //calcul "totalQuantity" et "totaPrice"
  
  function getTotal() {
    let quantiteTotal = 0;
    let prixTotal = 0;
    
    for (let i = 0; i <itemsPanier.length; i++) {
      let quantite = itemsPanier[i].quantiteKey;
      let prix = data[i].price;
      quantiteTotal += quantite;
      prixTotal += quantite * prix;
      console.log(quantiteTotal);
      console.log(prixTotal);
    }
    document.querySelector('#totalQuantity').innerHTML=quantiteTotal;
    document.querySelector('#totalPrice').innerHTML=prixTotal;
  }

  getTotal();


  
  
            



  }).catch (error => {
  console.log("récupération de l'erreur", error);
});


/* *function changeQuantite (id, couleur, newQuantite) {
  let inputNewQuantite = document.querySelector('.itemQuantity');
  for (let i = 0; i<newQuantite.length; i++) {
    inputNewQuantite.addEventListener("change", (event) =>{
      event.preventDefault();

      let id =  itemsPanier[i].id;
      let couleur = itemsPanier[i].couleurKey;
      let oldQuantite = itemsPanier[i].quantiteKey;
      let newQuantite = document.querySelector(".cart__item__content__settings__quantity").value;
      
      let newSelectionItem = {
        id: id,
        quantiteKey: newQuantite,
        couleurKey: couleur
      }
      console.log(newSelectionItem); //dans console: retourner nvl objet

      //effacer ancien produit, recharger nouveau
      Element.closest()
      let _newSelectionItem = monPanier.find (p => p.id===newSelectionItem.id && p.couleurKey===newSelectionItem.couleurKey);
      

    
// stocker le (nvx) panier dans le localStorage
            localStorage.setItem("monPanier", JSON.stringify(monPanier));
            console.log("envoi panier dans localStorage");

            //rafraichir page
            window.location.reload();
    })
  }
  




/*
// modifier la quantite
const inputChangeQuantite = document.querySelector('.itemQuantity');
inputChangeQuantite.addEventListener("change", function(){
    let newQuantite = document.querySelector(".cart__item__content__settings__quantity").value ;
    let newSelectionItem = {
      id: urlId,
      quantiteKey: newQuantite,
      couleurKey: couleur
    }
    console.log(newSelectionItem);
    changeQuantite(newSelectionItem);
  })

//fonction 
function changeQuantite(newSelectionItem) {
  let _newSelectionItem = itemsPanier.find (p => p.id===newSelectionItem.id && p.couleurKey===newSelectionItem.couleurKey);
  let quantiteTotal = (newSelectionItem.quantiteKey + _newSelectionItem.quantiteKey);
  itemsPanier.push(newSelectionItem);
  alert("La quantite de cet item a été modifiée dans votre panier");

  // stocker la (nlle) quantite dans le localStorage
  localStorage.setItem("itemsPanier", JSON.stringify(itemsPanier));
  console.log("modification quantite dans localStorage")
}

    // appel des fonctions calculant prix total et quantite totale
    getPrixTotal();
    getQuantiteTotal();

    //fonction prix total
    function getPrixTotal() {
    let prixTotal = 0;
    document.querySelector('#totalPrice').textContent=prixTotal;
    for (let item of itemsPanier) {
    prixTotal += quantiteKey * item.price;
    }
    return prixTotal;
    };
    
    // fonction quantite totale
    function getQuantiteTotal() {
      let quantiteTotal = 0;
      document.querySelector('#totalQuantity').textContent=quantiteTotal;
      for (let item of itemsPanier) {
        quantiteTotal += quantiteKey;
      }
    return quantiteTotal;
    }

//function calculTotalQuantite () {}

 *//*//calcul totalQuantity() = addition de toutes les quantités
      let quantiteTotal = 0;
      itemsPanier.array.forEach(element => {
          quantiteTotal +quantite;
          console.log(quantiteTotal);
        });
      document.querySelector('#totalQuantity');*/
  
/*fonction supprimer item
supprimertItem.addEventListener("click", function() {
  localStorage.removeItem(ItemPanier);
  console.log("item supprimé");
  let monPanierModifie = array.from(monPanier);     
});

//effacement de l'écran >> regénérer page avec item supprime
document.querySelector('cart__item') = "";
GetPanier(monPanierModifie);

// parser panier, mapper, fetcher avec id >> map(function (monPanier)){ */

//meme methode que dans product.js mais récupérer dans le localstorage
/*<section id="cart__items">
<!--  <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
   <div class="cart__item__img">
     <img src="../images/product01.jpg" alt="Photographie d'un canapé">
   </div>
   <div class="cart__item__content">
     <div class="cart__item__content__description">
       <h2>Nom du produit</h2>
       <p>Vert</p>
       <p>42,00 €</p>
     </div>
     <div class="cart__item__content__settings">
       <div class="cart__item__content__settings__quantity">
         <p>Qté : </p>
         <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
       </div>
       <div class="cart__item__content__settings__delete">
         <p class="deleteItem">Supprimer</p>
       </div>
     </div>
   </div>
 </article> -->
</section>*/


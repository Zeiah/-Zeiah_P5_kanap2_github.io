// nommer la page 
document.title = "Mon panier";

// récupérer les éléments sélectionnés et ajoutés au panier
function getPanier() {
  let monPanier = localStorage.getItem('monPanier');
  if (monPanier == null) {
    return [];
  }
  else {
    return JSON.parse(monPanier);
  };
}

let itemsPanier = getPanier(); // créer une variable qui appelle la fonction


fetch("http://localhost:3000/api/products")
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // aller chercher les données API JSON
    document.querySelector('#cart__items').innerHTML = ""; // récupérer structure html qui va les accueillir
    for (let i = 0; i < itemsPanier.length; i++) {
      // variables qui récupèrent 3 données de chaque item ds localStorage (id, quantite, couleur)
      let id = itemsPanier[i].id;
      let quantite = itemsPanier[i].quantiteKey;
      let couleur = itemsPanier[i].couleurKey;
      let item = data.find(p => id === p._id); // id de chaque item correspond à l'id ds json
      console.log("1", item);

      // ajout article "cart__item"
      let article = document.createElement("article");
      document.querySelector('#cart__items').appendChild(article);
      article.className = "cart__item";
      article.setAttribute("data-id", id);//attribuer à élément article id et couleur
      article.setAttribute("data-colors", couleur);

      // ajout div "cart__item_img"
      let cartItemImg = document.createElement("div");
      article.appendChild(cartItemImg);
      cartItemImg.className = "cart__item_img";

      let imageCartItemImg = document.createElement("img");
      imageCartItemImg.appendChild(cartItemImg);
      imageCartItemImg.src = item.imageUrl;

      let altCartItemImg = document.createElement("alt");
      altCartItemImg.appendChild(cartItemImg);
      altCartItemImg.alt = item.altTxt;

      // ajout div "cart__item__content"
      let contentCartItem = document.createElement("div");
      article.appendChild(contentCartItem);
      contentCartItem.className = "cart__item__content";

      //ajout div "cart__item__content__description"
      let descriptionContentCartItem = document.createElement("div");
      contentCartItem.appendChild(descriptionContentCartItem);
      descriptionContentCartItem.className = "cart__item__content__description";

      let titreDescription = document.createElement("h2");
      descriptionContentCartItem.appendChild(titreDescription);
      titreDescription.textContent = item.name;

      let couleurDescription = document.createElement("p");
      descriptionContentCartItem.appendChild(couleurDescription);
      couleurDescription.textContent = "Couleur: " + couleur;

      let prixDescription = document.createElement("p");
      descriptionContentCartItem.appendChild(prixDescription);
      prixDescription.textContent = "Prix: " + item.price;

      //ajout div "cart__item__content__settings"
      let settingsContentCartItem = document.createElement("div");
      contentCartItem.appendChild(settingsContentCartItem);
      settingsContentCartItem.className = "cart__item__content__settings";

      //ajout settings : quantite
      let quantiteSettings = document.createElement("p");
      settingsContentCartItem.appendChild(quantiteSettings);
      quantiteSettings.className = "cart__item__content__settings__quantity";
      quantiteSettings.textContent = "Qté: " + quantite;

      // ajout choix de la quantite Input
      let choixQuantiteSettings = document.createElement("input");
      settingsContentCartItem.appendChild(choixQuantiteSettings);
      choixQuantiteSettings.className = "itemQuantity";
      choixQuantiteSettings.value = quantite;
      choixQuantiteSettings.setAttribute("type", "number");
      choixQuantiteSettings.setAttribute("name", "itemQuantity");
      choixQuantiteSettings.setAttribute("min", "1");
      choixQuantiteSettings.setAttribute("max", "100");

      //Ajout setting : supprimer

      let supprimerSettings = document.createElement("div");
      settingsContentCartItem.appendChild(supprimerSettings);
      supprimerSettings.className = "cart__item__content__settings__delete";

      let deleteItem = document.createElement("p");
      supprimerSettings.appendChild(deleteItem);
      deleteItem.className = "delete__item";
      deleteItem.textContent = "Supprimer";
      //mettre un événement localStorage.removeItem ()
    }
  })
  .catch (error=> {
  console.log("récupération de l'erreur", error);
});


            // cibler cart item
            // fonction initialiser le panier
/* for (let i=0; i<itemsPanier.length; i++) {

    let article = document.createElement("article");
    document.querySelector('cart__item');
    //data-id="{product-ID}" data-color="{product-color}

    let image = document.createElement("img");
    article.appendChild(image);
    image.className = "cart__item_img";
    image.src = data[i].imageUrl;

    let content = document.createElement('div');
    article.appendChild(content);
    content.className = "cart__item__content";

    let description = document.createElement('div');
    content.appendChild(description);
    description.className = "cart__item__content__description";

    let titre = document.createElement("h2");
    description.appendChild(titre);
    titre.textContent = data[i].name;

    let couleur = document.createElement("p");
    description.appendChild(couleur);
    couleur.textContent = data[i].colors;

    let prix = document.createElement("p");
    description.appendChild(prix);
    prix.textContent = data[i].price;

    let settings = document.createElement('div');
    content.appendChild(settings);
    settings.className = "cart__item__content__settings";

    let quantite = document.createElement('p');
    settings.appendChild(quantite);
    quantite.className = "cart__item__content__settings__quantity";
    quantite.innerText = "Qté:" + quantite;
    //template string
    quantite.textContent = data[i].quantite;
    //input ?

    let supprimer = document.createElement('div');
    settings.appendChild(supprimer);
    supprimer.className = "cart__item__content__settings__delete";

    let supprimerItem = document.createElement('p');
    supprimer.appendChild(supprimerItem);
    supprimerItem.className = "delete__item";
    //affichage Supprimer
    supprimer.innerText = "Supprimer";
    //mettre un événement localStorage.removeItem ()
    };

//fonction supprimer item
supprimertItem.addEventListener("click", function() {
  localStorage.removeItem(ItemPanier);
  console.log("item supprimé");
  let monPanierModifie = array.from(monPanier);     
});

//effacement de l'écran >> regénérer page avec item supprime
document.querySelector('cart__item') = "";
GetPanier(monPanierModifie);

// parser panier, mapper, fetcher avec id >> map(function (monPanier)){


  

    


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


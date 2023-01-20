// nommer la page 
document.title = "Mon panier";

// récupérer les éléments sélectionnés et ajoutés au panier
function GetPanier() {
    let monPanier = localStorage.getItem('monPanier');
    if (monPanier == null) {
        return [];
    }
    else {
        return JSON.parse(monPanier);
    };
}

GetPanier () // appeler la fonction


/*fetch(localStorage)
    .then(res => {
        if (res.ok) {
            console.log(res);
            res.json() .then(data => { */

const itemPanier = ('i') 

for (let i=0; i<localStorage.length; i++) {

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


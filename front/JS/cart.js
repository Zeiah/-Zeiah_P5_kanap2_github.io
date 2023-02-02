// nommer la page 
document.title = "Kanap Mon panier";

// récupérer dans le localStorage les éléments sélectionnés et ajoutés au panier
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

let itemsPanier = getPanier(); // créer une variable qui appelle la fonction


/* // Appel de l'API pour l'affichage des éléments du DOM
  // Récupérer les propriétés non enregistrées dans le localStorage */
fetch("http://localhost:3000/api/products")
  .then(response => response.json())
  .then(data => {
    console.log(data);
    
    document.querySelector('#cart__items').innerHTML = ""; // récupérer structure html qui va les accueillir
    for (let i = 0; i < itemsPanier.length; i++) {
      // variables qui récupèrent 3 données de chaque item ds localStorage (id, quantite, couleur)
      let id = itemsPanier[i].id;
      let quantite = itemsPanier[i].quantiteKey;
      let couleur = itemsPanier[i].couleurKey;
      let item = data.find(p => id === p._id); // id item ds LS doit correspondre à id item ds json
      console.log("1", item);

      // ajout article "cart__item"
      const article = document.createElement("article");
      document.querySelector('#cart__items').appendChild(article);
      article.className = "cart__item";
      //attribuer à élément <article> id et couleur
      article.setAttribute("data-id", id);
      article.setAttribute("data-color", couleur);

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
      deleteItem.className = "deleteItem";
      deleteItem.textContent = "Supprimer";
    }

    //calcul "totalQuantity" et "totaPrice"
    function getTotal() {
      let quantiteTotal = 0;
      let prixTotal = 0;

      for (let i = 0; i < itemsPanier.length; i++) {
        let quantite = itemsPanier[i].quantiteKey;
        let prix = data[i].price;
        quantiteTotal += quantite;
        prixTotal += quantite * prix;
        console.log(quantiteTotal);
        console.log(prixTotal);
      }
      document.querySelector('#totalQuantity').innerHTML = quantiteTotal;
      document.querySelector('#totalPrice').innerHTML = prixTotal;
    };

    getTotal();


    /* Sélectionner l'élément à supprimer dans le localStorage
 * Faire un tableau avec les btn à supprimer
 * Chercher id de item ds tableau et comparer avec item ds LS
 * Filtrer item trouvé et supprimer du panier LS
 * Enregistrer le nouveau panier dans LS
 * Rafraichir la page */

    function toDeleteItem() {
      console.log("1 debut fonction");
      let boutons = document.querySelectorAll(`.deleteItem`);
      console.log("2 debut fonction2", boutons);
      
      for (let bouton of Array.from(boutons)) {
        console.log("3 boucle")
        bouton.addEventListener("click", event => {
          console.log("4 debut event");
          let cartItemToDelete = event.target.closest("article");
          console.log("5 article to delete", cartItemToDelete);
          let monPanier = itemsPanier.filter(p => p.id !== cartItemToDelete.dataset.id || p.couleurKey !== cartItemToDelete.dataset.couleur
            ); // newItemsPanier >> monPanier (comme sur la page product)
          console.log("6 filtrer nouveau panier");

          localStorage.setItem("monPanier", JSON.stringify(monPanier)); // cf ligne 45
          console.log("7 envoyer dans LS");
          
          const section= document.querySelector("#cart__items");
          section.removeChild(bouton.closest("article"));
          console.log("8 suppression article du DOM");
          alert("Votre article a été supprimé");
          getTotal()
          
   
          // rafaichir page >> recalcul total quantite et prix
          //window.location.reload();
          //getPanier () + getTotal()
          window.Location.href="cart.html"
        });
      }
    };
    
    toDeleteItem();
    
  }).catch(error => {
    console.log("récupération de l'erreur", error);
  });


 /* form ET COMMANDE
  * validation form
  * commmande order*/

 
 // ******************* formulaire **********************

  let form = document.querySelector(".cart__order__form");

  //écoute des modifications des champs du formulaire 
  form.firstName.addEventListener("change", function(){
    validationFirstName(this);
  });
  form.lastName.addEventListener("change", function(){
    validationLastName(this);
  });
   form.address.addEventListener("change", function(){
    validationAddress(this);
  });
  form.city.addEventListener("change", function(){
    validationCity(this);
  });
  form.email.addEventListener("change", function(){
    validationEmail(this);
  });
  
  //vérification des inputs
 
  const validationFirstName = function(inputFirstName) {
    let firstNameRegexp = new RegExp(/^[a-zA-Z-\s]+$/);
    let firstNameError = document.querySelector(".firstNameErrorMsg");
    if (firstNameRegexp.test(inputFirstName.value)) {
      console.log("nom ok");
      return true
    } else {
      firstNameError.innerHTML= "nom non valide";
      alert("Veuillez saisir votre nom");
      return false
    }
  };
  
  const validationLastName = function (inputLastName) {
    let lastNameRegexp = new RegExp(/^[a-zA-Z-\s]+$/);
    let lastNameError = document.querySelector(".lastNameErrorMsg");
    if (lastNameRegexp.test(inputLastName.value)) {
      console.log("prénom ok");
      return true;
    } else {
      lastNameError.innerHTML= " prénom invalide";
      alert("Veuillez saisir votre prénom");
      return false
    }
  };
  
  const validationAddress = function (inputAddress) {
    let addressRegexp = new RegExp(/^[0-9]+[\s]?(bis|ter|quarter)?[\s]?[a-zA-ZÀ-ÖØ-öø-ÿ\s,'-]+$/);
    let addressError = document.querySelector(".addressErrorMsg");
    if (addressRegexp.test(inputAddress.value)) {
      console.log("adresse ok");
      return true;
    } else {
      addressError.innerHTML= " adresse non valide";
      alert("Veuillez saisir votre adresse");
      return false
    }
  };
  
  const validationCity = function (inputCity) {
    let cityRegexp = new RegExp(/^[0-9]{5}[\s]?[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/);
    let cityError = document.querySelector(".cityErrorMsg");
    if (cityRegexp.test(inputCity.value)) {
      console.log("ville et code postal ok");
      return true;
    } else {
      cityError.innerHTML = "code postal et nom de ville non valides";
      alert("Veuillez saisir votre code postal et votre ville");
      return false
    }
  };

  const validationEmail = function(inputEmail) {
    let emailRegexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i);
    let emailError = document.querySelector(".emailErrorMsg");
    if (emailRegexp.test(inputEmail.value)) {
      console.log("email ok");
      return true;
    } else {
      emailError.innerHTML= " email non valide";
      alert("Veuillez saisir votre email");
      return false
    }
  };
  
// soumission des inputs
 form.addEventListener("submit", function(event){
  event.preventDefault();
  if ((validationFirstName(form.firstName))
    && (validationLastName(form.lastName))
    && (validationAddress(form.address))
    && (validationCity(form.city))
    && (validationEmail(form.email))) {
      form.submit()
    }
 });

 




 /*//commander : post form et panier
 function commander(){
  const inputCartOrder = document.querySelector("#order");
  inputCartOrder.addEventListener("submit", function(event){
    event.preventDefault();
   
    //Création de l'objet Cart Order 
    form = {
      firstName: event.target.querySelector("[name-firstName]").value,
      lastName: event.target.querySelector("[name-lastName]").value,
      address: event.target.querySelector("[name-address]").value,
      city: event.target.querySelector("[name-city]").value,
      email: event.target.querySelector("[name-email]").value,
    };


    // ajouter le panier à partir du LS
    // création de la charge utile au format JSON
    const chargeUtile = JSON.stringify(form);
    // appel de la fonction Fetch, avec les infos nécessaires
    fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: chargeUtile,
    });
  });
}

commander();



  


  /*
  
  ESSAI 3 delete item
  for (let i = 0; i < boutons.length; i++) {
      console.log("3 boucle")
      boutons.addEventListener('click', (event) => {
        console.log("4 debut event");
        let cartItemToDelete = boutons[i].closest("article");
        console.log("5 article to delete", cartItemToDelete);
        itemsPanier = itemsPanier.filter(
          p => p.id !== cartItemToDelete.dataset.id || p.couleurKey !== cartItemToDelete.dataset.couleur
        );
        localStorage.setItem("itemsPanier", JSON.stringify(itemsPanier));

        const section= document.querySelector("#cart__items");
        section.removeChild(boutons.closest("article"));
        alert("Votre article a été supprimé");
        
        // rafaichir page >> recalcul total quantite et prix
        window.location.reload();
      })
    }
  };
  
  
  ESSAI 2 
  
  function toDeleteItem() {
    console.log("debut fonction1");
    const boutons = document.querySelectorAll(".deleteItem");
    console.log("debut fonction2", boutons);
    
    for (let i = 0; i < boutons.length; i++) {
      console.log("debut fonction3 - boucle");
      boutons.addEventListener("click", (event) => {
        console.log("debut fonction4 - addEventListener");
        let monPanier = JSON.parse(localStorage.getItem('monPanier'));
        console.log("récuperer panier 5", monPanier);
        const cartItemToDelete = boutons.closest("article");
        console.log("identifier article 6.1", cartItemToDelete);
        const idCartItemToDelete= event.target.closest("article").getAttribute("data-id");
        console.log("identifier article 6.2", idCartItemToDelete);
        const colorCartItemToDelete= event.target.closest("article").getAttribute("data-color");
        console.log("identifier article 6.3", colorCartItemToDelete);
        const rechercheCartItemToDelete = monPanier.find(
          (p) => p.id===idCartItemToDelete && p.couleurKey===colorCartItemToDelete
        );
        monPanier = monPanier.filter(
          (p) => p !== rechercheCartItemToDelete
        );
        localStorage.setItem("monPanier", JSON.stringify(monPanier));
        console.log("envoi panier dans localStorage");
        const section= document.querySelector("#cart__items");
        section.removeChild(event.target.closest("article"));
        alert("Votre article a été supprimé");
        getTotal();
      });
    }
  };
    
  toDeleteItem();
    
function deleteItem() {
  let boutons = document.querySelector(".deleteItem");
  for (let i=0; i<boutons; i++){
    boutons[i].addEventListener("click", (event) => {
      event.preventDefault();
      const cartItemToDelete = boutons[i].closest('.cart__item');
      console.log(cartItemToDelete);
      const idDelete= event.target.closest("article").getAttribute("data-id");
      const couleurDelete= event.target.closest("article").getAttribute("data-colors");
      console.log(couleurDelete);
      console.log(idDelete);

    if(cartItemToDelete !== null){
  
    }else {
      alert("item non trouvé");
    }
    console.log(cartItemToDelete);
    
    //chercher l'élement dans LS qui a cet id et cette couleur
    let monPanier=JSON.parse(localStorage.getItem('monPanier'));
    let cartItemDansLS = monPanier.find (p => p.id===cartItemToDelete.idDelete && p.couleurKey===cartItemToDelete.couleurDelete);
    
    // si mm id et mm couleur alors supprimer
    if (cartItemDansLS.id === cartItemToDelete.idDelete 
        && cartItemDansLS.couleurKey === cartItemToDelete.couleurDelete) {
          itemsPanier.splice(0,1);
          console.log("supp ds DOM")
          cartItemDansLS.remove();
          console.log("supp item ds LS")
          cartItemToDelete.removeItem();
          console.log("supp item");
    } ;
    
    */









/*function changeQuantite (id, couleur, newQuantite) {
  let inputNewQuantite = document.querySelector('.itemQuantity');
  for (let i = 0; i<newQuantite.length; i++) {
    inputNewQuantite.addEventListener("change", (event) =>{
      event.preventDefault();

      let id =  itemsPanier[i].id;
      let couleur = itemsPanier[i].couleurKey;
      let oldQuantite = itemsPanier[i].quantiteKey;
      let newQuantite = document.querySelector(".cart__item__content__settings__quantity").value;
      
      let necartItemDansLS = {
        id: id,
        quantiteKey: newQuantite,
        couleurKey: couleur
      }
      console.log(necartItemDansLS); //dans console: retourner nvl objet
        
// stocker le (nvx) panier dans le localStorage
            localStorage.setItem("monPanier", JSON.stringify(monPanier));
            console.log("envoi panier dans localStorage");
  
/*
// modifier la quantite
const inputChangeQuantite = document.querySelector('.itemQuantity');
inputChangeQuantite.addEventListener("change", function(){
    let newQuantite = document.querySelector(".cart__item__content__settings__quantity").value ;
    let necartItemDansLS = {
      id: urlId,
      quantiteKey: newQuantite,
      couleurKey: couleur
    }
    console.log(necartItemDansLS);
    changeQuantite(necartItemDansLS);
  })

//fonction 
function changeQuantite(necartItemDansLS) {
  let _necartItemDansLS = itemsPanier.find (p => p.id===necartItemDansLS.id && p.couleurKey===necartItemDansLS.couleurKey);
  let quantiteTotal = (necartItemDansLS.quantiteKey + _necartItemDansLS.quantiteKey);
  itemsPanier.push(necartItemDansLS);
  alert("La quantite de cet item a été modifiée dans votre panier");

  // stocker la (nlle) quantite dans le localStorage
  localStorage.setItem("itemsPanier", JSON.stringify(itemsPanier));
  console.log("modification quantite dans localStorage")
}
 
/*fonction supprimer item
supprimertItem.addEventListener("click", function() {
  localStorage.removeItem(ItemPanier);
  console.log("item supprimé");
  let monPanierModifie = array.from(monPanier);     
});

// parser panier, mapper, fetcher avec id >> map(function (monPanier)){ */



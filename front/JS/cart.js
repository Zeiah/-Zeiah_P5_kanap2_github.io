// nommer la page 
document.title = "Kanap Cart";

// récupérer dans le localStorage les éléments ajoutés au panier
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
      let quantite = itemsPanier[i].quantite;
      let couleur = itemsPanier[i].couleur;
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

    getTotal();
    toModifyQuantity()
    toDeleteItem();

  }).catch(error => {
    console.log("récupération de l'erreur", error);
  });


//calcul "totalQuantity" et "totalPrice"

function getTotal() {
  fetch("http://localhost:3000/api/products")
    .then(response => response.json())
    .then(data => {

      let quantiteTotal = 0;
      let prixTotal = 0;
      let prixTotalParItem = 0;

      for (let i = 0; i < itemsPanier.length; i++) {
        let id = itemsPanier[i].id;
        let item = data.find(p => id === p._id);

        let quantite = itemsPanier[i].quantite;
        console.log("Quantite item: ", quantite)
        let prix = item.price;
        console.log("Prix item:", prix)
        prixTotalParItem = quantite * prix;
        console.log("Prix total item:", prixTotalParItem)

        quantiteTotal += parseInt(quantite);
        console.log("Quantité totale:", quantiteTotal);

        prixTotal += quantite * prix;
        console.log("Prix total:", prixTotal);
      }
      document.querySelector('#totalQuantity').innerHTML = quantiteTotal;
      document.querySelector('#totalPrice').innerHTML = prixTotal;

    }).catch(error => {
      console.log("récupération de l'erreur", error);
    });
}


//************* modifier quantité d'un item ********************

function toModifyQuantity() {
  let itemsPanier = getPanier();

  // viser input de la quantite
  let modifQuantity = document.querySelectorAll(".itemQuantity");

  for (let i = 0; i < modifQuantity.length; i++) {
    modifQuantity[i].addEventListener("change", () => {
      let oldQuantite = itemsPanier[i].quantite;
      console.log("old quantité:", oldQuantite);
      let newQuantite = modifQuantity[i].value;
      console.log("new quantite:", newQuantite);

      if (newQuantite > 100) {
        alert("Vous ne pouvez pas commander plus de 100 canapés pour chaque couleur");
      } else {
        //vérifier si la newQuantite est différente de la oldQuantite 
        const verifQuantite = itemsPanier.find((item) => item.newQuantite !== oldQuantite);
        verifQuantite.quantite = newQuantite;
        itemsPanier[i].quantite = verifQuantite.quantite;

        //enregistrer le nouveau panier dans le localStorage
        localStorage.setItem("monPanier", JSON.stringify(itemsPanier))
        alert("La quantité a été modifiée");
      }

      return location.reload()
    })
  }
}


//************* supprimer un item ******************************
/* Sélectionner l'élément à supprimer dans le localStorage
 * Faire un tableau avec les btn à supprimer
 * Chercher id de item ds tableau et comparer avec item ds LS
 * Filtrer item trouvé et supprimer du panier LS
 * Enregistrer le nouveau panier dans LS
 * Rafraichir la page */

//Fonction supression, supprime un article dynamiquement du panier et de l'affichage
function toDeleteItem() {
  const cartdelete = document.querySelectorAll(".cart__item .deleteItem");
  //pour chaque élément cartdelete
  cartdelete.forEach((cartdelete) => {
    //voir s'il y a un clic dans l'article concerné
    cartdelete.addEventListener("click", () => {
      //appel de la ressource du local storage
      let panier = JSON.parse(localStorage.getItem("monPanier"));
      for (let d = 0, c = panier.length; d < c; d++)
        if (
          panier[d]._id === cartdelete.dataset.id &&
          panier[d].couleur === cartdelete.dataset.couleur
        ) {
          //déclaration de variable utile pour la toDeleteItem
          const num = [d];
          //création d'un tableau miroir
          let nouveauPanier = JSON.parse(localStorage.getItem("monPanier"));
          //toDeleteItem de 1 élément à l'indice num
          nouveauPanier.splice(num, 1);
          //affichage informatif
          if (nouveauPanier && nouveauPanier.length == 0) {
            //si il n'y a pas de panier on créait un H1 informatif et quantité appropriées
            document.querySelector("#totalQuantity").innerHTML = "0";
            document.querySelector("#totalPrice").innerHTML = "0";
            document.querySelector("h1").innerHTML =
              "Vous n'avez pas d'article dans votre panier";
          }
          //renvoit le nouveau panier converti dans le local storage et on joue la fonction
          localStorage.monPanier = JSON.stringify(nouveauPanier);
          // getTotal();
          return location.reload();
        }
    });
  });
}


/************ FORMULAIRE *********************/

// sélection du bouton commander :
let btnCommander = document.querySelector("#order");

// écoute du bouton commander quand click
btnCommander.addEventListener("click", (event) => {
  event.preventDefault();

  //Récupérer les valeurs du formulaire dans un objet contact
  contact = {
    firstName: document.querySelector("#firstName").value,
    lastName: document.querySelector("#lastName").value,
    address: document.querySelector("#address").value,
    city: document.querySelector("#city").value,
    email: document.querySelector("#email").value,
  };

  //Fonctions de validation des données saisies dans les différents champs du formulaire

  function validationFirstName() {
    let firstName = contact.firstName;
    const firstNameError = document.querySelector("#firstNameErrorMsg")
    const inputFirstName = document.querySelector("#firstName");
    const masqueFirstName = new RegExp(/^[a-zA-ZÀ-ÿ]{2,35}([-' ,][a-zA-ZÀ-ÿ]+)*$/i);
    if (masqueFirstName.test(firstName)) {
      console.log("firstName ok");
      firstNameError.innerHTML = "";
      inputFirstName.style.border = "2px solid green";
      return true;
    } else {
      firstNameError.innerHTML = "Erreur dans votre prénom: 2 lettres minimum, aucun chiffre";
      inputFirstName.style.border = "2px solid red";
      return false;
    }
  };

  function validationLastName() {
    let lastName = contact.lastName;
    const lastNameError = document.querySelector("#lastNameErrorMsg");
    const inputLastName = document.querySelector("#lastName");
    const masqueLastName = new RegExp(/^[a-zA-ZÀ-ÿ]{2,35}([-' ,][a-zA-ZÀ-ÿ]+)*$/i);
    if (masqueLastName.test(lastName)) {
      console.log("lastName ok");
      lastNameError.innerHTML = "";
      inputLastName.style.border = "2px solid green";
      return true;
    } else {
      lastNameError.innerHTML = "Erreur dans votre nom: 2 lettres minimum, pas de chiffre";
      lastName.style.border = "2px solid red";
      return false;
    }
  };

  function validationAddress() {
    let address = contact.address;
    const addressError = document.querySelector("#addressErrorMsg");
    const inputAddress = document.querySelector("#address");
    const masqueAddress = new RegExp(/^\d{1,3}( bis| ter| quater)? (rue|avenue|boulevard|route|chemin|impasse) [a-zA-ZÀ-ÿ]+$/i);
    if (masqueAddress.test(address)) {
      console.log("address ok");
      addressError.innerHTML = "";
      inputAddress.style.border = "2px solid green";
      return true;
    } else {
      addressError.innerHTML = "Merci de vérifier votre adresse : n° + nom de la voie";
      inputAddress.style.border = "2px solid red";
      return false;
    }
  };

  function validationCity() {
    let city = contact.city;
    const cityError = document.querySelector("#cityErrorMsg");
    const inputCity = document.querySelector("#city");
    const masqueCity = new RegExp(/^[0-9]{5}[\s]?[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/);
    if (masqueCity.test(city)) {
      console.log("city ok");
      cityError.innerHTML = "";
      inputCity.style.border = "2px solid green";
      return true;
    } else {
      cityError.innerHTML = "Merci d'indiquer votre code postal et votre ville";
      inputCity.style.border = "2px solid red";
      return false;
    }
  };

  function validationEmail() {
    let email = contact.email;
    const emailError = document.querySelector("#emailErrorMsg");
    const inputEmail = document.querySelector("#email");
    const masqueEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i);
    if (masqueEmail.test(email)) {
      console.log("email ok");
      emailError.innerHTML = "";
      inputEmail.style.border = "2px solid green";
      return true;
    } else {
      emailError.innerHTML = "Merci de renseigner un email valide (monMail123@nomdedomaine.com)";
      inputEmail.style.border = "2px solid red";
      return false;
    }
  };

  // Validation du formulaire avant envoi
  if (
    firstName === null
    || lastName === null
    || address === null
    || city === null
    || email === null
  ) {
    console.log("formulaire incomplet");
    alert("Merci de remplir tous les champs du formulaire");
  } else if (
    validationFirstName() === false
    || validationLastName() === false
    || validationAddress() === false
    || validationCity() === false
    || validationEmail() === false
  ) {
    console.log("erreur formulaire");
    alert("Merci de vérifier le formulaire de contact");
  } else {
    console.log("formulaire ok");
    postOrder()
  }

  // variable qui récupére l'orderId envoyé comme réponse par le server lors de la requête POST 
  let orderId = "";

  // requête du serveur et POST des données
  function postOrder() {

    // Créer un tableau avec les id des produits (quid quantite et couleur)
    let products = itemsPanier.map(i => i.id);
    console.log("recup id items du panier", products);

    //Envoyer formulaire et produits du panier sur serveur avec méthode POST
    chargeUtile = {
      contact: contact,
      products: products,
    };

    console.log(chargeUtile)
    
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(chargeUtile)
    })

      //stocker la réponse de l'API (orderId)
      .then((response) => {
        return response.json();
      })
      .then((server) => {
        orderId = server.orderId;
        console.log(orderId);

        // Rediriger vers la page order si la commande a bien un orderId
        if (orderId != "") {
          alert("Merci pour votre commande!")
          document.location.href = "confirmation.html?id=" + orderId;
        }
      })
    // vider le local storage ?  localStorage.clear()
  }
})





/*
// ******************* formulaire **********************
 const form = document.querySelector(".cart__order__form");
 let firstName = document.querySelector("#firstName").value;
 let lastName = document.querySelector("#lastName").value;
 let address = document.querySelector("#address").value;
 let city = document.querySelector("#city").value;
 let email = document.querySelector("#email").value;

 let firstNameError = document.querySelector(".firstNameErrorMsg");
 let lastNameError = document.querySelector(".lastNameErrorMsg");
 let addressError = document.querySelector(".addressErrorMsg");
 let cityError = document.querySelector(".cityErrorMsg");
 let emailError = document.querySelector(".emailErrorMsg");

 //***************** commander***********

 

    //Création de l'objet Cart Order
    /* = {
      form : {
        // comme form.submit() plus haut >> form: form
        // formData.append(name, value)?
        // firstName: form.firstName
        firstName: event.target.querySelector("[name-firstName]").value,
        lastName: event.target.querySelector("[name-lastName]").value,
        address: event.target.querySelector("[name-address]").value,
        city: event.target.querySelector("[name-city]").value,
        email: event.target.querySelector("[name-email]").value,
      },
      monPanier : {itemsPanier},

    };*/



/* ESSAI 5
function toDeleteItem() {
console.log("1 debut fonction");
let btnToDelete = document.querySelector(".deleteItem");
console.log("2 debut fonction2");
 
btnToDelete.forEach((btnToDelete) => {
  console.log(btnToDelete);
  btnToDelete.addEventListener("click", () => {
    // appel au localStorage
    let panier = JSON.parse(localStorage.getItem("monPanier"));
    // retrouver cartItem à partir bouton
    let cartDelete = btnToDelete.closest(".cart__item");
    for (let i = 0; i < panier.length; i++) {
      if (
        panier[i]._id === cartDelete.dataset.id &&
        panier[i].couleur === cartDelete.dataset.couleur
      ){
        let itemToDelete = [i];
        let nouveauPanier = JSON.parse(localStorage.getItem("monPanier"));
        nouveauPanier.splice(itemToDelete,1);
        if (nouveauPanier && nouveauPanier.length == 0){
          document.querySelector("#totalQuantity").innerHTML = "0";
          document.querySelector("#totalPrice").innerHTML = "0";
          document.querySelector("h1").innerHTML =
            "Vous n'avez plus d'article dans votre panier";
        }
        localStorage.monPanier = JSON.stringify(nouveauPanier);
        getTotal()
        return location.reload()
      } 
    }
  })
}
)}
 

ESSAI 4 delete item // fonctionne mais ne s'efface pas du panier
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
    let monPanier = itemsPanier.filter(p => p.id !== cartItemToDelete.dataset.id || p.couleur !== cartItemToDelete.dataset.couleur
      ); // newItemsPanier >> monPanier (comme sur la page product)
    console.log("6 filtrer nouveau panier");

    localStorage.setItem("monPanier", JSON.stringify(monPanier)); // cf ligne 45
    console.log("7 envoyer dans LS");
    
    const section= document.querySelector("#cart__items");
    section.removeChild(bouton.closest("article"));
    console.log("8 toDeleteItem article du DOM");
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
 
ESSAI 3 delete item
for (let i = 0; i < boutons.length; i++) {
    console.log("3 boucle")
    boutons.addEventListener('click', (event) => {
      console.log("4 debut event");
      let cartItemToDelete = boutons[i].closest("article");
      console.log("5 article to delete", cartItemToDelete);
      itemsPanier = itemsPanier.filter(
        p => p.id !== cartItemToDelete.dataset.id || p.couleur !== cartItemToDelete.dataset.couleur
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
        (p) => p.id===idCartItemToDelete && p.couleur===colorCartItemToDelete
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
  let cartItemDansLS = monPanier.find (p => p.id===cartItemToDelete.idDelete && p.couleur===cartItemToDelete.couleurDelete);
  
  // si mm id et mm couleur alors supprimer
  if (cartItemDansLS.id === cartItemToDelete.idDelete 
      && cartItemDansLS.couleur === cartItemToDelete.couleurDelete) {
        itemsPanier.splice(0,1);
        console.log("supp ds DOM")
        cartItemDansLS.remove();
        console.log("supp item ds LS")
        cartItemToDelete.removeItem();
        console.log("supp item");
  } ;
  
  */










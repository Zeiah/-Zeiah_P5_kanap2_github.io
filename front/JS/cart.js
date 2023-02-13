document.title = "Kanap Cart";

// récupérer dans le localStorage les éléments ajoutés au panier
function getPanier() {
  let monPanier = localStorage.getItem('monPanier');
  if (monPanier == null) {
    return [];
  }
  else {
    return JSON.parse(monPanier);
  };
}

let itemsPanier = getPanier();
console.log("items dans le panier", itemsPanier);
  if(itemsPanier.length == 0) {
    document.querySelector("#totalQuantity").innerHTML = "0";
     document.querySelector("#totalPrice").innerHTML = "0";
  document.querySelector("h1").innerHTML =
            "Votre panier est vide";
  console.log("Panier vide", monPanier);
  }
    

/****** AFFICHAGE DES ELEMENTS DU PANIER ******************
 * Récupérer sur l'API les propriétés non enregistrées dans le localStorage 
 * 
 * ******/
fetch("http://localhost:3000/api/products")
  .then(response => response.json())
  .then(data => {
    console.log("données products API", data);
    document.querySelector('#cart__items').innerHTML = "";
    for (let i = 0; i < itemsPanier.length; i++) {
      let id = itemsPanier[i].id;
      let quantite = itemsPanier[i].quantite;
      let couleur = itemsPanier[i].couleur;
      let item = data.find(p => id === p._id);

      const article = document.createElement("article");
      document.querySelector('#cart__items').appendChild(article);
      article.className = "cart__item";
      article.setAttribute("data-id", id);
      article.setAttribute("data-color", couleur);

      const cartItemImg = document.createElement("div");
      article.appendChild(cartItemImg);
      cartItemImg.className = "cart__item__img";

      const imageCartItemImg = document.createElement("img");
      cartItemImg.appendChild(imageCartItemImg);
      imageCartItemImg.src = item.imageUrl;
      imageCartItemImg.alt = item.altTxt;

      const contentCartItem = document.createElement("div");
      article.appendChild(contentCartItem);
      contentCartItem.className = "cart__item__content";

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

      const settingsContentCartItem = document.createElement("div");
      contentCartItem.appendChild(settingsContentCartItem);
      settingsContentCartItem.className = "cart__item__content__settings";

      const quantiteSettings = document.createElement("p");
      settingsContentCartItem.appendChild(quantiteSettings);
      quantiteSettings.className = "cart__item__content__settings__quantity";
      quantiteSettings.textContent = "Qté: " + quantite;

      const choixQuantiteSettings = document.createElement("input");
      settingsContentCartItem.appendChild(choixQuantiteSettings);
      choixQuantiteSettings.className = "itemQuantity";
      choixQuantiteSettings.value = quantite;
      choixQuantiteSettings.setAttribute("type", "number");
      choixQuantiteSettings.setAttribute("name", "itemQuantity");
      choixQuantiteSettings.setAttribute("min", "1");
      choixQuantiteSettings.setAttribute("max", "100");

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
    console.log("récupération de l'erreur:", error);
  });


/******************** FONCTION DE CALCUL QUANTITE TOTAL ET PRIX TOTAL ********************/
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
      console.log("récupération de l'erreur:", error);
    });
}


/************* FONCTION DE MODIFICATION DE LA QUANTITE ******************
* créer un événement au changement sur l'input quantité
* identifier l'article à modifier dans le LS
* modifier sa quantité
* renvoyer la panier modifié dans le LS et rafraîchir la page
*************************************************************************/

function toModifyQuantity() {
  let itemsPanier = getPanier();
  let inputQuantiteModifiee = document.querySelectorAll(".itemQuantity");
  for (let i = 0; i < inputQuantiteModifiee.length; i++) {
    inputQuantiteModifiee[i].addEventListener("change", () => {
      let oldQuantite = itemsPanier[i].quantite;
      console.log("old quantité:", oldQuantite);
      let newQuantite = inputQuantiteModifiee[i].value;
      console.log("new quantite:", newQuantite);
      if (newQuantite > 100) {
        alert("Vous ne pouvez pas commander plus de 100 articles pour chaque couleur");
      } else if (newQuantite <= 0){
        alert("La quantité doit être d'au moins un article, merci de supprimer cet article");
      } else {
        let itemAvecModif = itemsPanier.find((item) => item.newQuantite !== oldQuantite);
        console.log("item avec old quantité :", itemAvecModif);
        itemAvecModif.quantite = newQuantite;
        console.log("item avec new quantité :", itemAvecModif);
        localStorage.setItem("monPanier", JSON.stringify(itemsPanier));
        alert("La quantité a été modifiée");
      }
      return location.reload()
    })
  }
};


/************* SUPPRIMER UN ARTICLE *****************************************
 * Déclencher un événement au click du bouton supprimer
 * Identifier l'élément à supprimer dans le panier du LS
 * Renvoyer le panier dans le LS sans cet élément et rafraîchir la page 
 * **************************************************************************/

function toDeleteItem() {
  let itemsPanier = getPanier();
  const btnDeleteItem = document.querySelectorAll(".deleteItem");
  for (let i = 0; i < btnDeleteItem.length; i++){
    btnDeleteItem[i].addEventListener("click", (event) => {
      let cartItemToDelete = event.target.closest(".cart__item ");
      console.log("item à supprimer:", cartItemToDelete)
      let idCartItemToDelete = cartItemToDelete.dataset.id;
      console.log("id item to delete:", idCartItemToDelete);
      let couleurCartItemToDelete = cartItemToDelete.dataset.color;
      console.log("couleur item to delete:", couleurCartItemToDelete); 
      itemsPanier = itemsPanier.filter( p => 
        p.id === idCartItemToDelete
        && p.couleur != couleurCartItemToDelete);
      console.log("nvx panier:", itemsPanier)
      localStorage.setItem("monPanier", JSON.stringify(itemsPanier))
      alert("Votre article a été supprimé");
      return location.reload();
      })
  }
};


/************ FORMULAIRE *****************************************
 *Déclencher un événement au click du bouton commander
 *Récupérer les valeurs du formulaire dans un objet contact
 *Fonctions de validation des données saisies dans les différents champs du formulaire (RegExp)
 *Validation du formulaire avant envoi (requête POST)
 *Constituer un objet (charge utile): objet contact + tableau des id des produits
 *Envoyer charge utile sur serveur et récupérer l'orderId en retour
*******************************************************************/
let btnCommander = document.querySelector("#order");
btnCommander.addEventListener("click", (event) => {
  event.preventDefault();
  contact = {
    firstName: document.querySelector("#firstName").value,
    lastName: document.querySelector("#lastName").value,
    address: document.querySelector("#address").value,
    city: document.querySelector("#city").value,
    email: document.querySelector("#email").value,
  };

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
      inputLastName.style.border = "2px solid red";
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

  if (
    firstName === null
    || lastName === null
    || address === null
    || city === null
    || email === null
  ) {
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
 
  let orderId = "";
  function postOrder() {
    let products = itemsPanier.map(i => i.id);
    console.log("tableau id produits", products);
    chargeUtile = {
      contact: contact,
      products: products,
    };
    console.log("charge utile:", chargeUtile)
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(chargeUtile)
    })
      .then((response) => {
        return response.json();
      })
      .then((server) => {
        orderId = server.orderId;
        console.log(orderId);
        if (orderId != "") {
          alert("Merci pour votre commande!")
          document.location.href = "confirmation.html?id=" + orderId;
        }
      })
  }
});




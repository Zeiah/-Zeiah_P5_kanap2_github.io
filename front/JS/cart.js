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

        let quantite = itemsPanier[i].quantiteKey;
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
  let itemsPanier = getPanier()

  let modifQuantity = document.querySelectorAll(".itemQuantity");// viser input de la quantite

  for (let i = 0; i < modifQuantity.length; i++) {
    modifQuantity[i].addEventListener("change", () => {
      let oldQuantite = itemsPanier[i].quantiteKey;
      console.log("1 old quantite", oldQuantite);
      let newQuantite = modifQuantity[i].value;
      console.log("2 new quantite", newQuantite);

      if (newQuantite > 100) {
        alert("Vous ne pouvez pas commander plus de 100 canapés pour chaque couleur");
      } else {
        //vérifier si la newQuantite est différente de la oldQuantite 
        const verifQuantite = itemsPanier.find((item) => item.newQuantite !== oldQuantite);
        verifQuantite.quantiteKey = newQuantite;
        itemsPanier[i].quantiteKey = verifQuantite.quantiteKey;

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


/************ Bon de commande *********************/

function commander() {
  const btnCommander = document.querySelector("#order");
  btnCommander.addEventListener("click", function(event) {
    event.preventDefault();

    //Récupérer dans un objet les données du formulaire
    const contact = {
      firstName: document.querySelector("#firstName").value,
      lastName: document.querySelector("#lastName").value,
      address: document.querySelector("#address").value,
      city: document.querySelector("#city").value,
      email: document.querySelector("#email").value
    };

    // Vérifier les données saisies dans les différents champs du formulaire
    function validationFirstName() {
      let masqueFirstName = new RegExp(/^[A-Za-z[\s]'\-.,]{2,31}$/i);
      if (masqueFirstName.test(contact.firstName)) {
        console.log("firstName ok");
        return true;
      } else {
        const firstNameError = document.querySelector("#firstNameErrorMsg");
        firstNameError.innerHTML = "Erreur dans votre nom: 2 lettres minimum";
      }
    };

    function validationLastName() {
      let masqueLastName = new RegExp(/^[A-Za-z[\s]'\-.,]{2,31}$/i);
      if (masqueLastName.test(contact.lastName)) {
        console.log("lastName ok");
        return true;
      } else {
        const lastNameError = document.querySelector("#lastNameErrorMsg");
        lastNameError.innerHTML = "Erreur dans votre prénom: 2 lettres minimum";
      }
    };

    function validationAddress() {
      let masqueAddress = new RegExp(/^[0-9]+[\s]?(bis|ter|quarter)?[\s]?[a-zA-ZÀ-ÖØ-öø-ÿ\s,'-]+$/i);
      if (masqueAddress.test(contact.address)) {
        console.log("address ok");
        return true;
      } else {
        const addressError = document.querySelector("#addressErrorMsg")
        addressError.innerHTML = "Merci de vérifier votre adresse : n° + nom de la voie";
      }
    };

    function validationCity() {
      let masqueCity = new RegExp(/^[0-9]{5}[\s]?[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/);
      if (masqueCity.test(contact.city)) {
        console.log("city ok");
        return true;
      } else {
        const cityError = document.querySelector("#cityErrorMsg");
        cityError.innerHTML = "Merci d'indiquez votre code postal et votre ville";
      }
    };

    function validationEmail() {
      let masqueEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i);
      if (masqueEmail.test(contact.email)) {
        console.log("email ok")
        return true;
      } else {
        const emailError = document.querySelector("#emailErrorMsg")
        emailError.innerHTML = "Merci de renseigner un email valide (monMail123@nomdedomaine.com)"; 
      }
    };

    // Validation du formulaire avant envoi
    function validationFormContact() {
    if (
      validationFirstName()
      && validationLastName()
      && validationAddress()
      && validationCity()
      && validationEmail()
    ) {
      console.log("formulaire ok")
      return true;
    } else {
      alert("Merci de vérifier le formulaire de contact")
    };
  };

    validationFormContact()



    // ajouter le panier à partir du LS
    // création de la charge utile au format JSON
    const chargeUtile = JSON.stringify(contact);
    // appel de la fonction Fetch, avec les infos nécessaires
    fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: chargeUtile,
    });

    // se diriger vers page order
    // effacer le local storage et vider le pannier : localStorage.clear()
  });
}

commander();
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

 function validationFirstName(firstName) {
  let masqueFirstName = new RegExp(/^[a-zA-Z '-.,]{1,31}$^/i);
  let validFirstName= masqueFirstName.test(firstName);
  if (!validFirstName) {
    return false;
  } else {
    return true;
  }
};

function validationLastName(lastName) {
  let masqueLastName = new RegExp(/^[a-zA-Z '-.,]{1,31}$^/i);
  let validLastName = masqueLastName.test(lastName);
  if (!validLastName) {
    return false;
  } else {
    return true;
  }
};

function validationAddress(address) {
  let masqueAddress = new RegExp(/^[0-9]+[\s]?(bis|ter|quarter)?[\s]?[a-zA-ZÀ-ÖØ-öø-ÿ\s,'-]+$/);
  let validAddress = masqueAddress.test(address);
  if (!validAddress) {
    return false;
  } else {
    return true;
  }
};

function validationCity(city) {
  let masqueCity = new RegExp(/^[0-9]{5}[\s]?[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/);
  let validCity = masqueCity.test(city);
  console.log(validCity);
  if (!validCity) {
    return false;
  } else {
    return true;
  }
};

function validationEmail(email) {
  let masqueEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i);
  let validEmail = masqueEmail.test(email);
  if (!validEmail) {
    return false;
  } else {
    return true;
  }
};

 //***************** commander***********

 // post le formulaire et le panier

 // function commander(){
  const btnCommander = document.querySelector("#order");
  btnCommander.addEventListener("click", function(event){
    event.preventDefault();

    // vérification du formulaire

    validationFirstName()
    if (validationFirstName()) {
      console.log("Prénom ok");
    } else {
      firstNameError.innerHTML = "Merci de vérifier votre nom";
      console.log("erreur nom")
    }

    validationLastName()
    if (validationLastName()) {
      console.log("Nom ok");
    } else {
      lastNameError.innerHTML = "Merci de vérifier votre prénom";
    }

    validationAddress()
    if (validationAddress()) {
      console.log("Adresse ok");
    } else {
      addressError.innerHTML = "Erreur! Merci d'indiquer le n° et le nom de la voie";
    }

    validationCity()
    if (validationCity()) {
      console.log("ville ok");
    } else {
      cityError.innerHTML = "Erreur! Merci d'indiquer votre code postal et votre ville";
    }

    validationEmail()
    if (validationEmail()) {
      console.log("Email ok");
    } else {
      emailError.innerHTML = "Merci de vérifier votre email (format: monMail@nomdedomaine.com)";
    }
  })


    /* if (
      (validationFirstName(firstName))
      && (validationLastName(lastName))
      && (validationAddress(address))
      && (validationCity(city))
      && (validationEmail(email))
    ) {
      form = {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value
      }
    } else {
      alert("Veuillez remplir le formulaire")
    }

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

/*// ajouter le panier à partir du LS
// création de la charge utile au format JSON
const chargeUtile = JSON.stringify(formulaireEtPanier);
// appel de la fonction Fetch, avec les infos nécessaires
let response = await fetch("http://localhost:3000/api/products", {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: chargeUtile,
});
let result = await response.json();
alert(result.message)
// message doit contenir id de commande dans url*/

  //});
/*




  


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
      let monPanier = itemsPanier.filter(p => p.id !== cartItemToDelete.dataset.id || p.couleurKey !== cartItemToDelete.dataset.couleur
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










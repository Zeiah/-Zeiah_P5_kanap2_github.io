/*pour indiquer la localisation, la page où on se trouve >> 
pour récupérer href et les données */
const str=window.location.href;

//instancier un nvl objet URL(window.location.href)
const url = new URL(str);
console.log(url);

//chercher l'id ds le lien url (après le ?)
let urlId = url.searchParams.get("id");
console.log(urlId);

//poser le lien pour chaque produit
let urlProduct='http://localhost:3000/api/products/'+ urlId;
console.log(urlProduct);

fetch(urlProduct)
    .then(res => {
        if (res.ok) {
            console.log(res);
            res.json() .then(data => {
                let image = document.createElement("img");
                document.querySelector('.item__img').appendChild(image);
                image.src=data.imageUrl;
                document.querySelector('#title').textContent=data.name;
                document.querySelector('#price').textContent=data.price;
                document.querySelector('#description').textContent=data.description;
                
                //pour les valeurs couleur dans tableau colors
                let couleur=document.querySelector('#colors');
                for (let i=0; i<data.colors.length; i++){
                    couleur.innerHTML+=`<option value="${data.colors[i]}">${data.colors[i]}</option>`;       
                }   // reprendre : celui qui est entre les deux balises est ce que voit l'utilisateur
                    // nous, on récupère la 1ere
                console.log(data)

                //nommer la page avec le nom du produit
                document.title = data.name;
            })
        }
        else {
            console.log("erreur de communication avec l'API");
            alert("problème de communication");
        }
 
    }).catch(error=>{
            console.log("récupération de l'erreur", error)
    });

    /*fonction bouton: événement (click) pour ajouter sélection ds le pannier 
    >> condition : indiquer quantité et couleur*/
    const btnAddSelectionItem = document.querySelector("#addToCart");
    btnAddSelectionItem.addEventListener("click", function() {
        
        let quantite = parseInt(document.querySelector("#quantity").value);
        // parseInt: Analyser un chaine de caractères fournie en argument, ce qui est récupéré est un nbre entier
        //récupérer un nombre de item (le nombre doit être un entier)

        let couleur = document.querySelector("#colors").value;
        
        //créer un objet (la selection) avec 3 propriétés, décrites par 3 paires de clef/valeur 
        let selectionItem = {
            id: urlId,
            quantiteKey: quantite,
            couleurKey: couleur
        }
        console.log(selectionItem); //dans console: retourner un objet, la selection
        
        // la quantite doit etre inférieure ou égale à 100
        if(quantite<=100) {
            selectionner(selectionItem);// instruction de prendre ici methode définie et utilisée plus bas
            console.log("nombre d'items:" + typeof quantite); // afficher le type number de la variable quantite
        } 
        
        else{
            alert("Vous ne pouvez pas choisir plus de 100 items pour chaque canapé");
            //console.log("nombre d'items supérieur à 100");
        };
    })


    //fonction qui sélectionne au moins 1 item, avec une couleur définie, afin de l'ajouter dans le panier 
    function selectionner(selectionItem) {
        if (selectionItem.quantiteKey ===0 || selectionItem.couleurKey ==="") {
            alert("Veuillez choisir une couleur et un nombre d'articles");
            console.log("quantité :", selectionItem.quantiteKey);
            console.log("couleur non spécifiée", selectionItem.couleurKey)
            console.log("1");
        }
        else {
            console.log("2")
            let monPanier=JSON.parse(localStorage.getItem('monPanier')); 
            // récupérer ce qui a déjà été sélectionné dans le panier (localStorage) - les éléments du tableau monPanier                
            
            if (monPanier===null){
                monPanier=[];
                console.log("3")
            };
            //si le panier est vide, instancier un tableau pr ajouter la sélection telle quelle 

            let _selectionItem = monPanier.find (p => p.id===selectionItem.id && p.couleurKey===selectionItem.couleurKey);
            // le tiret devant la variable est destiné à un usage interne à la fonction ou à la classe
            // retrouver dans le panier un élément p qui a la mm id et la mm couleur que sélection
            // cet élément antérieur = _selectionItem?
            //ici comparaison des key MAIS ce sont des valeurs qui sont stockées ds un array
            
            // s'il y a un panier = variable _selectionItem = vrai
            if (_selectionItem) {
                console.log("4")
               let totalQuantite = (selectionItem.quantiteKey + _selectionItem.quantiteKey);
               console.log("5")
            //si selection antérieure de mm produit avec mm couleur, alors lui ajouter nouvelle selection (addition) 
            // MAIS la quantité ne doit pas dépasser 100, on la réajuste à 100 
            //ici addition par les key
                
                if (totalQuantite > 100) {
                    console.log("6")
                    _selectionItem.quantiteKey === _selectionItem.quantiteKey ;
                    alert("Commande limitée à 100 articles pour chaque couleur, merci de vérifier votre panier et d'ajuster le nombre d'articles")
                    console.log("7")
                }
                else {
                    console.log("8")
                    _selectionItem.quantiteKey += selectionItem.quantiteKey;
                    console.log("9")
                    alert("La quantité a été modifiée. Vous avez" + _selectionItem.quantiteKey + "de couleur" + _selectionItem.couleurKey);
                }
            }
            // si la quantité ne dépasse pas 100 items, alors ajouter la selection au panier
            else {
                console.log("10")
                monPanier.push (selectionItem);
                alert("Produit ajouté au panier");
                //console.log("produit ajouté dans panier");
            }

            // stocker le (nvx) panier dans le localStorage
        localStorage.setItem("monPanier", JSON.stringify(monPanier));
        console.log("envoi panier dans localStorage")

        //localStorage.clear ();
        } 

    };

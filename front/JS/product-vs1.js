//searchParams

//pour indiquer la localisation (window.location est une fonction), dans la page où je suis >> récupérer href, récuperer données 
const str=window.location.href;

//instancier un nvl objet
const url = new URL(str);
console.log(url);

//chercher l'id ds le lien url (après?)
let urlId = url.searchParams.get("id");
console.log(urlId);

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
                //pour les trois valeurs couleur dans tableau colors
                let couleur=document.querySelector('#colors');
                for (let i=0; i<data.colors.length; i++){
                    couleur.innerHTML+=`<option value="${data.colors[i]}">${data.colors[i]}</option>`;       
                }   
                console.log(data)
            })
        }
        else {
            console.log("erreur de communication avec l'API");
            alert("problème de communication avec l'API");
        }
 
    }).catch(error=>{
            console.log("récupération de l'erreur", error)
    });

    // ajouter ds le pannier déclarer constante bouton,
    const boutonPanier = document.querySelector("#addToCart");
    boutonPanier.addEventListener("click", function() {
        let quantite = parseInt(document.querySelector("#quantity").value);
        // ce qui est récupéré est un nbre entier
        let couleur = document.querySelector("#colors").value;
        let produitDansPanier = {
            id: urlId,
            quantity: quantite,
            colors: couleur,
        }
        console.log(produitDansPanier);
        //dans console: retourner un objet
        if(quantite<100) {
            ajouterDansPanier(produitDansPanier);
            console.log("blabla" + typeof quantite);
        } // reprendre ici la methode utilisée plus bas
        else{
            alert("Vous ne pouvez pas choisir plus de 100 articles pour chaque canapé");
        }
    })

    function ajouterDansPanier(produitDansPanier) {
        if (produitDansPanier.quantity===0 || produitDansPanier.colors==="") {
            alert("Veuillez sélectionner une couleur et une quantité")
        }
        else {
            let notrePanier=JSON.parse(localStorage.getItem('notrePanier'));
            if (notrePanier===null){
                notrePanier=[];
            };
        let _produitDansPanier= notrePanier.find (p => p.id===produitDansPanier.id && p.colors===produitDansPanier.couleur);// le tiret devant variable est destiné à un usage interne à la fonction ou à la classe
        if (_produitDansPanier)
        {
            _produitDansPanier.quantity+= produitDansPanier.quantite;
            if (_produitDansPanier.quantity > 100) {
                _produitDansPanier.quantity=100 ;
                alert("Commande limitée à 100 items, merci de vérifier votre panier et d'ajuster la quantité dans votre panier")
            }
            else {
                alert("La quantité a été modifiée");
            }
        }
        else {
            notrePanier.push (produitDansPanier);
            alert("produit ajouté au panier");
        }
        localStorage.setItem("notrePanier", JSON.stringify(notrePanier));
    } 

    };

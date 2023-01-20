/* essai insertion produit dans page accueil > pas de manière dynamique

// Récupération des produits depuis le fichier JSON
const reponse = await fetch('product.js');
const produits = await reponse.js();

const article = products[0];

//const idElement= document.createElement("a"); idElement.href = products._id

const imageUrlElement = document.createElement("img");
imageUrlElement.src = products.imageUrl;

const altTxtElement = document.createElement("alt");
altTxtElement.innerText = products.altTxt;

const nameElement = document.createElement("h3");
nameElement.innerText= products.name;

const descriptionElement = document.createElement("p");
descriptionElement.innerText= products.description;

const sectionItems = document.querySelector("#items");
//sectionItems.appendChild(idElement);
sectionItems.appendChild(imageUrlElement);
sectionItems.appendChild(altTxtElement);
sectionItems.appendChild(nameElement);
sectionItems.appendChild(descriptionElement);
*/

//tentative affichage des produits de manière dynamique via API
/*
class ProductItems {
    constructor (productImageUrl, productAltTxt, productName, productDescription) {
        this.productImageUrl = productImageUrl;
        this.productAltTxt = productAltTxt;
        this.productName = productName;
        this.productDescription=productDescription;
    }
}
document.querySelector('#items'){ 
    fetch(url)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
        let affichage = '<section>';
        for (let product of products){
            let affichage = new ProductItems();
            console.log(ProductItems);
        }
    });
}*/




//récupérer les données sur json via api : meth fetch
const url='http://localhost:3000/api/products';

fetch(url)
    .then(res => {
        if (res.ok) {
            console.log(res);
            res.json() .then(data => {
                for (let i=0; i<data.length; i++) {

/* suivant modele html, créer le lien <a>
        <a href="./product.html?id=42">
            <article>
              <img src=".../product01.jpg" alt="Lorem ipsum dolor sit amet, Kanap name1">
              <h3 class="productName">Kanap name1</h3>
              <p class="productDescription">Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis enim malesuada risus sapien gravida nulla nisl arcu.</p>
            </article>
        </a> -->*/
                    let lien = document.createElement("a");
                    document.querySelector('#items').appendChild(lien);
                    lien.href=`./product.html?id=${data[i]._id}`
                    
                    //créer l'enfant article, le relier au parent lien
                    let article = document.createElement("article");
                    lien.appendChild(article);

                    // créer les enfants de article - les relier au parent article
                    let image = document.createElement("img");
                    article.appendChild(image);
                    image.src=data[i].imageUrl;

                    let titre = document.createElement("h3");
                    article.appendChild(titre);
                    titre.className = "productName";
                    titre.textContent = data[i].name;

                    let description = document.createElement("p");
                    article.appendChild(description);
                    description.className = "productDescription";
                    description.textContent = data[i].description;
                }
            })
        }
        
        else {
            console.log("erreur de communication avec l'API");
            alert("Problème de communication");
        }
 
    }).catch(error=>{
            console.log("récupération de l'erreur", error)
    })




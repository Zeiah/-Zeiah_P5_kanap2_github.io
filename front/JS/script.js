//récupérer les datas sur products.json via l'API : méthode fetch
const url='http://localhost:3000/api/products';

fetch(url)
    .then(response => {
        if (response.ok) {
            console.log(response);
            response.json() .then(data => {
                
/* *** Boucle qui insère les éléments du DOM suivant le modèle du code source html *****/
                for (let i=0; i<data.length; i++) {

                //créer le lien <a> en utilisant l'id de chaque produit 
                    let lien = document.createElement("a");
                    document.querySelector('#items').appendChild(lien);
                    lien.href=`./product.html?id=${data[i]._id}`
                    
                //créer l'enfant <article>, le relier au parent <lien>
                    let article = document.createElement("article");
                    lien.appendChild(article);

                // créer les enfants de <article>
                    const img = document.createElement("img");
                    article.appendChild(img);
                    img.src=data[i].imageUrl;
                    img.alt=data[i].altTxt;
                
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
        } else {
            console.log("erreur de communication avec l'API");
            alert("Erreur de communication avec le serveur");
        }
 
    }).catch(error=>{
            console.log("Récupération de l'erreur:", error);
    })




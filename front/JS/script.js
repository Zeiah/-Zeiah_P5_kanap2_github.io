/***************** AFFICHAGE DES ELEMENTS ***************
* récupérer les datas sur l'API (méthode fetch)
* créer un lien vers la page de chaque produit
* affichage des éléments 
********************************************************/

const url='http://localhost:3000/api/products';

fetch(url)
    .then(response => {
        if (response.ok) {
            console.log(response);
            response.json() .then(data => {
                for (let i=0; i<data.length; i++) {
                    const lien = document.createElement("a");
                    document.querySelector('#items').appendChild(lien);
                    lien.href=`./product.html?id=${data[i]._id}`
                    
                    const article = document.createElement("article");
                    lien.appendChild(article);

                    const img = document.createElement("img");
                    article.appendChild(img);
                    img.src=data[i].imageUrl;
                    img.alt=data[i].altTxt;
                
                    const titre = document.createElement("h3");
                    article.appendChild(titre);
                    titre.className = "productName";
                    titre.textContent = data[i].name;

                    const description = document.createElement("p");
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




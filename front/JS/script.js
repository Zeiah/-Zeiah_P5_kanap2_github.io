//récupérer les données sur json via api : meth fetch
const url='http://localhost:3000/api/products';

fetch(url)
    .then(response => {
        if (response.ok) {
            console.log(response);
            response.json() .then(data => {
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
        }
        
        else {
            console.log("erreur de communication avec l'API");
            alert("Erreur de communication avec le serveur");
        }
 
    }).catch(error=>{
            console.log("récupération de l'erreur", error)
    })




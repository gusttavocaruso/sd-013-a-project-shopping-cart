
const getProducts = () => {
  return new Promise((resolve, reject) => {
   fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then((response) => { 
        response.json().then((jsonProduct) => { 
            jsonProduct.results.forEach((element) => {
              const product = createProductItemElement(element);
              const bigSection = document.querySelector('.items')
              bigSection.appendChild(product);
              resolve()
            })
        });
      })
  });
};


function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', addToCart);
 
  return section;
}

function addToCart (event) { // Adicionar ao carrinho
  const section = event.target.parentElement;
  idProduct = getSkuFromProductItem(section);
    return new Promise((resolve, reject) => {
      fetch(`https://api.mercadolibre.com/items/${idProduct}`)
        .then((response) => response.json()
          .then((jsonProduct) => { 
            let li = createCartItemElement(jsonProduct)
            document.querySelector('.cart__items').appendChild(li);
            resolve();
          }));
    })
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const ol = event.target.parentElement;
  ol.removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) { 
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = () => {
  getProducts()
};




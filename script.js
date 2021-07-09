// const fetch = require('node-fetch');
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) { // Cria os Elementos
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
function cartItemClickListener() {
 
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;  
}

// req 2 Ajuda do Rogérinho P da Silva
const add = (valueID) => { 
  fetch(`https://api.mercadolibre.com/items/${valueID}`)
  .then((response) => {
   response.json()
    .then((data) => {
    const returnLi = createCartItemElement(data);
      
   const ol = document.querySelector('.cart__items');
   ol.appendChild(returnLi);
    });
  });
};

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const sessao = document.querySelector('.items');

  const addCarts = section.querySelector('.item__add');
  addCarts.addEventListener('click', (event) => {
    const productId = event.target.parentElement;
    const iD = productId.querySelector('.item__sku').innerText;
    add(iD);
  });

  sessao.appendChild(section);
  return section;  
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// req 1
const getComputer = (url) => {
  fetch(url)
  .then((response) => response.json())
    .then((data) => (data.results))
      .then((pc) => pc.forEach((element) => {
         createProductItemElement(element);
  }));
};

window.onload = () => { 
  getComputer('https://api.mercadolibre.com/sites/MLB/search?q=computador');
};

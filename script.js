window.onload = () => { 
  getProducts("https://api.mercadolibre.com/sites/MLB/search?q=computador");
};

// const fetch = require('node-fetch');

const getProducts = (url) => {
  const mlPromise = new Promise((resolve, reject) => {
      fetch("https://api.mercadolibre.com/sites/MLB/search?q=computador")
        .then((r) => r.json())
        .then((data) => (data.results))
        .then((results) => results.forEach ((element)=> (createProductItemElement(element))))
        resolve()
  });
}

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

  section.appendChild(createCustomElement('span', 'item__id', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const items = document.querySelector('.items')
  items.appendChild(section)
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {

}


function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}



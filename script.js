// const fetch = require('node-fetch');

// Requisito 1: Resolvido com ajuda de Lanai conceição, Caroline Boaventura, Luiza Antiques, Aline Hoshino, Pedro Delicoli
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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const createProductList = async () => {
  const api = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const apiJson = await api.json();
  // console.log(apiJson);
  const arrayResultsJson = apiJson.results;
  arrayResultsJson.forEach((product) => 
  document.querySelector('.items').appendChild(createProductItemElement(product)));
};

// Parte de Quesito 2:
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Quesito 3: Resolvido com ajuja de Luiza Antiques
function cartItemClickListener(event) {
  event.target.remove();
}

// Requisito 2: Resolvido com ajuda de Lanai conceição, Caroline Boaventura, Luiza Antiques, Aline Hoshino, Pedro Delicoli
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getCartComputer = async (id) => {
  const api = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const apiJson = await api.json();
  // console.log(apiJson);
  return apiJson;
};

const buttonEvent = () => {
  const parent = document.querySelector('.items');
  parent.addEventListener('click', async (event) => {
    if (event.target.className === 'item__add') {
      const btnParent = event.target.parentElement;
      const btnId = getSkuFromProductItem(btnParent);
      const btnData = await getCartComputer(btnId);
      const computer = createCartItemElement(btnData);
      document.querySelector('.cart__items').appendChild(computer);
    }
  });
};

window.onload = () => {
  createProductList();
  buttonEvent();
};
// const fetch = require('node-fetch');

const localStorageData = [];

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

const removeCartItemFromLocalSorage = (data) => {
  const index = localStorageData.indexOf(data);
  localStorageData.splice(index, 1);
  localStorage.setItem('cartList', '');
  localStorage.setItem('cartList', JSON.stringify(localStorageData));
};

// Quesito 3: Resolvido com ajuja de Luiza Antiques
function cartItemClickListener(event) {
  const id = event.target.getAttribute('data-id');
  event.target.remove();
  removeCartItemFromLocalSorage(id);
  console.log(localStorageData);
}

// Requisito 2: Resolvido com ajuda de Lanai conceição, Caroline Boaventura, Luiza Antiques, Aline Hoshino, Pedro Delicoli
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.setAttribute('data-id', sku)
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

// const buttonEvent = () => {
//   const parent = document.querySelector('.items');
//   parent.addEventListener('click', async (event) => {
//     if (event.target.className === 'item__add') {
//       const btnParent = event.target.parentElement;
//       const btnId = getSkuFromProductItem(btnParent);
//       const btnData = await getCartComputer(btnId);
//       const computer = createCartItemElement(btnData);
//       document.querySelector('.cart__items').appendChild(computer);
//     }
//   });
// };

//Quesito 3
const addCartItemToLocalSorage = (data) => {
  localStorage.setItem('cartList', '');
  localStorage.setItem('cartList', JSON.stringify(localStorageData));
};

// Requisito 2: Resolvido com ajuda de Lanai conceição, Caroline Boaventura, Luiza Antiques, Aline Hoshino, Pedro Delicoli
const buttonEvent = () => {
  const parent = document.querySelector('.items');
  parent.addEventListener('click', async (event) => {
    if (event.target.className === 'item__add') {
      const btnParent = event.target.parentElement;
      const btnId = getSkuFromProductItem(btnParent);
      const btnData = await getCartComputer(btnId);
      const computer = createCartItemElement(btnData);
      document.querySelector('.cart__items').appendChild(computer);
      localStorageData.push(btnId);
      console.log(localStorageData);
      addCartItemToLocalSorage(localStorageData);
    }
  });
};

const getCartFromLocalSorage = () => {
  const list = JSON.parse(localStorage.getItem('cartList'));
  if (list) {
    list.forEach(async (id) => {
      const btnData = await getCartComputer(id);
      const computer = createCartItemElement(btnData);
      document.querySelector('.cart__items').appendChild(computer);
    });
  }
};

window.onload = () => {
  createProductList();
  buttonEvent();
  getCartFromLocalSorage();
};
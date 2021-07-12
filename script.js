// const fetch = require('node-fetch');

const localStorageData = [];
// let pricesArray = [];
const cartContainer = '.cart__items';

// Quesito 5 Resolvido com ajuda de Aline Hoshino
const addPrices = () => {
  const priceContainer = document.querySelector('.total-price');
  let totalValue = 0;
  const cartList = document.querySelectorAll('.cart__item');
  // console.log(cartList);
  if (cartList.length >= 1) {
    cartList.forEach((item) => {
      const text = item.innerText;
      const itemArray = text.split('$');
      const itemPrice = itemArray[1];
      const priceToNumber = Math.round(itemPrice * 100) / 100;
      totalValue += priceToNumber;
      totalValue = Math.round(totalValue * 100) / 100;
    });
  }
  priceContainer.innerText = totalValue;
};

// Requisito 1: Resolvido com ajuda de Lanai conceição, Caroline Boaventura, Luiza Antiques, Aline Hoshino, Pedro Delicoli
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// Requisito 1: continuação
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// Requisito 1: continuação
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// Requisito 1: continuação e Quesito 7
const createProductList = async () => {
  const loadingContainer = document.querySelector('.loading');
  loadingContainer.innerHTML = 'loading...';
  const api = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const apiJson = await api.json();
  // console.log(apiJson);
  const arrayResultsJson = apiJson.results;
  loadingContainer.remove();
  arrayResultsJson.forEach((product) => 
  document.querySelector('.items').appendChild(createProductItemElement(product)));
};

// Parte de Quesito 2:
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Quesito 4:
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
  addPrices();
}

// Requisito 2: Resolvido com ajuda de Lanai conceição, Caroline Boaventura, Luiza Antiques, Aline Hoshino, Pedro Delicoli
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.setAttribute('data-id', sku);
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  // pricesArray.push(salePrice);
  // console.log(pricesArray);
  // const total = await totalPrice();
  // console.log(total);
  return li;
}

// Quesito 2
const getCartComputer = async (id) => {
  const api = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const apiJson = await api.json();
  // console.log(apiJson);
  return apiJson;
};

// Quesito 4
const addCartItemToLocalSorage = () => {
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
      document.querySelector(cartContainer).appendChild(computer);
      localStorageData.push(btnId);
      addCartItemToLocalSorage();
      addPrices();
    }
  });
};

// Quesito 4
const getCartFromLocalSorage = () => {
  const list = JSON.parse(localStorage.getItem('cartList'));
  if (list) {
    list.forEach(async (id) => {
      const btnData = await getCartComputer(id);
      const computer = createCartItemElement(btnData);
      document.querySelector(cartContainer).appendChild(computer);
      addPrices();
    });
  }
};

// Quesito 6:
const clearCartList = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    const container = document.querySelector(cartContainer);
    container.innerHTML = '';
    localStorage.setItem('cartList', '');
    addPrices();
  });
};

window.onload = async () => {
  createProductList();
  buttonEvent();
  getCartFromLocalSorage();
  clearCartList();
};

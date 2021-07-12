// const fetch = require('node-fetch');
const cart = '.cart__items';

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
  const loading = document.querySelector('.loading');
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  const section = document.querySelector('.items');
  const objList = await fetch(url)
    .then((response) => response.json())
    .then((data) => data.results);
  loading.remove();
  objList.forEach((computer) => {
    section.appendChild(createProductItemElement(computer));
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function totalPrice() {
  const span = document.querySelector('.total-price');
  const allLi = document.querySelectorAll('li');
  let price = 0;
  allLi.forEach((item) => {
    const computer = item.innerText.split('$');
    price += Number(computer[1]);
    });
  span.innerHTML = `${Math.round(price * 100) / 100}`;
  localStorage.setItem('totalPrice', span.innerHTML);
}

function cartItemClickListener(event) {
  event.target.remove();
  localStorage.setItem('cartItems', document.querySelector(cart).innerHTML);
  totalPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addProductToCart = (obj) => {
  const myCart = document.querySelector(cart);
  const newLi = createCartItemElement(obj);
  myCart.appendChild(newLi);
};

const addEventButtons = () => {
  const section = document.querySelector('.items');
  section.addEventListener('click', async (event) => {
    if (event.target.className === 'item__add') {
      const parentSection = event.target.parentElement;
      const itemId = getSkuFromProductItem(parentSection);
      const obj = await fetch(`https://api.mercadolibre.com/items/${itemId}`)
        .then((response) => response.json());
      addProductToCart(obj);
      localStorage.setItem('cartItems', document.querySelector(cart).innerHTML);
      totalPrice();
    }
  });
};

function getLocalStorage() {
  const myCart = document.querySelector(cart);
  myCart.innerHTML = localStorage.getItem('cartItems');
  myCart.addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') {
      cartItemClickListener(event);
    }
  });
}

function getTotalPrice() {
  const span = document.querySelector('.total-price');
  span.innerHTML = localStorage.getItem('totalPrice');
}

const cleanCart = () => {
  const buttonClean = document.querySelector('.empty-cart');
  buttonClean.addEventListener('click', () => {
    const ol = document.querySelector(cart);
    while (ol.firstChild) {
      ol.removeChild(ol.firstChild);
      totalPrice();
      localStorage.setItem('cartItems', ol.innerHTML);
    }
  });
};

window.onload = () => {
  createProductList();
  addEventButtons();
  getLocalStorage();
  getTotalPrice();
  cleanCart();
};

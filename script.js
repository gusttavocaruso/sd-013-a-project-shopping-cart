const apiMainUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const apiItemUrl = 'https://api.mercadolibre.com/items/';
const CART_ITEMS = '.cart__items';

function atualizaPreco() {
  const totalPrice = document.querySelector('.total-price');
  const regex = /(([0-9])\.?([0-9]{0, 2})?)+/g;
  const item = document.querySelectorAll('.cart__item');

  if (item) {
    let sum = 0;
    Array.from(item).forEach((el) => {
      const match = el.innerText.match(regex);
      sum += parseFloat(match[match.length - 1]);
    });
    totalPrice.innerText = parseFloat(sum) === 0 ? '0' : parseFloat(sum).toFixed(2);
  } else {
    totalPrice.innerText = '0';
  }
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function addItemsToLocalStorage(item) {
  let products = [];
  if (localStorage.getItem('products')) {
    products = JSON.parse(localStorage.getItem('products'));
  }
  products.push(item);
  localStorage.setItem('products', JSON.stringify(products));
}

function removeItemsFromLocalStorage(item = 'all') {
  if (!item === 'all') {
    const storageProducts = JSON.parse(localStorage.getItem('products'));
    const products = storageProducts.filter((text) => text !== item);
    localStorage.setItem('products', JSON.stringify(products));
  }
  localStorage.clear();
}

function cartItemClickListener(event) {
  const el = event.target;
  const cartItems = document.querySelector(CART_ITEMS);
  cartItems.removeChild(el);
  removeItemsFromLocalStorage(el.innerText);
  atualizaPreco();
}

function getItemsFromLocalStorage() {
  const cartItems = document.querySelector(CART_ITEMS);
  const products = JSON.parse(localStorage.getItem('products'));
  products.forEach((item) => {
    const li = document.createElement('li');
    li.innerText = item;
    li.className = 'cart__item';
    cartItems.appendChild(li);
    li.addEventListener('click', cartItemClickListener);
  });
  atualizaPreco();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addOrRemoveLoadingText() {
  const cartContainer = document.querySelector('.cart');
  if (document.querySelector('.loading')) {
    cartContainer.removeChild(cartContainer.lastElementChild);
    return;
  }
  const paragraph = document.createElement('p');
  paragraph.className = 'loading';
  paragraph.innerText = 'loading...';
  cartContainer.appendChild(paragraph);
}

async function results(url, query) {
  addOrRemoveLoadingText();
  const response = await fetch(`${url}${query}`);
  const data = await response.json();
  addOrRemoveLoadingText();
  return data;
}

function addToCart(e) {
  const cartItems = document.querySelector(CART_ITEMS);
  const el = e.target;
  const id = getSkuFromProductItem(el.parentElement);
  results(apiItemUrl, id)
    .then((data) => {
      cartItems.appendChild(createCartItemElement(data));
      const { id: sku, title: name, price: salePrice } = data;
      addItemsToLocalStorage(`SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`);
      atualizaPreco();
    });
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (className === 'item__add') e.addEventListener('click', addToCart);
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

async function getProducts(url, query) {
  const items = document.querySelector('.items');
  const data = await results(url, query);
  data.results.forEach((item) => {
    items.appendChild(createProductItemElement(item));
  });
}

function clearCart() {
  const cartItems = document.querySelector(CART_ITEMS);
  while (cartItems.childElementCount > 0) {
    cartItems.removeChild(cartItems.firstElementChild);
  }
  removeItemsFromLocalStorage('all');
  atualizaPreco();
}

window.onload = () => { 
  getProducts(apiMainUrl, 'Computador');
  if (localStorage.length > 0) getItemsFromLocalStorage();
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', clearCart);
};
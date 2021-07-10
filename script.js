const cartItems = () => document.querySelector('.cart__items');
const arrayItems = () => document.querySelectorAll(('.cart__item'));
const clearButton = () => document.querySelector('.empty-cart');
const itemsField = () => document.querySelector('.items');
const loadingItem = () => document.querySelector('.loading');

const objectFetch = {
  method: 'GET',
  headers: { Accept: 'application/json' },
};

const nowLoading = () => {
  const createDiv = document.createElement('div');
  createDiv.classList.add('loading');
  createDiv.innerHTML = 'loading...';
  itemsField().appendChild(createDiv); 
};

const removeLoading = () => {
  itemsField().removeChild(loadingItem());
};

const fetchItemAPI = async (id) => {
  nowLoading();
  const API_URL_ITEM = `https://api.mercadolibre.com/items/${id}`;
  return fetch(API_URL_ITEM, objectFetch)
    .then((response) => {
      removeLoading();
      return response.json();    
    });
};

const totalPrice = () => {
  let totalPrices = 0;
  const priceField = document.querySelector('.total-price');
  priceField.innerHTML = 0;
  arrayItems().forEach((item) => {
    const getId = item.querySelector('span').id;
    fetchItemAPI(getId)
      .then((data) => {
        totalPrices += data.price;
        priceField.innerHTML = Math.round(totalPrices * 100) / 100;
      });
  });
};

const updateStorage = () => {
  localStorage.clear();
  localStorage.setItem('cart', cartItems().innerHTML);
  totalPrice();
};

const clearCart = () => {
  cartItems().innerHTML = '';
  updateStorage();
};

function cartItemClickListener({ target }) {
  cartItems().removeChild(target);
  updateStorage();
}

const verifyStorage = () => {
  if (localStorage.getItem('cart')) {
    cartItems().innerHTML = localStorage.getItem('cart');
    arrayItems().forEach((item) => item.addEventListener('click', cartItemClickListener));
  }
  totalPrice();
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerHTML = `SKU: <span id="${sku}">${sku}</span> | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  
  cartItems().appendChild(li);
  updateStorage();
}

const fetchItem = ({ target }) => {
  fetchItemAPI(target.id)
    .then((data) => createCartItemElement(data));
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createProductItemElement({ id, title, thumbnail }) {
  const sectionItems = document.querySelector('.items');
  const section = document.createElement('section');
  const addButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addButton.id = id;
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(addButton);
  addButton.addEventListener('click', fetchItem);

  sectionItems.appendChild(section);
}

const fetchProduct = (query) => {
  nowLoading();
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  fetch(API_URL, objectFetch)
    .then((response) => response.json()
    .then((data) => data.results
      .forEach((item) => createProductItemElement(item))))
      .then(() => removeLoading());
};
/*
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
*/
window.onload = () => {
  fetchProduct('computador');
  verifyStorage();
  clearButton().addEventListener('click', clearCart);
};

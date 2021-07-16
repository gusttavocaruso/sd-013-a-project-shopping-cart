const itemsSection = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
const clearCart = document.querySelector('.empty-cart');
const loadingMessage = document.querySelector('.loading');

const fetchComputers = () => {
  loadingMessage.innerText = 'loading';
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => {
      loadingMessage.remove();
      return data.results;
    }); // retorno disso é um array
};

const fetchItemById = (itemID) => (
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then((response) => response.json())
);

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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const saveCartItemsEditions = () => {
  localStorage.setItem('cartItems', cartItems.innerHTML);
};

const subtractTotalPrice = ({ price }) => {
  const latestPrice = parseFloat(totalPrice.innerText);
  totalPrice.innerText = (latestPrice - price);
};

function cartItemClickListener(event) {
  if (event.target.classList.contains('cart__item')) {
    const liContent = event.target.innerText;
    const liId = liContent.slice(5, 18);
    fetchItemById(liId)
      .then((object) => subtractTotalPrice(object));
    event.target.remove();
    saveCartItemsEditions();
  }
}

const loadCartItems = () => {
  cartItems.innerHTML = localStorage.getItem('cartItems');
};

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  // const formatedPrice = price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

const sumTotalPrice = ({ price }) => { 
  const latestPrice = parseFloat(totalPrice.innerText);
  totalPrice.innerText = (latestPrice + price);
};

const addItemToCart = (event) => {
  if (event.target.classList.contains('item__add')) {
    // const id = event.target.parentElement.firstElementChild.textContent;
    const id = getSkuFromProductItem(event.target.parentElement);
    fetchItemById(id)
      .then((object) => {
        cartItems.appendChild(createCartItemElement(object));
        sumTotalPrice(object);
        saveCartItemsEditions();
      });
  }
};

const createItems = (section) => {
  fetchComputers()
    .then((arrayOfItems) => arrayOfItems
      .forEach((item) => section.appendChild(createProductItemElement(item))))
    .catch((error) => console.log(error));
};

const clearCartItems = () => {
  cartItems.innerHTML = '';
  saveCartItemsEditions();
  totalPrice.innerText = '0,00';
};

const listenersHandler = () => {
  document.addEventListener('click', addItemToCart);
  document.addEventListener('click', cartItemClickListener);
  clearCart.addEventListener('click', clearCartItems);
};

window.onload = () => { 
  listenersHandler();
  createItems(itemsSection);
  loadCartItems();
};
// const fetch = require('node-fetch');

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const cartItems = document.getElementsByTagName('ol')[0];
  const totalPrice = Number(document.querySelector('section p').innerHTML);
  const subPrice = Number(event.target.innerText.split('$')[1]);
  document.querySelector('section p').innerHTML = (totalPrice - subPrice).toFixed(1);
  event.target.remove();
  localStorage.setItem('cartItems', cartItems.innerHTML);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// ====================== Aux functions ==========================================

// Aux reset li event listeners

const liReset = () => {
  const list = document.querySelectorAll('ol li');
  list.forEach(((li) => {
    li.addEventListener('click', cartItemClickListener);
  }));
};

// Aux create product list
const createItems = (results) => {
  results.forEach((product) => {
    const items = document.querySelector('.items');
    const item = createProductItemElement(product);
    items.appendChild(item);
  });
};

// Aux create localStorage for cart items
const setItemsToLocalStorage = (items) => {
  // const cartItemsLi = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cartItems', items);
};

// Aux get cart items from localStorage
const getItemsFromLocalStorage = () => {
  const cartItems = document.getElementsByTagName('ol')[0];
  cartItems.innerHTML = localStorage.getItem('cartItems');
};

// Aux empty cart
const emptyCart = () => {
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', () => {
    const cartItems = document.querySelector('.cart__items');
    cartItems.innerHTML = '';
    localStorage.removeItem('cartItems');
  });
};

// Aux get total price from cart items
const getTotalPrice = ({ price }) => {
  const totalPrice = document.querySelector('.total-price').firstElementChild;

  totalPrice.innerHTML = (Number(totalPrice.innerHTML) + price);
};

const setTotalPrice = () => {
  const cart = document.querySelector('.cart');
  const total = document.createElement('section');
  const totalPrice = document.createElement('p');

  total.className = 'total-price';
  totalPrice.innerHTML = 0;

  total.appendChild(totalPrice);
  cart.appendChild(total);
};

// Aux create addEventListener to buttons and saves to localStorage
const buttonEventListener = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((element) => {
    element.addEventListener(('click'), (event) => {
      const item = event.target.parentNode;
      const itemId = getSkuFromProductItem(item);
      fetch(`https://api.mercadolibre.com/items/${itemId}`)
        .then((response) => response.json()
          .then((data) => {
            const cartItems = document.querySelector('.cart__items');
            const cartItem = createCartItemElement(data);
            cartItems.appendChild(cartItem);
            getTotalPrice(data);
            setItemsToLocalStorage(cartItems.innerHTML);
          }));
    });
  });
};

const getProductList = () => fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((data) => data.results)
  .catch((error) => console.log(error));

window.onload = async () => {
  const results = await getProductList();
  createItems(results);
  getItemsFromLocalStorage();
  buttonEventListener();
  setTotalPrice();
  emptyCart();
  liReset();
};

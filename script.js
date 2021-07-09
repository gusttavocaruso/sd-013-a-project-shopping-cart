const cartContainer = document.querySelector('.carrinho');
const cartVal = () => document.querySelector('.total-price');

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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function cartItemClickListener(event) {
  const item = event.target.innerHTML.split(' ');
  const value = item[item.length - 1].replace('$', '');
  const newVal = parseFloat(cartVal().innerHTML) - parseFloat(value);
  cartVal().innerHTML = Math.round(newVal * 100) / 100;
  event.target.remove();
  localStorage.cart = cartContainer.innerHTML;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Req 6
const cleanCart = () => {
  document.querySelector('.cart__items').innerHTML = null;
  cartVal().innerHTML = '0';
  localStorage.cart = cartContainer.innerHTML;
};

const clearCart = document.querySelector('button.empty-cart');
clearCart.addEventListener('click', cleanCart);

// Req 2, 4, 5 e 7
const fetchItem = (id) => fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((r) => r.json());

const addToCart = (item) => {
  const newObj = { sku: item.id, name: item.title, salePrice: item.price };
  const cart = document.querySelector('.cart__items');
  cart.appendChild(createCartItemElement(newObj));
  const newVal = parseFloat(cartVal().innerHTML) + parseFloat(item.price);
  cartVal().innerHTML = Math.round(newVal * 100) / 100;
  localStorage.cart = cartContainer.innerHTML;
};

const getItem = (e) => {
  const item = e.target.parentElement;
  const sku = item.firstChild.innerHTML;
  fetchItem(sku).then((r) => addToCart(r));
};

// Req 1
const createProductList = (arr) => {
  const sectionItems = document.querySelector('.items');
  sectionItems.innerHTML = null;
  arr.forEach((i) => {
    const newObj = { sku: i.id, name: i.title, image: i.thumbnail };
    sectionItems.appendChild(createProductItemElement(newObj));
  });
  const addButtons = document.querySelectorAll('.item__add');
  addButtons.forEach((i) => i.addEventListener('click', getItem));
};

// Código usando async/await:
const fetchML = async () => {
  const SEARCH_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const apiReturn = await fetch(SEARCH_URL);
  const json = await apiReturn.json();
  createProductList(json.results);
};

// Código usando .then:
// const SEARCH_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
// const fetchML = () => fetch(SEARCH_URL)
//   .then((r) => r.json())
//   .then((r) => createProductList(r.results));

// Executores
fetchML();

if (localStorage.cart) {
  cartContainer.innerHTML = localStorage.cart;
  document.querySelectorAll('.cart__item').forEach((i) => {
    i.addEventListener('click', cartItemClickListener);
  });
}

const productsContainer = document.querySelector('.items');
const cart = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');

const addTotalPrice = async (productPrice) => {
  const currentPrice = Number(totalPrice.innerHTML);
  totalPrice.innerHTML = (currentPrice + productPrice).toFixed(2);
  if (totalPrice.innerHTML === '0.00' || totalPrice.innerHTML === 0.00) {
    totalPrice.innerHTML = '0';
  }
};

const saveLocalStorage = () => {
  localStorage.setItem('cart', cart.innerHTML);
};

const loadLocalStorage = () => {
  cart.innerHTML = localStorage.getItem('cart');
};

async function getElements() {
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((r) => r.json())
    .then((r) => r.results);
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

const getId = (string, startingPosition) => {
  let startingIndex = 0;
  let id = '';
  for (let i = 13; i > 0; i -= 1) {
    id += string[startingPosition + startingIndex];
    startingIndex += 1;
  }
  return id;
};

async function getProductPrice(id) {
  let price = await fetch(`https://api.mercadolibre.com/items/${id}`);
  price = await price.json();
  price = await price.price;
  price *= -1;
  return price;
}

async function cartItemClickListener(event) {
  let idStart = event.target.innerHTML.search('SKU: ');
  idStart += 5;
  const stringProduct = event.target.innerHTML;
  const price = await getProductPrice(getId(stringProduct, idStart));
  addTotalPrice(price);
  event.target.remove();
  saveLocalStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  saveLocalStorage();
  return li;
}

const addListenersToProductButtons = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => button.addEventListener('click', async (event) => {
    const product = event.target.parentElement;
    const itemID = getSkuFromProductItem(product);
    let infoDoProduto = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
    infoDoProduto = await infoDoProduto.json();
    addTotalPrice(infoDoProduto.price);
    cart.appendChild(createCartItemElement(infoDoProduto));
    saveLocalStorage();
  }));
};

async function addProductsToPage() {
  const elementos = await getElements();
  await elementos.forEach((elemento) => {
    productsContainer.appendChild(createProductItemElement(elemento));
  });
  addListenersToProductButtons();
}

window.onload = function onload() {
  addProductsToPage();
  loadLocalStorage();
  const selectedProducts = document.querySelectorAll('.cart__item');
  selectedProducts.forEach((product) => product.addEventListener('click', (event) => {
    event.target.remove();
    saveLocalStorage();
  }));
};

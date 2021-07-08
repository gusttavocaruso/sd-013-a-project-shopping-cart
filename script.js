const productsContainer = document.querySelector('.items');
const cart = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
const clearCartButton = document.querySelector('.empty-cart');
const changeSearchButton = document.querySelector('.change-search');

const addTotalPrice = async (productPrice) => {
  const currentPrice = Number(totalPrice.innerHTML);
  totalPrice.innerHTML = Math.round((currentPrice + productPrice) * 100) / 100;
  if (totalPrice.innerHTML === '0.00' || totalPrice.innerHTML === 0.00) {
    totalPrice.innerHTML = '0';
  }
};

const saveLocalStorage = () => {
  localStorage.setItem('cart', cart.innerHTML);
  localStorage.setItem('total-price', totalPrice.innerHTML);
};

const loadLocalStorage = () => {
  cart.innerHTML = localStorage.getItem('cart');
  totalPrice.innerHTML = localStorage.getItem('total-price');
};

async function getElements(searchItem) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${searchItem}`)
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

async function cartItemClickListener(event) {
  const idStart = event.target.innerHTML.split('PRICE: $');
  let itemPrice = idStart[1];
  itemPrice *= -1;
  addTotalPrice(itemPrice);
  console.log(itemPrice);
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
    cart.appendChild(createCustomElement('h1', 'loading', 'loading...'));
    const loading = document.querySelector('.loading');
    let infoDoProduto = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
    infoDoProduto = await infoDoProduto.json();
    cart.removeChild(loading);
    addTotalPrice(infoDoProduto.price);
    cart.appendChild(createCartItemElement(infoDoProduto));
    saveLocalStorage();
  }));
};

async function addProductsToPage(elements) {
  productsContainer.appendChild(createCustomElement('h1', 'loading', 'loading...'));
  const elementos = await getElements(elements);
  productsContainer.innerHTML = '';
  await elementos.forEach((elemento) => {
    productsContainer.appendChild(createProductItemElement(elemento));
  });
  addListenersToProductButtons();
}

clearCartButton.addEventListener('click', () => {
  cart.innerHTML = '';
  totalPrice.innerHTML = 0;
  saveLocalStorage();
});

changeSearchButton.addEventListener('click', () => {
  const newSearchValue = document.querySelector('.input').value;
  if (newSearchValue === null || newSearchValue === '' || newSearchValue === ' ') {
    return alert('Insira um item válido');
  }
  document.querySelector('.input').value = '';
  addProductsToPage(newSearchValue);
});

window.onload = function onload() {
  addProductsToPage('computador');
  loadLocalStorage();
  const selectedProducts = document.querySelectorAll('.cart__item');
  selectedProducts.forEach((product) => product.addEventListener('click', (event) => {
    const idStart = event.target.innerHTML.split('PRICE: $');
    let itemPrice = idStart[1];
    itemPrice *= -1;
    addTotalPrice(itemPrice);
    event.target.remove();
    saveLocalStorage();
  }));
};

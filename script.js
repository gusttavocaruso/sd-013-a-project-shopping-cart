const productsContainer = document.querySelector('.items');
const cart = document.querySelector('.cart__items');

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

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  saveLocalStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addListenersToProductButtons = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => button.addEventListener('click', async (event) => {
    const product = event.target.parentElement;
    const itemID = getSkuFromProductItem(product);
    let infoDoProduto = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
    infoDoProduto = await infoDoProduto.json();
    console.log(infoDoProduto);
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
};

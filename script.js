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

const getCart = () => document.querySelector('.cart__items');

function storeCart() { 
  localStorage.setItem('cartContent', getCart().innerHTML);
}

function retrieveCart() {
  getCart().innerHTML = localStorage.getItem('cartContent');
}

function emptyButton() {
  const emptyBtn = document.querySelector('.empty-cart');
  emptyBtn.addEventListener('click', () => {
    getCart().innerHTML = '';
    totalPrice();
    storeCart();
  });
}

function cartItemClickListener(event) { 
  event.target.remove();
  totalPrice();
  storeCart();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) { 
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function loading() {
  const loadingText = document.createElement('p');
  loadingText.innerText = 'Loading...';
  loadingText.className = 'loading';
  document.querySelector('.container').appendChild(loadingText);
}

function removeLoading() {
  document.querySelector('.loading').remove();
}

async function addNewItemToCart(event) {
  loading();
  const itemSku = getSkuFromProductItem(event.target.parentElement);
  const response = await fetch(`https://api.mercadolibre.com/items/${itemSku}`);
  const data = await response.json();
  const findOl = document.querySelector('.cart__items');
  removeLoading();
  findOl.appendChild(createCartItemElement(data));
  totalPrice();
  storeCart();
}

function addNewItem(items) {
  items.forEach((item) => {
    const newItem = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(newItem);
    const findButton = newItem.querySelector('.item__add');
    findButton.addEventListener('click', addNewItemToCart);
  });
}

const totalPrice = () => {
  const priceDisplay = document.querySelector('.total-price');
  const cartItemsArr = [...getCart().children];
  const totalPrice = cartItemsArr.reduce((acc, curr) => 
    acc + Number(curr.innerText.split('$')[1]), 0);
  priceDisplay.innerText = totalPrice;
};

async function getApi(userInput) {
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${userInput}`);
  const data = await response.json();
    
    addNewItem(data.results);
}

window.onload = () => {
  getApi('computador');
  retrieveCart();
  emptyButton();
};
const cart = document.querySelector('.cart__items');

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

const getTotalPrice = () => {
  let total = 0;
  const cartItens = document.querySelectorAll('.cart__items > li');
  cartItens.forEach((item) => {
    const text = item.innerText;
    const valor = text.split('$')[1];
    total += parseFloat(valor);
  });
  const priceElement = document.querySelector('.total-price');
  priceElement.innerText = `${Math.round(total * 100) / 100}`;
};

const updateLocalStorage = () => {
  const cartItens = document.querySelectorAll('.cart__items > li');
  localStorage.clear();
  cartItens.forEach((item, index) => localStorage.setItem(index, item.innerText));
  console.log(localStorage);
};

function cartItemClickListener({ target }) {
  target.remove();
  updateLocalStorage();
  getTotalPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const AddItemToCart = (item) => {
  cart.appendChild(createCartItemElement(item));
  updateLocalStorage();
  getTotalPrice();
};

const fetchItemML = async ({ target }) => {
  const itemId = getSkuFromProductItem(target.parentNode);
  const response = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const data = await response.json();
  AddItemToCart(data);
};

const addToCartEventListeners = () => {
  const bts = document.querySelectorAll('.item__add');
  bts.forEach((bt) => { bt.addEventListener('click', fetchItemML); });
};

const AddItensToSection = (itens) => {
  const section = document.querySelector('.items');
  itens.forEach((item) => section.appendChild(createProductItemElement(item)));
};

const fetchMl = async (query) => {
  const loading = document.querySelector('.loading');
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const data = await response.json();
  loading.remove();
  AddItensToSection(data.results);
};

const initialLoad = () => {
  if (!localStorage) return;
  const itens = Object.values(localStorage);
  itens.forEach((item) => {
    const li = document.createElement('li');
    li.innerText = item;
    li.addEventListener('click', cartItemClickListener);
    cart.appendChild(li);
  });
  getTotalPrice();
};

const clearCart = () => {
  cart.innerHTML = '';
  const priceElement = document.querySelector('.total-price');
  priceElement.innerText = 0;
};

window.onload = async () => {
  await fetchMl('computador');
  addToCartEventListeners();
  initialLoad();
  const clearBt = document.querySelector('.empty-cart');
  clearBt.addEventListener('click', clearCart);
};

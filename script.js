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

const updateLocalStorage = () => {
  const cartItens = document.querySelectorAll('.cart__items > li');
  localStorage.clear();
  cartItens.forEach((item, index) => localStorage.setItem(index, item.innerText));
  console.log(localStorage);
};

function cartItemClickListener({ target }) {
  target.remove();
  updateLocalStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

const AddItemToCart = (item) => {
  const cart = document.querySelector('.cart__items');
  cart.appendChild(createCartItemElement(item));
  updateLocalStorage();
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

const addItenstoSection = (items) => {
  items.forEach((item) => {
    const itemElement = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
  });
};

const fetchML = async (query) => {
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const data = await response.json();
  addItenstoSection(data.results);
};

const initialLoad = () => {
  if (localStorage) {
    console.log(localStorage);
  }

  const cart = document.querySelector('.cart__items');

  const itens = Object.values(localStorage);
  itens.forEach((item) => {
    const li = document.createElement('li');
    li.innerText = item;
    li.addEventListener('click', cartItemClickListener);
    cart.appendChild(li);
  });
};

window.onload = async () => {
  await fetchML('computador');
  addToCartEventListeners();
  initialLoad();
};

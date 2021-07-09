const objectFetch = {
  method: 'GET',
  headers: { Accept: 'application/json' },
};

function cartItemClickListener() {
  // coloque seu código aqui -- VOLTAR EVENT COMO PARAMETRO
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  const cartItems = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  
  cartItems.appendChild(li);
}

const fetchItem = ({ target }) => {
  const API_URL_ITEM = `https://api.mercadolibre.com/items/${target.id}`;
  fetch(API_URL_ITEM, objectFetch)
    .then((response) => response.json())
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
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  fetch(API_URL, objectFetch)
    .then((response) => response.json()
    .then((data) => data.results
      .forEach((item) => createProductItemElement(item))));
};
/*
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
*/
window.onload = () => {
  fetchProduct('computador');
};

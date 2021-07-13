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

function cartItemClickListener(event) {
  
}

const getOrderList = document.querySelector('.cart__items');

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const createListElement = document.createElement('li');
  createListElement.className = 'cart__item';
  createListElement.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  createListElement.addEventListener('click', cartItemClickListener);

  getOrderList.appendChild(createListElement);

  return createListElement;
}

const fetchOneItem = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((data) => Object.values(data).forEach((item) => console.log(item)));
};

const addItemToCart = (event) => {
  fetchOneItem(event.target.parentElement.firstChild.innerText);
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const createButtonAdd = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(createButtonAdd);
  createButtonAdd.addEventListener('click', addItemToCart);
  const getSectionItems = document.querySelector('.items');
  getSectionItems.appendChild(section);

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const returnFetch = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => response.json()
    .then((data) => data.results)
    .then((results) => results.forEach((result) => createProductItemElement(result))));
};

window.onload = () => {
  returnFetch('computador');
};

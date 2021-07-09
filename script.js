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
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

/* aux */

const fetchID = async (id) => {
  const URL = `https://api.mercadolibre.com/items/${id}`;
  const response = await fetch(URL);
  const data = await response.json();

  return data;
};

const addToCart = async (param) => {
  const cart = document.querySelector('.cart');
  
  cart.appendChild(createCartItemElement(param));
};

const createItemList = async () => {
  const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador'
  const response = await fetch(URL);
  const data = await response.json();
  const { results } = data;
  
  results.forEach((result) => {
    const item = createProductItemElement(result);
    const section = document.querySelector('.items');
    section.appendChild(item);

    item.lastElementChild.addEventListener('click', addToCart(result));
  });

  // addToCart()
};

/* aux fim */

window.onload = () => { 
  createItemList();
};
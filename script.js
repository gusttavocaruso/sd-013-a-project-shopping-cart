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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart(item) {
  const itemToAdd = createCartItemElement(item);
  const shoppingCart = document.querySelector('.cart__items');
  shoppingCart.appendChild(itemToAdd);
}

async function fetchId(iD) {
  const response = await fetch(`https://api.mercadolibre.com/items/${iD}`);
  const data = await response.json();
  addToCart(data);
}

const getItemId = (event) => {
  const wholeItem = event.target.parentElement;
  const itemId = wholeItem.firstChild.innerText;
  fetchId(itemId);
};

const addChild = (items) => {
  items.forEach((item) => {
    const newItem = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(newItem);
  });
  const everyButton = document.querySelectorAll('.item__add');
  everyButton.forEach((button) => button.addEventListener('click', getItemId));
};

async function getApi() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  addChild(data.results);
  return data;
}

window.onload = () => { 
  getApi();
};

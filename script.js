let array = [];
let total = 0;
const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

const arrayPush = (item) => array.push(item);
const appendTotal = (number) => {
  const priceElement = document.querySelector('.total-price');
  priceElement.style.textAlign = 'center';
  priceElement.innerText = `${number}`;
  return priceElement;
};

// requisito 5
const totalValue = () => {
  total = 0;
  const cartItems = document.querySelectorAll('li');
  const arrayItems = Array.from(cartItems);
  arrayItems.forEach((item) => {
    const textItem = item.innerText;
    const textItemSplit = textItem.split('$');
    const price = parseFloat(textItemSplit[1]);
    total += price;
  });
  return appendTotal(total);
};

// requisito 4

const saveToLocalStorage = () => {
  localStorage.setItem('savedCarts', JSON.stringify(array));
};

function cartItemClickListener(event) {
  const index = Array.from(document.querySelectorAll('li')).indexOf(event.target);
  console.log(index);
  array.splice(index, 1);
  event.target.remove();
  saveToLocalStorage();
  totalValue();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getLocalStorage = () => {
  const ol = document.querySelector('ol');
  const info = JSON.parse(localStorage.getItem('savedCarts'));
  if (info) {
    array = info;
    info.forEach((item) => {
      const element = createCartItemElement(item);
      ol.appendChild(element);
    });
  }
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__name', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

const display = (value) => {
  const sectionItems = document.querySelector('.cart');
  if (value === 'on') {
    const p = document.createElement('p');
    p.className = 'loading';
    p.innerText = 'loading...';
    return sectionItems.appendChild(p);
  }
  return document.querySelector('.loading').remove();
};

// requisito 1
const fetchItems = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
};

const appendProducts = async () => {
  const items = document.querySelector('.items');
  display('on');
  const products = await fetchItems(URL);
  display('off');
  products.forEach((element) => items.append((createProductItemElement({
    sku: element.id,
    name: element.title,
    image: element.thumbnail,
  }))));
};
// requisito 2

const fetchItem = async (item) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${item}`);
  const itemAdded = await response.json();
  return itemAdded;
};

const appendCart = async (id) => {
  const ol = document.querySelector('ol');
  const data = await fetchItem(id);
  const item = { sku: data.id, name: data.title, salePrice: data.price };
  const cart = createCartItemElement(item);
  ol.appendChild(cart);
  arrayPush(item);
  saveToLocalStorage();
  totalValue();
};

const addButtonListener = () => {
  const items = document.querySelector('.items');
  for (let i = 0; i < items.children.length; i += 1) {
    const element = items.children[i];
    const id = getSkuFromProductItem(element);
    const button = element.querySelector('button.item__add');
    button.addEventListener('click', () => appendCart(id));
  }
};

// requisito 6
const wipeCart = () => {
  const button = document.querySelector('button.empty-cart');
  const ol = document.querySelector('ol');
  button.addEventListener('click', () => {
    ol.innerHTML = '';
    localStorage.clear();
    totalValue();
  });
};

window.onload = async () => {
  await fetchItems(URL);
  await appendProducts();
  getLocalStorage();
  addButtonListener();
  totalValue();
  wipeCart();
};
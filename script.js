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

/** funções para execução do projeto */

const fetchProducts = async () => {
  const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const response = await fetch(URL);
  const data = await response.json();

  return data;
};

const fetchItemID = async (id) => {
  const URL = `https://api.mercadolibre.com/items/${id}`;
  const response = await fetch(URL);
  const data = await response.json();

  return data;
};

/* variaveis globais das chaves do storage */

const key = 'shopping-cart';
const storageItems = '.cart__items';

/* fim da chaves globais do storage */

const saveCartItems = (items) => {
  const storage = localStorage;
  storage.setItem(key, items);
};

const removeItem = (element, id) => {
  element.remove();
  const storage = localStorage;
  const items = JSON.parse(storage.getItem('shopping-cart'));

  const filteredItems = items.filter((item) => item.id !== id);
  storage.setItem(key, JSON.stringify(filteredItems));
};

const sumTotalPrice = async () => {
  const items = JSON.parse(localStorage.getItem(key)) || [];
  const totalSpan = document.querySelector('.total-price');
  const prices = await items
    .map((item) => item.price)
    .reduce((acc, curr) => acc + curr, 0);

  totalSpan.innerText = prices;
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  const ol = document.querySelector(storageItems);

  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  ol.appendChild(li);

  li.addEventListener('click', (e) => {
    removeItem(e.target, sku);
    sumTotalPrice();
  });

  return li;
}

const loadCartItems = () => {
  const myStorage = localStorage;

  const items = JSON.parse(myStorage.getItem(key));
  const cart = document.querySelector(storageItems);

  if (!items) return false;

  items.forEach((item) => {
    const eachItem = createCartItemElement(item);
    cart.appendChild(eachItem);
  });
};

const populateList = (results) => { 
  const section = document.querySelector('.items');
  results.forEach((result) => {
    const item = createProductItemElement(result);
    section.appendChild(item);
  });
};

const handleClick = () => {
  const buttons = document.querySelectorAll('.item__add');

  buttons.forEach((button) => {
    button.addEventListener('click', async (e) => {
      const parent = e.target.parentNode.firstChild;
      const item = await fetchItemID(parent.innerText);
      const items = JSON.parse(localStorage.getItem(key)) || [];

      items.push(item);
      saveCartItems(JSON.stringify(items));
      createCartItemElement(item);
      await sumTotalPrice();
    });
  });
};

const clearButton = () => {
  const emptyCartButton = document.querySelector('.empty-cart');
  const cartItems = document.querySelector(storageItems);
  const totalSpan = document.querySelector('.total-price');
  const storage = localStorage;
  emptyCartButton.addEventListener('click', () => {
    const clearStorage = storage.clear();
    cartItems.innerText = '';
    totalSpan.innerText = '';
    return clearStorage;
  });
};

const loading = async () => {
  const p = document.createElement('p');
  p.classList.add('loading');
  p.innerText = 'loading...';

  return p.innerText;
};

const createItemList = async () => {
  const { results } = await fetchProducts();
  const randomLoad = Math.round(Math.random() * 5000);
  const itemSection = document.querySelector('.items');
  
  populateList(results);
  handleClick();
};

window.onload = () => {
  createItemList();
  loadCartItems();
  clearButton();
};
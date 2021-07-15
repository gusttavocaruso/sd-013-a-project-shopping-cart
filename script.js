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

const key = 'shopping-cart';

const saveCartItems = (items) => {
  const storage = localStorage;
  storage.setItem(key, items);
};

const removeItem = (item) => {
  item.remove();
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  const ol = document.querySelector('.cart__items');

  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  ol.appendChild(li);

  li.addEventListener('click', (e) => removeItem(e.target));

  return li;
}

const loadCartItems = () => {
  const myStorage = localStorage;

  const items = JSON.parse(myStorage.getItem(key));
  const cart = document.querySelector('.cart__items');
  console.log(items);

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
  const items = JSON.parse(localStorage.getItem(key)) || []; 

  buttons.forEach((button) => {
    button.addEventListener('click', async (e) => {
      const parent = e.target.parentNode.firstChild;
      const item = await fetchItemID(parent.innerText);
      items.push(item);
      saveCartItems(JSON.stringify(items));
      createCartItemElement(item);
    });
  });
};

const createItemList = async () => {
  const { results } = await fetchProducts();

  populateList(results);
  handleClick();
};

window.onload = () => {
  createItemList();
  loadCartItems();
};
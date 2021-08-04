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

const addItensToSection = (items) => {
  items.forEach((item) => {
    const ItemElement = createProductItemElement(item); // item == product
    const section = document.querySelector('.items');
    section.appendChild(ItemElement);
  });
};

const fetchML = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => { // response traz todas as informações
      response.json().then((data) => {
        addItensToSection(data.results);
      });
    });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const cartItems = '.cart__items'; // Início do requisito 4

const totalPrice = () => { // Requisito 5
  const sum = document.querySelector('.total-price');
  const li = document.querySelectorAll('li');
  let price = null;
  li.forEach((event) => {
    const item = event.innerText.split('$');
    price += Number(item[1]);
  });
  sum.innerHTML = `${(Math.round((price * 100)) / 100)}`;
};

const setLocalStorage = () => { // Requisito 4
  const ol = document.querySelector(cartItems); 
  const cartText = ol.innerHTML;
  localStorage.setItem('list', '');
  localStorage.setItem('list', JSON.stringify(cartText));
};

function cartItemClickListener(event) {
  event.target.remove(); // Requisito 3
  setLocalStorage(); // Requisito 4
  totalPrice();
}

const getLocalStorage = () => { // Requisito 4
  const getStorage = JSON.parse(localStorage.getItem('list'));
  const ol = document.querySelector(cartItems);
  ol.innerHTML = getStorage;
  ol.addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') {
      cartItemClickListener(event);
    }
  });
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addItem(itemsIDs) { // Início do requisito 2
  return fetch(`https://api.mercadolibre.com/items/${itemsIDs}`)
    .then((response) => response.json())
    .then((data) => data);
}

const addItemButton = () => {
  const items = document.querySelector('.items');
  items.addEventListener('click', async (click) => {
    if (click.target.className === 'item__add') {
      const element = click.target.parentElement;
      const id = getSkuFromProductItem(element);
      const returnAddItemsFunc = await addItem(id);
      const li = createCartItemElement(returnAddItemsFunc);
      document.querySelector('.cart__items').appendChild(li);
      document.querySelector(cartItems).appendChild(li); // Requisito 4
      setLocalStorage(); // Requisito 4
      totalPrice(); // Requisito 5
    }
  });
}; // Fim do requisito 2

window.onload = () => {
  fetchML('computador');
  addItemButton();
  getLocalStorage(); // Requisito 4
  totalPrice(); // Requisito 5
};

const cartItems = '.cart__items';

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function precoTotal() {
  let price = 0;
  const span = document.querySelector('.total-price');
  const todasLi = document.querySelectorAll('li');
  todasLi.forEach((item) => {
    const computer = item.innerText.split('$');
    price += Number(computer[1]);
  });
  span.innerHTML = `${(Math.round((price * 100)) / 100)}`;
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

async function fetchApiComputer() {
  const loading = document.querySelector('.loading');
  const api = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const obj = await api.json();
  const result = obj.results;
  loading.remove();
  result.forEach((computer) => document.querySelector('.items')
    .appendChild(createProductItemElement(computer)));
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function fetchAddCart(id) {
  const api = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const json = await api.json();
  return json;
}

function addLocalStorage() {
  const lista = document.querySelector(cartItems);
  const text = lista.innerHTML;
  localStorage.setItem('cartList', '');
  localStorage.setItem('cartList', JSON.stringify(text));
}

function cartItemClickListener(event) {
  event.target.remove();
  precoTotal();
  addLocalStorage();
}

function getStorage() {
  const storage = JSON.parse(localStorage.getItem('cartList'));
  const lista = document.querySelector(cartItems);
  lista.innerHTML = storage;
  lista.addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') {
      cartItemClickListener(event);
    }
  });
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function buttonAddCarrinho() {
  const items = document.querySelector('.items');
  items.addEventListener('click', async (e) => {
    if (e.target.className === 'item__add') {
      const parent = e.target.parentElement;
      const id = getSkuFromProductItem(parent);
      const data = await fetchAddCart(id);
      const createComputer = createCartItemElement(data);
      document.querySelector(cartItems).appendChild(createComputer);
      addLocalStorage();
      precoTotal();
    }
  });
}

function buttonRmv() {
  const listItems = document.querySelector(cartItems);
  const buttonRemove = document.querySelector('.empty-cart');
  buttonRemove.addEventListener('click', () => {
    const deletaLi = document.querySelectorAll('li');
    deletaLi.forEach((elemento) => {
      listItems.removeChild(elemento);
      precoTotal();
      addLocalStorage();
    });
  });
}

window.onload = () => {
  fetchApiComputer();
  buttonAddCarrinho();
  getStorage();
  precoTotal();
  buttonRmv();
};
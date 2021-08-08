const cart = '.cart__items';
const totalPriceClass = '.total-price';

const saveOnLocalStorage = () => {
  const recoverOl = document.querySelector(cart);
  const olText = recoverOl.innerHTML;
  localStorage.setItem('cartList', '');
  localStorage.setItem('cartList', JSON.stringify(olText));
};

const salveTotalPriceOnLocalStorage = () => {
  const recoverPrice = document.querySelector(totalPriceClass);
  const text = recoverPrice.innerHTML;
  localStorage.setItem('totalPrice', '');
  localStorage.setItem('totalPrice', JSON.stringify(text));
};

function totalPrice() {
  const span = document.querySelector(totalPriceClass);
  let price = 0;
  const arrayPrices = document.querySelectorAll('li');
  arrayPrices.forEach((item) => {
  const product = item.innerText.split('$');
  price += Number(product[1]);
  });
  span.innerHTML = `${(Math.round((price * 100)) / 100)}`;
  salveTotalPriceOnLocalStorage();
  } 

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
  event.target.remove();
  totalPrice();
  saveOnLocalStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const productsMl = async () => {
  const loading = document.querySelector('.loading');
  const api = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const jsonList = await api.json();
  const resultsJson = jsonList.results;
  resultsJson.forEach((element) => document.querySelector('.items')
  .appendChild(createProductItemElement(element)));
  loading.remove();
};

const addComputer = async (id) => {
  const oneComputer = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const jsoneComputer = await oneComputer.json();
  return jsoneComputer;
};

const removeAll = () => {
  const recoverProducts = document.querySelectorAll('li');
  recoverProducts.forEach((element) => element.remove());
  totalPrice();
};

const addCart = () => {
  const section = document.querySelector('.container');
  section.addEventListener('click', async (event) => {
    if (event.target.className === 'item__add') {
      const button = event.target.parentElement;
      const id = getSkuFromProductItem(button);
      const data = await addComputer(id);
      const createComputer = createCartItemElement(data);
      document.querySelector(cart).appendChild(createComputer);
      saveOnLocalStorage();
      totalPrice();
    }
    if (event.target.className === 'empty-cart') {
      removeAll();
      saveOnLocalStorage();
      totalPrice();
    }
  });
};

const getOnLocalStorage = () => {
  const recoverLocalStorage = JSON.parse(localStorage.getItem('cartList'));
  const recoverTotalPriceOnLocalStorage = JSON.parse(localStorage.getItem('totalPrice'));
    if (recoverLocalStorage !== null) {
    const recoverOl = document.querySelector(cart);
    recoverOl.innerHTML = recoverLocalStorage;
}
    if (recoverTotalPriceOnLocalStorage !== null) {
    const recoverSpan = document.querySelector(totalPriceClass);
    recoverSpan.innerHTML = recoverTotalPriceOnLocalStorage;
}
};

window.onload = () => {
  productsMl();
  addCart();
  getOnLocalStorage();
};

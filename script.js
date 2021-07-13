/* eslint-disable sonarjs/no-duplicate-string */
function stopLoading() {
  const loading = document.querySelector('.loading');
  if (loading) {
    loading.remove();
  }
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

function getIdByClickedProduct(target) {
  const returnedSkuId = getSkuFromProductItem(target.parentElement);
  return returnedSkuId;
}

function saveCart(param) {
  localStorage.setItem('cart', param);
}

const sumItems = () => {
  const ol = document.querySelector('.cart__items');
  const olChildren = [...ol.children];
  const priceItems = olChildren.reduce((acc, li) => {
    let a = acc;
    a += Number(li.innerText.split('$')[1]);
    return a;
  }, 0);
  return Math.round(priceItems * 1000) / 1000;
};

function appendItemsPrices() {
  const divTotal = document.querySelector('.total-price');
  const haveParagraph = document.querySelector('.total-price-paragraph');
  if (haveParagraph) {
    const priceTotalItems = sumItems();
    haveParagraph.innerText = `${priceTotalItems}`;
    divTotal.appendChild(haveParagraph);
  } else {
    const template = document.createElement('p');
    template.className = 'total-price-paragraph';
    const priceTotalItems = sumItems();
    template.innerText = `${priceTotalItems}`;
    divTotal.appendChild(template);
  }
  const toStore = divTotal.innerHTML;
  localStorage.setItem('price', toStore);
}

function cartItemClickListener(event) {
  const cart = document.querySelector('.cart__items');
  cart.removeChild(event.target);
  const toStore = cart.innerHTML;
  saveCart(toStore);
  appendItemsPrices();
}

function getSavedPrices() {
  const pricesDiv = document.querySelector('.total-price');
  pricesDiv.innerHTML = localStorage.getItem('price');
}

function getSavedCart() {
  const ol = document.querySelector('.cart__items');
  ol.innerHTML = localStorage.getItem('cart');
  const lis = [...ol.children];
  lis.forEach((li) => {
    li.addEventListener('click', cartItemClickListener);
  });
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function passParamsToCreateCartItem(event) {
  const auxFetchItemToCart = getIdByClickedProduct(event.target);
  fetch(`https://api.mercadolibre.com/items/${auxFetchItemToCart}`)
  .then((response) => response.json()).then((data) => {
    const cartItemGenerated = createCartItemElement(data);
    const cart = document.querySelector('.cart__items');
    cart.appendChild(cartItemGenerated);
    const toStore = cart.innerHTML;
    saveCart(toStore);
    appendItemsPrices();
  });
}

function addEventsListenersToItems() {
  const allButtons = document.querySelectorAll('.item__add');
  allButtons.forEach((button) => {
    button.addEventListener('click', passParamsToCreateCartItem);
  });
}

const addItems = (items) => {
  items.forEach((item) => {
    const itemElement = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
  });
  addEventsListenersToItems();
  setInterval(stopLoading, 500);
};

const fetchML = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  .then((response) => {
    response.json().then((data) => {
      addItems(data.results);
    });
  });
};

function clearCart() {
  const ol = document.querySelector('.cart__items');
  const liColection = document.querySelectorAll('.cart__item');
  liColection.forEach((li) => {
    ol.removeChild(li);
  });
  const toStore = ol.innerHTML;
  saveCart(toStore);
  appendItemsPrices();
}

function buttonClearCart() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', clearCart);
}

buttonClearCart();

window.onload = () => { fetchML('computador'); getSavedCart(); getSavedPrices(); };

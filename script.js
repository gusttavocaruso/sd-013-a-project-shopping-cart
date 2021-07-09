const cart = document.getElementsByClassName('.cart__items');

function saveItens() {
  localStorage.setItem('cart', cart.innerHTML);
}

function getSavedItens() {
  cart.innerHTML = localStorage.getItem('cart');
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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  saveItens();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function fillCart() {
  const item = event.target.parentElement;
  const itemID = getSkuFromProductItem(item);
  const url = `https://api.mercadolibre.com/items/${itemID}`;

  return fetch(url)
    .then((response) => response.json())
    .then((object) => {
      object.forEach((obj) => {
        cart.appendChild(createCartItemElement(obj));
      });
    });
}

// fonte: https://www.youtube.com/watch?v=m3K8DP4kVXQ
function productList() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  return fetch(url)
    .then((response) => response.json())
    .then((object) => {
      object.results.forEach((item) => {
        const pcs = document.getElementsByClassName('items')[0];
        console.log(item);
        pcs.appendChild(createProductItemElement(item));
      });
    });
}

window.onload = () => { 
  productList();
  getSavedItens();
  document.getElementsByClassName('item__add').addEventListener('click', fillCart);
};

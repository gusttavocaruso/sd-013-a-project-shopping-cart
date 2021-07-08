/* const cart = document.querySelector('.cart__items');

/* function saveItens() {
  localStorage.setItem('cart', cart.innerHTML);
} */

/* function getSavedItens() {
  cart.innerHTML = localStorage.getItem('cart');
} */

/* function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
} */

/* function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
} */

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

/* function cartItemClickListener(event) {
  event.target.remove();
  saveItens();
} */

/* function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
} */

/* function fillCart(event) {
  const item = event.target.parentElement;
  const itemID = getSkuFromProductItem(item);
  const url = `https://api.mercadolibre.com/items/${itemID}`;

  fetch(url)
    .then((response) => response.json())
    .then((object) => {
      object.forEach((obj) => {
        cart.appendChild(createCartItemElement(obj));
      });
    });
} */

// fonte: https://www.youtube.com/watch?v=m3K8DP4kVXQ
function productList() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  return fetch(url)
    .then((response) => response.json())
    .then((object) => {
      object.results.forEach((item) => {
        const pcs = document.getElementsByClassName('items')[0];
        pcs.appendChild(createProductItemElement(item));
      });
    });
}

window.onload = () => { 
  productList();
  // getSavedItens();
  // fillCart();
};

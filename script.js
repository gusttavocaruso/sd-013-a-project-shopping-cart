function saveItens({ id, title, price }) {
  const teste = JSON.parse(localStorage.getItem('cart')) || [];
  teste.push({ id, title, price });
  localStorage.setItem('cart', JSON.stringify(teste));
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

function cartItemClickListener(event, id) {
  event.target.remove();

  const teste = JSON.parse(localStorage.getItem('cart')) || [];
  const removeItem = teste.filter((item) => item.id !== id);
  localStorage.setItem('cart', JSON.stringify(removeItem));
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', (event) => cartItemClickListener(event, id));

  return li;
}

function getSavedItens() {
  const savedCart = JSON.parse(localStorage.getItem('cart'))  || [];
  const cart = document.querySelector('ol.cart__items');

  savedCart.forEach((itemCart) => {
    cart.appendChild(createCartItemElement(itemCart));
  })
}

function fillCart(event) {
  const item = event.target.parentElement;
  const itemID = getSkuFromProductItem(item);
  const url = `https://api.mercadolibre.com/items/${itemID}`;

  fetch(url)
    .then((response) => response.json())
    .then((object) => {
      const cart = document.querySelector('.cart__items');
      saveItens(object);
      cart.appendChild(createCartItemElement(object));
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
        pcs.appendChild(createProductItemElement(item));
      });
    })
    .then(() => {
      const tshopCart = document.querySelectorAll('.item__add');
      tshopCart.forEach((iten) => {
        iten.addEventListener('click', fillCart);
      });
    });
}

window.onload = () => { 
  productList();
  getSavedItens();
};

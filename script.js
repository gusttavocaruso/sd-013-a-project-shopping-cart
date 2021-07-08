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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function saveStatus() {
  const cartItems = document.getElementsByClassName('cart__items')[0];
  localStorage.setItem('cartData', cartItems.innerHTML);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  saveStatus();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getData = async () => {
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const response = await fetch(API_URL);
  if (!response.ok) {
    const message = `Erro: ${response.status}`;
    throw new Error(message);
  }
  await response.json()
    .then((array) => {
      array.results.forEach((item) => {
        const object = {
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        };
        const product = createProductItemElement(object);
        document.getElementsByClassName('items')[0].appendChild(product);
      });
    });
};

const addToCart = async (element) => {
  const id = getSkuFromProductItem(element.target.parentElement);
  const API_URL = `https://api.mercadolibre.com/items/${id}`;
  const response = await fetch(API_URL);
  if (!response.ok) {
    const message = `Erro: ${response.status}`;
    throw new Error(message);
  }
  await response.json()
    .then((item) => {
      const object = {
        sku: getSkuFromProductItem(element.target.parentElement),
        name: item.title,
        salePrice: item.price,
      };
      const cartItem = createCartItemElement(object);
      document.getElementsByClassName('cart__items')[0].appendChild(cartItem);
      saveStatus();
    });
};

function loadCart() {
  const cartItems = document.getElementsByClassName('cart__items')[0];
  cartItems.innerHTML = localStorage.getItem('cartData');
  const cartArray = document.getElementsByClassName('cart__item');
  Array.prototype.forEach.call(cartArray, function (item) {
    item.addEventListener('click', cartItemClickListener);
  });
}

window.onload = async () => {
  await getData();
  loadCart();
  const elements = document.getElementsByClassName('item__add');
  Array.prototype.forEach.call(elements, function (el) {
    el.addEventListener('click', addToCart);
  });
};

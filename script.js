let priceItemCart = [];
const cI = '.cart__items';
const tP = '.total-price';

function localStorage() {
  const cartItems = document.querySelector(cI).innerHTML;
  const totalPrice = document.querySelector(tP).innerText;
  localStorage.setItem('cartItems', cartItems);
  localStorage.setItem('totalPrice', totalPrice);
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function somaCartTotal(itemPrice) {
  const sectionTotalPrice = document.querySelector(tP);
  priceItemCart.push(itemPrice);
  const somaPrices = priceItemCart.reduce((acc, value) => acc + value);
  sectionTotalPrice.innerText = somaPrices;
}

function cartItemClickListener(event, price) {
  // coloque seu código aqui
  const item = event.target;
  item.remove();
  const sectionTotalPrice = document.querySelector(tP);
  priceItemCart = priceItemCart.filter((items) => items !== price);
  const somaRemanedPrices = priceItemCart.reduce((acc, value) => acc + value, 0);
  sectionTotalPrice.innerText = somaRemanedPrices;
  localStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  const ol = document.querySelector(cI);
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event, salePrice));
  ol.appendChild(li);
  somaCartTotal(salePrice);
  localStorage();
}

function fetchItem(event) {
  const itemId = event.target.parentNode.firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
  .then((response) => {
    response.json().then((data) => createCartItemElement(data));
  });
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', fetchItem);
  }
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// foi feito o req. 1 utilizando o video que o tio Jack explicando como resolver essa primeira parte.
const addItensToSection = (items) => {
  items.forEach((item) => {
    const itemElement = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
  });
};

const fetchML = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  .then((response) => {
    response.json().then((data) => {
      addItensToSection(data.results);
    });
  });
};

window.onload = () => {
  fetchML('computador');
  document.querySelector(cI).innerHTML = localStorage.getItem('cartItems');
  document.querySelector(tP).innerText = localStorage.getItem('totalPrice');
};

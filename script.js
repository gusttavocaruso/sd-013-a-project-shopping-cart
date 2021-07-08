// const fetch = require('node-fetch');

const getProductList = (url) => new Promise((resolve, reject) => {
  if (url !== 'https://api.mercadolibre.com/sites/MLB/search?q=computador') {
    reject(new Error('Endereço inválido'));
  } else {
    fetch(url)
    .then((response) => {
      response.json().then((obj) => console.log(obj.results));
      resolve();
    });
  }
  });

const computer = getProductList('https://api.mercadolibre.com/sites/MLB/search?q=computador');
console.log(computer);

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

  section.appendChild(createCustomElement('span', 'item__id', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

// window.onload = () => { };
// window.onload = () => computer;
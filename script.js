// const fetch = require('node-fetch');

// =======================================================================================
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// =======================================================================================
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// =======================================================================================
function createProductItemElement({ sku, name, image }) {
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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// =======================================================================================
const getMblPromise = (item) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`) // retorna uma promise
    .then((response) => {
      response.json().then((jsonMbl) => {
        // console.log(jsonMbl.results);
        jsonMbl.results.forEach((result) => {
          const teste = document.getElementsByClassName('items');
          teste[0].appendChild(createProductItemElement(result));
        });
      });
    });
};

const fetchMblPromise = async () => {
  try {
    await getMblPromise('computador');
  } catch (error) {
    console.log(error);
  }
};

// =======================================================================================
window.onload = () => fetchMblPromise();
// window.onload = () => { };

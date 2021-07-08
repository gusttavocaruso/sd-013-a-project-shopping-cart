// const fetch = require('node-fetch');

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

const createProductList = async () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  const section = document.querySelector('.items');
  const objList = await fetch(url)
    .then((response) => response.json())
    .then((data) => data.results);
  objList.forEach((computer) => {
    section.appendChild(createProductItemElement(computer));
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

const addProductToCart = (obj) => {
  const myCart = document.querySelector('.cart__items');
  const newLi = createCartItemElement(obj);
  myCart.appendChild(newLi);
};

const addEventButtons = () => {
  const section = document.querySelector('.items');
  section.addEventListener('click', async (event) => {
    if (event.target.className === 'item__add') {
      const parentSection = event.target.parentElement;
      const itemId = getSkuFromProductItem(parentSection);
      const obj = await fetch(`https://api.mercadolibre.com/items/${itemId}`)
        .then((response) => response.json());
      addProductToCart(obj);
    }
  });
};

window.onload = () => { 
  createProductList();
  addEventButtons();
};

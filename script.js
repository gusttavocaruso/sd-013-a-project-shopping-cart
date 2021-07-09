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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Aux
const createItems = (results) => {
  results.forEach((product) => {
    const items = document.querySelector('.items');
    const item = createProductItemElement(product);
    items.appendChild(item);
  });
};

const buttonEventListener = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((element) => {
    element.addEventListener(('click'), (event) => {
      const itemId = event.target.parentNode.firstChild.innerText;
      // console.log(itemId);
      fetch(`https://api.mercadolibre.com/items/${itemId}`)
        .then((response) => response.json()
          .then((data) => {
            const cartItems = document.querySelector('.cart__items');
            const cartItem = createCartItemElement(data);
            cartItems.appendChild(cartItem);
          }));
    });
  });
};

const getProductList = () => fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((data) => data.results)
  .catch((error) => console.log(error));

// window.onload = () => { };

// window.onload = () => {
//   getProductList()
//     .then((results) => {
//       createItems(results);
//       buttonEventListener();
//     });
// };

window.onload = async () => {
  const results = await getProductList();
  createItems(results);
  buttonEventListener();
  console.log('Bianca');
};

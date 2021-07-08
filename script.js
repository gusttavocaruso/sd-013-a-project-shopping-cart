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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchResults = () => fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((responseJson) => responseJson.results);

  const insertElement = async () => {
    const json = await fetchResults();

    const sectionItems = document.getElementsByClassName('items')[0];

    json.forEach((productObject) => {
      const item = createProductItemElement(productObject);
      sectionItems.appendChild(item);
    });
  };

  const fetchItem = (id) => fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((itemJson) => itemJson);

  const addToCart = () => {
    document.addEventListener('click', async (event) => {
      if (event.target.classList.contains('item__add')) {
        const id = event.target.parentElement.firstChild.innerText;
        const productJson = await fetchItem(id);
        const cartProduct = createCartItemElement(productJson);
        const cartList = document.getElementsByClassName('cart__items')[0];
        cartList.appendChild(cartProduct);
      }
    });
  };

  window.onload = () => {
    insertElement();
    addToCart();
};

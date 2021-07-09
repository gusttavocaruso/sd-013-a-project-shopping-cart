window.onload = async () => {
  await fetchProducts("https://api.mercadolibre.com/sites/MLB/search?q=computador");
   addButtonListener();
};

// const fetch = require('node-fetch');
// requisito 1
const fetchProducts = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  const results = data.results;
  console.log(data.results)
  results.forEach((element) => (createProductItemElement({
    sku: element.id,
    name: element.title,
    image: element.thumbnail,
  })));
}

// requisito 2

const fetchItem = async (item) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${item}`);
  const itemAdded = await response.json();
  return itemAdded;
}

const addButtonListener = () => {
  const items = document.querySelector('.items');
  for (let i = 0; i < items.children.length; i += 1) {
    const element = items.children[i];
    console.log(element);
    const id = getSkuFromProductItem(element);
    const button = element.getElementsByClassName('item__add')[0]
    button.addEventListener('click', async () => {
      const data = await fetchItem(id);
      const cart = createCartItemElement({
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      });
      const ol = document.querySelector('ol');
      ol.appendChild(cart);
    });
  }
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__name', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const items = document.querySelector('.items')
  items.appendChild(section)
  return section;
}

function getSkuFromProductItem(item) {
  console.log( item.querySelector('span.item__sku').innerText);
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {

}

function createCartItemElement({sku,name,salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}



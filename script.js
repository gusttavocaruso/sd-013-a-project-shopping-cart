const botoes = document.getElementsByClassName('item__add');
const cartAdd = document.getElementsByClassName('cart__items'); 

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

function creatorSection(items) {
  items.forEach((item) => {
    const itemElement = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
  });
}

function jsonProducts(item = 'computador') {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`)
    .then((response) => {
      response.json().then((data) => {
        // console.log(data.results);
        creatorSection(data.results);
      });
    });
  }

function itemId(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json()
      .then((data) => {
        console.log(data);
        // creatorCart(data);
      }));
}
window.onload = () => {
  jsonProducts();
  itemId('MLB1341706310');
};
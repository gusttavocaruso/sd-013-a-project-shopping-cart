const newOl = document.querySelector('.cart__items');

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
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  newOl.appendChild(li);

  return li;
}

//Requisito 1
const createItem = (items) => {
  items.forEach((item) => {
    const itemElement = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
  });
};

const computerFetch = () => {
  const loading = document.querySelector('.loading');
  const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(URL)
    .then((response) => {
      response.json().then((data) => {
        createItem(data.results);
        loading.remove();
      });
    });
 };

//Requisito 2
const getItemId = (element) => {
  const parentElem = element.target.parentElement;
  const idSku = getSkuFromProductItem(parentElem);
  fetch(`https://api.mercadolibre.com/items/${idSku}`)
  .then((response) => { 
    response.json()
    .then((data) => {
      const addLi = createCartItemElement(data);
      newOl.appendChild(addLi);
    });
  });
};

const addButton = () => {
  const section = document.querySelector('.items');
  section.addEventListener('click', (element) => {
    if (element.target.className === 'item__add') {
      getItemId(element);
    }
  });
};

window.onload = () => {
  computerFetch();
  addButton();
 };

 
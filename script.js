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

function insertId(productId) {
  const apiId = `https://api.mercadolibre.com/items/${productId}`;
  return fetch(apiId)
  .then((response) => response.json())
  .then((data) => {
    const cartItens = document.querySelector('.cart__items');
    cartItens.appendChild(createCartItemElement(data));
  });
}

const api = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

function GetSKU(target) {
  const insertID = insertId(target.parentNode.firstChild.innerText);
  return insertID;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.children[3]
    .addEventListener('click', (event) => GetSKU(event.target));
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const addItensToSection = (itens) => {
  const sectionItems = document.querySelector('.items');
  itens.forEach((item) => {
    const itemElement = createProductItemElement(item);
    sectionItems.appendChild(itemElement);
  });
};

const accessEP = (endPoint) => {
  fetch(endPoint)
  .then((response) => response.json())
  .then((response1) => addItensToSection(response1.results));
};

// addEventListener
window.onload = () => {
  accessEP(api);
};

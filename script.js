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

  // Com o auxílio do Zezé no plantão
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  const ol = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  ol.appendChild(li);
}

// REQUISITO 1:
function addItensToSection(items) {
  items.forEach((item) => {
    const itemElement = createProductItemElement(item);
    const section = document.querySelector('.items');

    section.appendChild(itemElement);
  });
}

// REQUISITO 1:
function fetchML(query) {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${query}`)
    .then((response) => {
      response.json().then((data) => addItensToSection(data.results));
  });
}

// REQUISITO 2:
function fetchItem(event) {
  const itemID = event.target.parentNode.firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then((response) => {
      response.json().then((data) => createCartItemElement(data));
    });
}

    window.onload = () => {
  fetchML('computador');
 };

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

const addItensToSection = (items) => {
  items.forEach((item) => {
    const ItemElement = createProductItemElement(item); // item == product
    const section = document.querySelector('.items');
    section.appendChild(ItemElement);
  });
};

const fetchML = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => { // response traz todas as informações
      response.json().then((data) => {
        addItensToSection(data.results);
      });
    });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addItem(ItemsIDs) { // Início dos Requisitos 2 e 3
  return fetch(`https://api.mercadolibre.com/items/${ItemsIDs}`)
    .then((response) => response.json())
    .then((data) => data);
}

const addItemButton = () => {
  const items = document.querySelector('.items');
  items.addEventListener('click', async (click) => {
    if (click.target.className === 'item__add') {
      const element = click.target.parentElement;
      const id = getSkuFromProductItem(element);
      const returnAddItemsFunc = await addItem(id);
      const li = createCartItemElement(returnAddItemsFunc);
      document.querySelector('.cart__items').appendChild(li);
    }
  });
}; // Fim dos Requisitos 2 e 3

window.onload = () => {
  fetchML('computador');
  addItemButton();
};

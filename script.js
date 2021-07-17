const ol = document.querySelector('.cart__items');

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

function cartItemClickListener(event) {
  event.target.remove(); // (REQUISITO 3)
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// REQUISITO 2: =====================================

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const appendItem = ($ItemID) => {
  fetch(`https://api.mercadolibre.com/items/${$ItemID}`)
    .then((response) => {
      response.json().then((data) => {
        ol.appendChild(createCartItemElement(data));
      });
    });
};

const getProductId = (event) => {
  const getId = getSkuFromProductItem(event.target.parentNode); // para pegar o id    
  appendItem(getId);
};

const addToCart = () => {
  const addButton = document.querySelectorAll('.item__add');
  addButton.forEach((button) => {
    button.addEventListener('click', (getProductId));
  });
};

// REQUISITO 1: =====================================

const addItemsToSection = (items) => {
  items.forEach((item) => {
    const itemElement = createProductItemElement(item); //  item === produto
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
    addToCart();
  });
};

const fetchML = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => { //  response traz todas as informações
      response.json().then((data) => {
        console.log(data.results);
        addItemsToSection(data.results);
      });
    });
};

window.onload = () => {
  fetchML('computador');
};

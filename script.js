const fetchComputers = () => {
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => data.results); // retorno disso é um array
};

const fetchItemById = (itemID) => {
  return fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then((response) => response.json());
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

 function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  if (event.target.classList.contains('item__add')) {
    const cartItemsOl = document.querySelector('.cart__items');
    // const id = event.target.parentElement.firstElementChild.textContent;
    const id = getSkuFromProductItem(event.target.parentElement);
    console.log(id)
    fetchItemById(id)
      .then((object) => cartItemsOl.appendChild(createCartItemElement(object)));
  }
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const createItems = (section) => {
  fetchComputers()
    .then((arrayOfItems) => arrayOfItems
      .forEach((item) => section.appendChild(createProductItemElement(item))))
    .catch((error) => console.log(error));
};

document.addEventListener('click', cartItemClickListener);

window.onload = () => { 
  const itemsSection = document.querySelector('.items');
  createItems(itemsSection);
};

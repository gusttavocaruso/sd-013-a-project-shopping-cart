function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.id = sku;
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const deleteItem = (item) => {
  const products = document.querySelectorAll('li');
  const newObject = { items: [] };
  products.forEach((product) => {
    if (product.id !== item) newObject.items.push(product.textContent);
  });
  localStorage.setItem('items', JSON.stringify(newObject.items));
};

function cartItemClickListener(event) {
  event.target.remove();
  deleteItem(event.target.id);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.id = document.querySelectorAll('.cart__item').length;
  return li;
}

const results = (items) => {
  items.forEach((item) => {
    const element = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(element);
  });
};

const searches = (query) => {
  try {
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => response.json())
    .then((jsonBody) => {
      results(jsonBody.results);
    });
  } catch (error) {
    alert(error);
  }
};

const saveCar = () => {
  const list = { items: [] };
  document.querySelectorAll('li').forEach((item) => {
    list.items.push(item.textContent);
  });
  localStorage.setItem('items', JSON.stringify(list));
};

const addList = (e) => {
  fetch(`https://api.mercadolibre.com/items/${e.target.parentNode.id}`)
    .then((response) => response.json())
    .then((data) => {
      const newProduct = createCartItemElement(data);
      document.querySelector('.cart__items').appendChild(newProduct);
      saveCar();
    });
};

const loadLocalStorage = () => {
  const object = JSON.parse(localStorage.getItem('items'));
  Object.values(object).forEach((li) => {
    const newLi = document.createElement('li');
    newLi.textContent = li;
    newLi.addEventListener('click', cartItemClickListener);
    document.querySelector('.cart__items').appendChild(newLi);
  });
};

const clearList = () => {
  document.querySelectorAll('li').forEach((li) => li.remove());
  localStorage.clear();
};

window.onload = () => {
  if (Storage) {
    const object = JSON.parse(localStorage.getItem('items'));
    if (object) loadLocalStorage();
  }
  searches('computador');
  document.querySelector('.items').addEventListener('click', (e) => {
    if (e.target.className === 'item__add') addList(e);
  });

  document.querySelector('.empty-cart').addEventListener('click', clearList);
};

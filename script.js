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

const clearStorage = (ids) => {
  const products = document.querySelectorAll('li');
  const newProduct = { item: [] };
  products.forEach((product) => {
    if (product.id !== ids) newProduct.item.push(product.textContent);
  });
  localStorage.setItem('item', JSON.stringify(newProduct));
};

function cartItemClickListener(event) {
  event.target.remove();
  clearStorage(event.target.id);
}

const priceSum = (price) => {
  const getValue = document.querySelector('.h3');
  let concatenation = '';
  for (let index = 7; index < getValue.textContent.length; index += 1) {
    concatenation += getValue.textContent[index];
  }
  concatenation = Number(concatenation) + price;
  document.querySelector('.h3').remove();
  const newH3 = document.createElement('h3');
  newH3.className = 'h3';
  newH3.textContent = `Total $${concatenation}`;
  document.querySelector('.total-price').appendChild(newH3);
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.id = document.querySelectorAll('.cart__item').length;
  priceSum(salePrice);
  return li;
}

const addItensToSection = (items) => {
  items.forEach((item) => {
    const itemElement = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
  });
};

const fetchML = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => {
      response.json().then((data) => {
        addItensToSection(data.results);
      });
    });
};

const storageSave = () => {
  const listSave = { item: [] };
  document.querySelectorAll('.cart__item').forEach((li) => {
    listSave.item.push(li.textContent);
  });
  localStorage.setItem('item', JSON.stringify(listSave));
};

const addClick = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => {
      response.json().then((data) => {
        const newProduct = createCartItemElement(data);
        document.querySelector('.cart__items').appendChild(newProduct);
        storageSave();
      });
    });
};

const cache = () => {
  const object = JSON.parse(localStorage.getItem('item'));
  object.item.forEach((contentLi) => {
    const newLi = document.createElement('li');
    newLi.textContent = contentLi;
    newLi.addEventListener('click', cartItemClickListener);
    document.querySelector('.cart__items').appendChild(newLi);
  });
};

const clearList = () => {
  document.querySelectorAll('li').forEach((li) => li.remove());
  localStorage.clear();
};

const createTotal = () => {
  const section = document.createElement('section');
  section.className = 'total-price';
  const h3 = document.createElement('h3');
  h3.className = 'h3';
  h3.textContent = 'Total $0';
  document.querySelector('.cart').appendChild(section);
  document.querySelector('.total-price').appendChild(h3);
};

const addItemCart = () => {
  document.querySelector('.items')
    .addEventListener('click', (event) => {
      if (event.target.className === 'item__add') addClick(event.target.parentNode.id);
    });
};

window.onload = () => {
  addItemCart();
  createTotal();
  if (Storage) {
    const object = JSON.parse(localStorage.getItem('item'));
    if (object) cache();
  }
  fetchML('computador');
  document.querySelector('.empty-cart').addEventListener('click', clearList);
};

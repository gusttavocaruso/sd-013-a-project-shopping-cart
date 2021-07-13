const string = '.cart__items';

const saveListLocalStore = () => {
  const ol = document.querySelector(string);
  const html = ol.innerHTML;
  localStorage.setItem('lista', html); 
};

const sumItems = () => {
  const ol = document.querySelector(string);
  const olChildren = [...ol.children];
  const priceOl = olChildren.reduce((acc, li) => {
  let accumulator = acc;
  accumulator += Number(li.innerText.split('$')[1]);
  return accumulator;
  }, 0);
  return priceOl;
  };
  
  const pullDiv = () => {
  const div = document.querySelector('.total-price');
  div.innerText = `${Math.round(sumItems() * 100) / 100}`;
  }; 
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
  event.target.remove();
  saveListLocalStore();
  pullDiv();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemsToSection = (items) => {
  items.forEach((item) => {
    const itemElement = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
  });
};

const fetchML = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  .then((result) => { 
    result.json().then((data) => {
      addItemsToSection(data.results);
    });
  });
};

const fetchItemCart = (element) => {
  const elementPai = element.target.parentElement;
  const getId = getSkuFromProductItem(elementPai);
  fetch(`https://api.mercadolibre.com/items/${getId}`)
  .then((response) => {
    response.json()
    .then((data) => {
      const getLi = createCartItemElement(data);
      const olCart = document.querySelector(string);
      olCart.appendChild(getLi);
      saveListLocalStore();
      pullDiv();
    });
  });
};

const buttonItem = () => {
  const section = document.querySelector('.items');
  section.addEventListener('click', (element) => {
    if (element.target.className === 'item__add') {
      return fetchItemCart(element);
    }
  });
};

const getItem = () => {
  const ol = document.querySelector(string);
  ol.innerHTML = localStorage.getItem('lista');
  ol.addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') {
      cartItemClickListener(event);
    }
  });
};

window.onload = () => {
  fetchML('computador');
  buttonItem();
  getItem();
  pullDiv();
 };

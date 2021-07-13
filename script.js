const string = '.cart__items';

const salvar = () => {
  const ol = document.querySelector(string).innerHTML;
  localStorage.setItem('lista', ol);
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
  salvar();
}

const get = () => {
  const ol = document.querySelector(string);
  ol.innerHTML = localStorage.getItem('lista');
  ol.addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') {
    cartItemClickListener(event);
    }
  });
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createSectionObject(items) {
  items.forEach((item) => {
    const createItemElement = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(createItemElement);
  });
}

function fetchObject(query) {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => response.json()).then((data) => {
      createSectionObject(data.results);
    });
}

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
          salvar();
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

window.onload = () => {
  fetchObject('computador');
  buttonItem();
  get();
};
const cartItens = '.cart__items';

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

function priceAll() {
  const pricE = document.querySelector('.total-price');
  let price = 0;
  const AllLi = document.querySelectorAll('li');
  AllLi.forEach((item) => {
  const computer = item.innerText.split('$');
  price += Number(computer[1]);
  });
  pricE.innerHTML = `${(Math.round((price * 100)) / 100)}`;
}

const link = async (query) => {
  const api = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${query}`);
  const apJson = await api.json();
  const arrayResultsJson = apJson.results;
  arrayResultsJson.forEach((product) => document.querySelector('.items')
    .appendChild(createProductItemElement(product)));
};

const setItemsLocalStorage = () => {
  const ol = document.querySelector(cartItens);
  const text = ol.innerHTML;
  localStorage.setItem('cartList', '');
  localStorage.setItem('cartList', JSON.stringify(text));
};

function cartItemClickListener(event) {
  event.target.remove();
  priceAll();
}

const itensLocalStorage = () => {
  const getLocalStorage = JSON.parse(localStorage.getItem('cartList')); 
  const ol = document.querySelector(cartItens); 
  ol.innerHTML = getLocalStorage; 
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

const getCartComputer = async (id) => {
  const api = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const apiJson = await api.json();
  return apiJson;
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const buttonAdd = () => {
  const parent = document.querySelector('.items');
  parent.addEventListener('click', async (event) => {
    if (event.target.className === 'item__add') {
      const btParent = event.target.parentElement;
      const btId = getSkuFromProductItem(btParent);
      const btData = await getCartComputer(btId);
      const createComputer = createCartItemElement(btData);
      document.querySelector('.cart__items').appendChild(createComputer);
      setItemsLocalStorage();
      priceAll();
    }
  });
};

window.onload = () => {
  link('computador');
  buttonAdd();
  itensLocalStorage();
  priceAll();
};

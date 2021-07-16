const cartItems = '.cart__items';

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

function sumPrice() {
  const totalPrice = document.querySelector('.total-price');
  let price = 0;
  const itemsToSum = document.querySelectorAll('li');
  itemsToSum.forEach((item) => {
  const computer = item.innerText.split('$');
  price += Number(computer[1]);
  });
  totalPrice.innerHTML = `${(Math.round((price * 100)) / 100)}`;
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

const itemsLink = async () => {
  const loading = document.querySelector('.loading');
  const api = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const apiJson = await api.json();

  const resultsJson = apiJson.results;
  loading.remove();
  resultsJson.forEach((product) => document.querySelector('.items')
    .appendChild(createProductItemElement(product)));
};

const localItems = () => {
  const ol = document.querySelector(cartItems);
  const text = ol.innerHTML;
  localStorage.setItem('cartList', ''); 
  localStorage.setItem('cartList', JSON.stringify(text)); 
};

function cartItemClickListener(event) {
  event.target.remove();
  localItems(); 
  sumPrice(); 
}

const itemsStorage = () => {
  const createItem = JSON.parse(localStorage.getItem('cartList')); 
  const ol = document.querySelector(cartItems); 
  ol.innerHTML = createItem; 
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

const itemLink = async (id) => {
  const api = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const apiJson = await api.json();
  return apiJson;
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const addToCart = () => {
  const itemsChoose = document.querySelector('.items'); 
  itemsChoose.addEventListener('click', async (event) => {
    if (event.target.className === 'item__add') { 
      const buttonChoose = event.target.parentElement; 
      const buttonId = getSkuFromProductItem(buttonChoose);
      const buttonData = await itemLink(buttonId); 
      const productChoose = createCartItemElement(buttonData); 
      document.querySelector(cartItems).appendChild(productChoose); 
      localItems(); 
      sumPrice();
    }
  });
};

const removeItems = () => {
  const buttonRemove = document.querySelector('.empty-cart');
  buttonRemove.addEventListener('click', () => {
    const ol = document.querySelector(cartItems);
    while (ol.firstChild) {
      ol.removeChild(ol.firstChild);
      sumPrice();
      localItems();
    }
  });
};

window.onload = () => {
  sumPrice();
  itemsLink();
  itemsStorage();
  addToCart();
  removeItems();
};
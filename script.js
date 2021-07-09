const classTotalPice = 'total-price';

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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function loadingScreen() {
  const itemsElement = document.getElementsByClassName('items')[0];
  const divLoading = document.createElement('div');

  divLoading.className = 'loading';
  divLoading.style.fontSize = 44;

  itemsElement.appendChild(divLoading);
}

const fetchMainData = async (query) => {
  loadingScreen();

  try {
    const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
    return response.json();
  } catch (error) {
    alert(`Broken URL - ${error}`);
  }
};

const fillList = (data) => {
  document.getElementsByClassName('items')[0].innerHTML = '';

  data.results.forEach(({ id, title, thumbnail }) => {
    const object = {
      sku: id,
      name: title,
      image: thumbnail,
    };
    const product = createProductItemElement(object);
    document.getElementsByClassName('items')[0].appendChild(product);
  });
};

const getData = async () => {
  const data = await fetchMainData('computador');

  fillList(data);
};

function saveStatus() {
  const cartItems = document.getElementsByClassName('cart__items')[0];
  localStorage.setItem('cartData', cartItems.innerHTML);

  const totalPrice = document.getElementsByClassName(classTotalPice)[0];
  localStorage.setItem('totalPrice', totalPrice.innerHTML);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const updatePrice = (price, operation) => {
  const totalPriceElement = document.getElementsByClassName(classTotalPice)[0];
  let total = 0;

  if (operation === 'add') {
    total = Number(totalPriceElement.innerText) + Number(price);
  } else {
    total = Number(totalPriceElement.innerText) - Number(price);
  }

  totalPriceElement.innerText = (Math.round(total * 100) / 100);
};

function cartItemClickListener(event) {
  const element = event.target;
  const price = element.innerHTML.split('$')[1];

  event.target.remove();
  updatePrice(Number(price), 'remove');
  saveStatus();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');

  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

const fetchCartItem = async (id) => {
  try {
    const response = await fetch(`https://api.mercadolibre.com/items/${id}`);

    return response.json();
  } catch (error) {
    alert(`Broken URL - ${error}`);
  }
};

const fillCart = ({ title, price }, element) => {
  const object = {
    sku: getSkuFromProductItem(element.target.parentElement),
    name: title,
    salePrice: price,
  };
  const cartItem = createCartItemElement(object);

  document.getElementsByClassName('cart__items')[0].appendChild(cartItem);
  updatePrice(object.salePrice, 'add');
  saveStatus();
};

const addToCart = async (element) => {
  const id = getSkuFromProductItem(element.target.parentElement);
  const data = await fetchCartItem(id);

  fillCart(data, element);
};

function resetCart() {
  const totalPriceElement = document.getElementsByClassName(classTotalPice)[0];
  totalPriceElement.innerHTML = 0;

  const cartItems = document.getElementsByClassName('cart__items')[0];
  cartItems.innerHTML = '';

  saveStatus();
}

function loadCart() {
  const cartItems = document.getElementsByClassName('cart__items')[0];
  cartItems.innerHTML = localStorage.getItem('cartData');

  const cartArray = document.getElementsByClassName('cart__item');
  Array.prototype.forEach.call(cartArray, function (item) {
    item.addEventListener('click', cartItemClickListener);
  });

  const totalPrice = document.getElementsByClassName(classTotalPice)[0];

  if (localStorage.getItem('totalPrice')) {
    totalPrice.innerHTML = localStorage.getItem('totalPrice');
  } else {
    totalPrice.innerHTML = 0;
  }
}

window.onload = async () => {
  await getData();
  loadCart();

  const elements = document.getElementsByClassName('item__add');

  Array.prototype.forEach.call(elements, function (el) {
    el.addEventListener('click', addToCart);
  });

  document.getElementsByClassName('empty-cart')[0].addEventListener('click', resetCart);
};

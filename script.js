function saveCartItems() {
  const cartItems = document.querySelector('ol').innerHTML;
  localStorage.setItem('buys', cartItems);
}

function showLoader() {
  const loader = document.getElementById('load');
  loader.innerHTML = 'loading...';
  loader.style.display = 'block';
  loader.classList.add('loading');
}

function removeLoader() {
  document.getElementById('load').remove();
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  event.target.remove();
  saveCartItems();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  saveCartItems();
  return li;
}

const searchForId = async (idProduct = 'MLB1341706310') => {
  const response = await fetch(`https://api.mercadolibre.com/items/${idProduct}`);
  const datas = await response.json().then((data) => data);

  const cart = document.querySelector('.cart__items');
  cart.appendChild(createCartItemElement(datas));
  saveCartItems();

  return datas;
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCustomElement(element, className, innerText, event = false) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (event === true) {
    e.addEventListener('click', (i) => {
    searchForId(getSkuFromProductItem(i.target.parentElement));
    saveCartItems();
    });
  }
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', true));

  return section;
}

function creatorSection(items) {
  items.forEach((item) => {
    const itemElement = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
  });
}

const jsonProducts = async (item = 'computador') => {
  showLoader();
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`);
  const data = await response.json().then(({ results }) => results);
  await removeLoader();
  creatorSection(data);
  return data;
};

function loaderSaveCart() {
  const cartItems = document.querySelector('ol');
  const saveItems = localStorage.getItem('buys', cartItems);
  if (saveItems) {
    cartItems.innerHTML = saveItems;
  }
}

function clearCart() {
  const buttonCleaner = document.querySelector('.empty-cart');
  const cartList = document.querySelector('ol');
  buttonCleaner.addEventListener('click', () => {
    while (cartList.firstChild) {
      cartList.removeChild(cartList.firstChild);
    }
    saveCartItems();
  });
}
window.onload = () => {
  jsonProducts();
  loaderSaveCart();
  clearCart();
};
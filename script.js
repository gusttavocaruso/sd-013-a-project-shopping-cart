const cartItens = document.querySelector('ol.cart__items');

const fetchItem = (item, property = '') => 
   fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`)
  .then((response) => response.json())
  .then((data) => (property ? data[property] : data));

const getCartItemFetch = (itemID) => fetch(`https://api.mercadolibre.com/items/${itemID}`)
.then((response) => response.json())
.then(({ id, title, price }) => ({ sku: id, name: title, salePrice: price }));

function saveCart() {
  localStorage.setItem('cartItens', cartItens.innerHTML);
}

function emptyCartListener() {
  cartItens.innerHTML = '';
  saveCart();
}

function cartItemClickListener(event) {
  const thisCartItem = event.target;
  thisCartItem.parentNode.removeChild(thisCartItem);
  saveCart();
} 

function loadCart() {
  cartItens.innerHTML = localStorage.getItem('cartItens');
  cartItens.childNodes.forEach((item) => (item.addEventListener('click', cartItemClickListener)));
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener); 
  return li;
}

async function addItemListener(event) {
  const productItem = event.target.parentNode;
  const productItemID = getSkuFromProductItem(productItem);
  const fetchCartProductItem = await getCartItemFetch(productItemID);
  const cartProductItem = createCartItemElement(fetchCartProductItem);
  cartItens.appendChild(cartProductItem);
  saveCart();
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addButton.addEventListener('click', addItemListener);
  section.appendChild(addButton);

  return section;
}
const loading = createCustomElement('h1', 'loading', 'loading...');

const loadItensToPage = async (product, property) => {
  document.querySelector('body').prepend(loading); 
  const itens = await fetchItem(product, property);
  itens.forEach(({ id, title, thumbnail }) => {
    const itemSection = document.querySelector('.items');
    const item = createProductItemElement({ sku: id, name: title, image: thumbnail });
    itemSection.appendChild(item);
  });
  document.querySelector('body').removeChild(loading);
};

function eventHandler() {
  const clearCartBtn = document.querySelector('.empty-cart');
  clearCartBtn.addEventListener('click', emptyCartListener);
}

window.onload = () => { 
  // loadingItens(1);
  eventHandler();
  loadItensToPage('computador', 'results');
  loadCart();
  // loadingItens(0);
};

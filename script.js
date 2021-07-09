const sectionItems = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');
cartItems.innerHTML = localStorage.getItem('cartItems');
const p = document.querySelector('.total-price');
let total;
const totalSalvo = localStorage.getItem('totalPrice');
if (totalSalvo) {
  total = parseFloat(totalSalvo);
} else {
  total = 0;
}
p.innerHTML = total;
const clearButton = document.querySelector('.empty-cart');
const load = document.querySelector('.loading');
const ol = document.querySelector('.cart__items');
const listItem = document.querySelectorAll('.cart__item');

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
  const li = event.target;
  const items = document.querySelectorAll('.cart__item');
  ol.removeChild(li);
  const text = li.innerHTML;
  const price = parseFloat(text.split('$').pop());
  if (items.length === 1) total = price;
  total -= price;
  p.innerHTML = total; 
  localStorage.setItem('cartItems', ol.innerHTML);
  localStorage.setItem('totalPrice', total);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function fetchItem(event) {
  const parentItem = event.target.parentElement;
  const itemSKU = getSkuFromProductItem(parentItem);
  fetch(`https://api.mercadolibre.com/items/${itemSKU}`)
  .then((r) => r.json())
  .then((r) => {
    const cartItem = createCartItemElement(r);
    cartItems.appendChild(cartItem);
    localStorage.setItem('cartItems', cartItems.innerHTML);

    const text = cartItem.innerHTML;
    total += parseFloat(text.split('$').pop());
    p.innerHTML = total;
    localStorage.setItem('totalPrice', total);
  });
}

fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
.then((r) => r.json())
.then((r) => {
  sectionItems.removeChild(load);
  r.results.forEach((produto) => {
    const item = createProductItemElement(produto);
    sectionItems.appendChild(item);
    item.lastElementChild.addEventListener('click', fetchItem);
  });
});

const clearCart = () => {
  cartItems.innerHTML = '';
  localStorage.setItem('cartItems', cartItems.innerHTML);
  total = 0;
  p.innerHTML = total;
  localStorage.setItem('totalPrice', total);
};

clearButton.addEventListener('click', clearCart);

if (listItem.length > 0) {
  listItem.forEach((item) => item.addEventListener('click', cartItemClickListener));
}
// ol.addEventListener('click', cartItemClickListener);

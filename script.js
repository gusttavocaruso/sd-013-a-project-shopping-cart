const sectionItems = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');
const pTotal = document.querySelector('.total-price');
cartItems.innerHTML = localStorage.getItem('cartItems');
pTotal.innerHTML = localStorage.getItem('totalPrice');
const clearButton = document.querySelector('.empty-cart');
let total = 0;
const load = document.querySelector('.loading');

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
  const ol = document.querySelector('.cart__items');
  ol.removeChild(li);
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
    pTotal.innerHTML = total;
    // parseFloat(price.toFixed(2))
    // console.log(total);
    localStorage.setItem('totalPrice', pTotal.innerHTML);
  });
}

fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
.then((r) => r.json())
.then((r) => {
  sectionItems.removeChild(load);
  // console.log(r.results);
  r.results.forEach((produto) => {
    const item = createProductItemElement(produto);
    sectionItems.appendChild(item);
    item.lastElementChild.addEventListener('click', fetchItem);
  });
});

const clearCart = () => {
  cartItems.innerHTML = '';
  localStorage.setItem('cartItems', cartItems.innerHTML);
  pTotal.innerHTML = 'Preço total: $0';
  localStorage.setItem('totalPrice', pTotal.innerHTML);
};

clearButton.addEventListener('click', clearCart);

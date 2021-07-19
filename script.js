// Queria agradecer aos trybees, em especial Matheus Duarte pela força ^^!
//= ============= Variáveis globais ==============
const getCart = document.querySelector('.cart__items');
const getDelButton = document.querySelector('.empty-cart');
const getTotalPrice = document.querySelector('.totalPrice')
//= =============                   ==============

//= ============= Começo do código ==============
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function saveCart() {
  const getCart = document.querySelector('.cart__items');
  localStorage.setItem('produtosSalvos', getCart.innerHTML);
}

function restoreCart() {
  const getCart = document.querySelector('.cart__items');
  getCart.innerHTML = localStorage.getItem('produtosSalvos');
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function cartItemClickListener(event) {
  const deleteThisIl = event.target.remove();
  saveCart();
}

function deleteAllCart() {
  getCart.innerHTML = '';
  saveCart();
}

getDelButton.addEventListener('click', (deleteAllCart));

getCart.addEventListener('click', (cartItemClickListener))

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const getCart = document.querySelector('.cart__items');
  getCart.appendChild(li);
}

const setItemOnCart = async (itemId) => {
  try {
    const product = await (await fetch(`https://api.mercadolibre.com/items/${itemId}`)
    ).json();
      createCartItemElement(product);
  } catch (Error) {
    alert(Error);
  }
  saveCart();
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const items = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.lastElementChild.addEventListener('click', (callback) => {
    const getId = callback.target.parentElement.firstElementChild.innerHTML;
    setItemOnCart(getId);
  });

  items.appendChild(section);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function getSiteApi() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((result) => {
 result.json()
    .then((another) => another.results.forEach((element) => {
      createProductItemElement(element);
    }));
  })
    .catch(() => console.log('Error'));
}

window.onload = () => { 
  getSiteApi(); 
  restoreCart();
};

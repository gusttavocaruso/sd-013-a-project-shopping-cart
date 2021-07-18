const cartContainer = document.querySelector('.carrinho');
const cartVal = () => document.querySelector('.total-price');

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

function cartItemClickListener(event) {
  const item = event.target.innerHTML.split(' ');
  const value = item[item.length - 1].replace('$', '');
  const newVal = parseFloat(cartVal().innerHTML) - parseFloat(value);
  cartVal().innerHTML = Math.round(newVal * 100) / 100;
  event.target.remove();
  localStorage.cart = cartContainer.innerHTML;
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Req 6
const cleanCart = () => {
  document.querySelector('.cart__items').innerHTML = null;
  cartVal().innerHTML = '0';
  localStorage.cart = cartContainer.innerHTML;
};

const clearCart = document.querySelector('button.empty-cart');
clearCart.addEventListener('click', cleanCart);

// Req 2, 4, 5 e 7
const addToCart = (item) => {
  const cart = document.querySelector('.cart__items');
  cart.appendChild(createCartItemElement(item));
  const newVal = parseFloat(cartVal().innerHTML) + parseFloat(item.price);
  cartVal().innerHTML = Math.round(newVal * 100) / 100;
  localStorage.cart = cartContainer.innerHTML;
};

const getItem = async (e) => {
  const item = e.target.parentElement;
  const sku = item.firstChild.innerHTML;
  const itemJson = await (await fetch(`https://api.mercadolibre.com/items/${sku}`)).json();
  addToCart(itemJson);
};

// Req 1
const createProductList = (arr) => {
  const sectionItems = document.querySelector('.items');
  sectionItems.innerHTML = null;
  arr.forEach((i) => {
    const newObj = { sku: i.id, name: i.title, image: i.thumbnail };
    sectionItems.appendChild(createProductItemElement(newObj));
  });
  const addButtons = document.querySelectorAll('.item__add');
  addButtons.forEach((i) => i.addEventListener('click', getItem));
};

// Código tratando erro diretamenta na função:
const fetchML = async () => {
  const SEARCH_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  try {
    const response = await fetch(SEARCH_URL);
    if (!response.ok) {
      throw new Error('Couldnt fetch API');
    }
    const json = await response.json();
    createProductList(json.results);
  } catch (e) {
    console.error(e);
  }
};

// Código tratando erro junto da execução (linha 122):
// const fetchML = async () => {
//   const SEARCH_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
//   const response = await fetch(SEARCH_URL);
//   if (!response.ok) {
//     throw new Error(`Couldnt fetch API`)
//   }
//   const json = await response.json();
//   createProductList(json.results);
// };

// Executores
fetchML();
  // .catch(e => {console.error(e)})

if (localStorage.cart) {
  cartContainer.innerHTML = localStorage.cart;
  document.querySelectorAll('.cart__item').forEach((i) => {
    i.addEventListener('click', cartItemClickListener);
  });
}

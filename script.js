const ol = document.querySelector('.cart__items');

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

const updateLocalStorage = (item) => {
  localStorage.cart = item;
};

function cartItemClickListener(event) {
  event.target.remove();
  updateLocalStorage(ol.innerHTML);
  // const ol = document.querySelector('.cart__items');
  // const li = document.querySelector()
  // ol.removeChild(li);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  ol.appendChild(li);
  updateLocalStorage(ol.innerHTML);   
}

const fetchCartItem = async (item) => {
  const fetch2 = await fetch(`https://api.mercadolibre.com/items/${item}`);
  const fetchedCartItem = await fetch2.json();
  createCartItemElement(fetchedCartItem);
};
 
const getCartItemID = (event) => {
  const id = event.target.parentElement.firstChild.innerText;
  fetchCartItem(id);
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addButton.addEventListener('click', getCartItemID);
  section.appendChild(addButton);
  return section;
}

// const appendProduct = (product) => {
//   const itemsSection = document.getElementsByClassName('items');
//   itemsSection.appendChild(createProductItemElement(product));
// };

const fetchProductAsync = async (query) => {
  const fetch2 = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const jsonFetch = await fetch2.json();
  const resultado = jsonFetch.results;
  resultado.forEach((product) => {
    document.querySelector('.items').appendChild(createProductItemElement(product));    
  });
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// const emptyCartClickListener = () => {

// };

// const emptyCart = () => {
//   const emptyCartButton = document.querySelector('.empty-cart');
//   emptyCartButton.addEventListener('click', emptyCartClickListener);
// };

// window.onload = () => {
  fetchProductAsync('computador');
  if (localStorage.cart) {
    ol.innerHTML = localStorage.cart;
    document.querySelectorAll('.cart__items').forEach((item) => {
      item.addEventListener('click', cartItemClickListener);
    });
  }
  
// };

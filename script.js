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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const saveLocalStorage = () => {
  const cartItems = document.querySelector('.cartItems');
  localStorage.setItem('cartItems', cartItems.innerHTML);
};

const getItemLocalStorage = () => {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = localStorage.getItem('cartItems');
  cartItems.addEventListener('click', (event) => {
    event.target.remove();
    saveLocalStorage();
  });
};

function cartItemClickListener(event) {
  event.target.remove();
  saveLocalStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchAPI = async (product) => {
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
   await fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
       data.results.forEach((item) => {
        const itemsSection = document.querySelector('.items');
        itemsSection.appendChild(createProductItemElement(item));
      });
    });
 };

const fetchItems = () => {
  const getButtons = document.querySelectorAll('.item__add');
  getButtons.forEach((button) => {
    button.addEventListener(('click'), (event) => {
      const itemId = event.target.parentNode.firstChild.innerText;
      const API_ITEM = `https://api.mercadolibre.com/items/${itemId}`;
      fetch(API_ITEM)
      .then((response) => response.json()
      .then((data) => {
        const cartItems = document.querySelector('.cart__items');
        cartItems.appendChild(createCartItemElement(data));
        saveLocalStorage();
      }));
    });
  });
};

const emptyCart = () => {
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', () => {
    const cartItems = document.querySelector('.cartItems');
    cartItems.innerHTML = '';
    localStorage.removeItem('cartItems');
  });
};

window.onload = async () => {
  await fetchAPI('computador');
  fetchItems();
  getItemLocalStorage();
  emptyCart();
};

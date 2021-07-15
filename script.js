const cart = document.querySelector('.cart__items');
const buttonClean = document.querySelector('.empty-cart');
const loading = document.querySelector('.loading');

// https://developer.mozilla.org/pt-BR/docs/Web/API/Storage
function set() {
  localStorage.setItem('Items', cart.innerHTML);
}

function get() {
  cart.innerHTML = localStorage.getItem('Items');
}

const clean = () => {
  cart.innerHTML = '';
  set();
};

buttonClean.addEventListener('click', clean);

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  event.target.remove();
  set(); // Requisito 4
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addCart = (event) => {
  const skuId = event.target.parentNode.firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${skuId}`)
    .then((response) => {
        response.json().then((data) => {
        // console.log(data);
        const cartItem = createCartItemElement(data);
        const cartItems = document.querySelector('.cart__items');
        cartItems.appendChild(cartItem);
        set();
      });
    });
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') { // Monitoria Zezé
    e.addEventListener('click', addCart);
  }
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
//   return item.querySelector('span.item__sku').innerText; // captura id do elemento
// }

const addItemsToSection = (items) => {
  items.forEach((item) => {
    const itemElement = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
  });
  loading.remove(); 
};

const fetchML = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => {
      response.json().then((data) => {
        addItemsToSection(data.results);
      });
    });
};

window.onload = () => {
fetchML('computador');
get();
};

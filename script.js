const cart = document.querySelector('.cart__items');

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

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

const eraseLoading = () => {
  const divLoading = document.querySelector('.loading');
  divLoading.remove();
};

const saveData = () => {
  localStorage.setItem('texto', cart.innerHTML);
};

const totalPrice = () => {
  const captureDiv = document.querySelector('.total-price');
  let prices = 0;
  cart.childNodes.forEach((item) => {
    const price = parseFloat(item.innerHTML.split('$')[1]);
    prices += price;
  });
  captureDiv.innerText = prices;
};

const cartItemClickListener = (event) => {
  event.target.remove();
  saveData();
  totalPrice();
};
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(li); 
  saveData();
  totalPrice();
  return li;
}

const addItemsToSection = (items) => {
  items.forEach((item) => {
    const itemElement = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
  });
  };

  // Requisito 2 Feito com ajuda do Olávio Timóteo
const fetchProduct = (event) => {
  const itemId = event.target.parentNode.firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
  .then((response) => {
    response.json().then((data) => {
      createCartItemElement(data);
      eraseLoading();
    });
  });
};

const Buttons = () => {
  const allButton = document.querySelectorAll('.item__add');
  allButton.forEach((button) => button.addEventListener('click', fetchProduct));
};
  // Requisito 1 feito pela aula do Tio Jack
const fetchML = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  .then((response) => {
    response.json().then((data) => {
      addItemsToSection(data.results);
      Buttons();
      eraseLoading();
    });
  });
};

const loadData = () => {
  cart.innerHTML = localStorage.getItem('texto');
};

const emptyCart = () => {
  const empty = document.querySelector('.empty-cart');
  empty.addEventListener('click', () => {
    cart.innerHTML = '';
  });
};

const loading = () => {
  const divLoading = document.querySelector('.loading');
  divLoading.innerText = 'loading';
};

window.onload = () => {
  loading();
  fetchML('computador');
  loadData();
  emptyCart();
 };
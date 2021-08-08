const cartItems = '.cart__items';
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
  event.target.remove();
  localStorage.setItem('cartItems', document.querySelector(cartItems).innerHTML);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const addItemToList = (items) => {
  items
    .forEach((item) => {
      const createdProdItem = createProductItemElement(item); //  chama a função que cria um elemento
      const sectionItems = document.querySelector('.items'); // seleciona a seção onde os itens irão ser inseridos

      sectionItems.appendChild(createdProdItem);
    });
};

const fetchML = (query) => {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;

  fetch(url)
    .then((response) => response.json()) // response materializa as informações buscadas no fetch
    .then((productData) => {
      addItemToList(productData.results); 
    }); // esse then realiza algo em cima do que foi trago no response
};

const addItemToCart = (item) => {
  const carrinho = document.querySelector(cartItems);
  const createdItemComponents = createCartItemElement(item);
  carrinho.appendChild(createdItemComponents);
};

const requestEndpointOnItemClick = () => {
  const section = document.querySelector('.items');

  section.addEventListener('click', async (event) => {
    if (event.target.className === 'item__add') {
      const buttonParent = event.target.parentElement;
      const idFromProduct = getSkuFromProductItem(buttonParent);
      const fetchObj = await fetch(`https://api.mercadolibre.com/items/${idFromProduct}`)
        .then((response) => response.json());
      
      addItemToCart(fetchObj);
      localStorage.setItem('cartItems', document.querySelector(cartItems).innerHTML);
    }
  });
};

const getLocalStorage = () => {
  const myCart = document.querySelector(cartItems);
  myCart.innerHTML = localStorage.getItem('cartItems');
  myCart.addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') {
      cartItemClickListener(event);
    }
  });
};
window.onload = () => {
  fetchML('computador');
  requestEndpointOnItemClick();
  getLocalStorage();
};

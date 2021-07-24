const olCart = document.querySelector('.cart__items');

const btnClear = document.querySelector('.empty-cart');

// exclui items do carrinho - ajuda do Emanoel

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

// requisito 4 concluido com a ajuda do Emanoel da tribo 13 A
const saveCart = () => {
  localStorage.setItem('productSave', olCart.innerHTML);
};

const getCartSave = () => {
  olCart.innerHTML = localStorage.getItem('productSave');
};

function removeItemCarts() {
  olCart.innerHTML = '';
  saveCart();
}

btnClear.addEventListener('click', () => {
  removeItemCarts();
});
// Pego por parametro a <li> clicada, crio a const ol que tem a classe cart__items, depois removo a <li> que foi clicada. 
function cartItemClickListener(event) {
  event.target.remove();
  saveCart();
}

olCart.addEventListener('click', (cartItemClickListener));

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  const ol = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  ol.appendChild(li);
  li.addEventListener('click', cartItemClickListener);
  saveCart();
  return li;
}

//  fetch para adiciona o produto ao carrinho
const addCartFetch = (query) => {
  fetch(`https://api.mercadolibre.com/items/${query}`)
  .then((response) => response.json())
  .then((data) => createCartItemElement(data));
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(button);
  button.addEventListener('click', () => {
    addCartFetch(sku);
  });
  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

// aprendi com o fechamento de hoje dia 8 de julho com o tio Jack
const productComponent = (items) => {
  items.forEach((item) => {
    const productItem = createProductItemElement(item);
    const sectionItem = document.querySelector('.items');
    sectionItem.appendChild(productItem);
  });
};

const fetchML = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => {
      response.json().then((data) => {
        productComponent(data.results);
      });
    });
};

window.onload = () => {
  fetchML('computador');
  getCartSave();
};
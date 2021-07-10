// const cartItems = document.querySelector('.cart__items');
// const clearCartBtn = document.querySelector('.empty-cart');
// const addToCartBtn = document.querySelector('.item__add');

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
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const newOl = document.querySelector('.cart__items');
  newOl.appendChild(li);

  return li;
}

// Requisito 1 feito com a ajuda do Jack no fechamento do dia do projeto.
const addItems = (items) => {
  items.forEach((item) => {
    const itemElement = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
  });
};

const fetchComputer = () => {
  const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(URL)
    .then((response) => {
      response.json().then((data) => {
        addItems(data.results);
      });
    });
 };

 // Requisito 2 resolvido com a ajuda de Matheus Macedo.
 const fetchItemId = (element) => {
  const parentElem = element.target.parentElement;
  const idSku = getSkuFromProductItem(parentElem);
  fetch(`https://api.mercadolibre.com/items/${idSku}`)
  .then((response) => { 
    response.json()
    .then((data) => {
      const addLi = createCartItemElement(data);
      const getOl = document.querySelector('.cart__items');
      getOl.appendChild(addLi);
    });
  });
};

const buttonAdd = () => {
  const section = document.querySelector('.items');
  section.addEventListener('click', (element) => {
    if (element.target.className === 'item__add') {
      fetchItemId(element);
    }
  });
};

// clearCartBtn.addEventListener('click', () => {
//   cartItems.innerHTML = '';
// })

window.onload = () => {
  fetchComputer();
  buttonAdd();
};

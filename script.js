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

const savedCart = () => {
  const carStore = cart.innerHTML;
  localStorage.setItem('car', carStore);
};

const getCartStored = () => {
  // const carStore = localStorage.getItem('car');
  if (cart.innerHTML !== null) {
    cart.innerHTML = localStorage.getItem('car');
  }
};

function cartItemClickListener(event) {
  if (event.target.className === 'cart__item') {
  event.target.remove();
  savedCart();
  }
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  cart.appendChild(li);
  return li;
}

// desafio 2 feito com ajuda do Matheus Duarte e Rogério Silva
const addItemCartShopp = async (id) => {
  try {
    const promiseId = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const dataId = await promiseId.json();
    // console.log(dataId);
    // const resultId = dataId.results;
    createCartItemElement(dataId);
    savedCart();
  } catch (error) {
    console.log(error);
  }
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.lastElementChild.addEventListener('click', (event) => {
    addItemCartShopp(event.target.parentElement.firstElementChild.innerText);
  });
  // cart.appendChild(section);
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const addItems = (items) => {
  items.forEach((item) => {
    const itemHTML = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(itemHTML);
  });
};

// refatorado com ajuda do Rogério.
const getProductPromise = async (product) => {
  try {
  const promise = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`);
  const data = await promise.json();
  const result = data.results;
  addItems(result);
  // console.log(result);
  } catch (erro) {
  alert(erro);
  }
};

cart.addEventListener('click', cartItemClickListener);

window.onload = () => {
  getProductPromise('computador');
  getCartStored();
};

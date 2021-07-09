// const fetch = require('node-fetch');
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

const setItemsLocalStorage = () => {
  const ol = document.querySelector(cartItems);
  const text = ol.innerHTML;
  localStorage.setItem('cartList' , '');
  localStorage.setItem('cartList', JSON.stringify(text))
}


// feito com a ajuda do aluno Thalles (renomear os parametros da desestruturacao)
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// 1 
const getJsonOnLink = async (query) => {
  const api = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${query}`);
  const apiJson = await api.json();
  const arrayResultsJson = apiJson.results;
  arrayResultsJson.forEach((product) => document.querySelector('.items')
    .appendChild(createProductItemElement(product)));
};

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) { // desestruturando
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Função criada (PASSO 1)
// Objetivo: Acessar cada link único de cada computador da API

const getCartComputer = async (id) => {
  const api = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const apiJson = await api.json();
  return apiJson;
};

// Função já existente no projeto
// Objetivo:

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Função criada (PASSO 2)
// Objetivo: selecionar o botão do 'Adicionar ao carrinho' e criar um evento de click que cria uma lista

const buttonAddCart = () => {
  const parent = document.querySelector('.items');
  parent.addEventListener('click', async (event) => {
    if (event.target.className === 'item__add') {
      const buttonParent = event.target.parentElement;
      const buttonId = getSkuFromProductItem(buttonParent);
      const buttonData = await getCartComputer(buttonId);
      const createComputer = createCartItemElement(buttonData);
      document.querySelector(cartItems).appendChild(createComputer);
      setItemsLocalStorage();
    }
  });
};
 

window.onload = () => {
  getJsonOnLink('computador');
  buttonAddCart();
  const getLocalStorage = JSON.parse(localStorage.getItem('.cart__items')); // o parse pega a string que transformei la em cima (armazenada) e retorna os dados no formato correto
  if (getLocalStorage !== null) {
    const ol = document.querySelector(cartItems);
    ol.innerHTML = getLocalStorage;  // pega o ol e joga todos os dados aqui
  }
};
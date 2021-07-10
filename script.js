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
  localStorage.setItem('cartList', '');
  localStorage.setItem('cartList', JSON.stringify(text));
};

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

// requisito 5

function totalPrice() {
  const getTotalPrice = document.querySelector('.total-price');
  let price = 0;
  const AllLi = document.querySelectorAll('li');
  AllLi.forEach((item) => {
  const computer = item.innerText.split('$');
  price += Number(computer[1]);
  });
  getTotalPrice.innerHTML = `${(Math.round((price * 100)) / 100)}`;
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
  setItemsLocalStorage(); // chamando a função do requisito 4
  totalPrice();
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
  const parent = document.querySelector('.items'); // acessamos a classe que possui os 50 computadores
  parent.addEventListener('click', async (event) => {
    if (event.target.className === 'item__add') { // se o click no botão do Add carrinho for feito
      const buttonParent = event.target.parentElement; // acessando o pai do botão pq temos uma função que pega o ID do computador
      const buttonId = getSkuFromProductItem(buttonParent);
      const buttonData = await getCartComputer(buttonId); // acessa o link de cada computador
      const createComputer = createCartItemElement(buttonData); // cria no formato id, nome e preço as lis de acordo com os dados do json que foram específicados na função createCartItemElement
      document.querySelector(cartItems).appendChild(createComputer); // tornamos o retorno no formato especificado na createCartItemElement um filho de onde devem aparecer essas lis
      setItemsLocalStorage(); // chamando a função do requisito 4
      totalPrice();
    }
  });
};

const getItemsLocalStorage = () => {
  const getLocalStorage = JSON.parse(localStorage.getItem('cartList')); // recupera o item criado no requisito 4
  const ol = document.querySelector(cartItems); // pegar onde tem os itens
  ol.innerHTML = getLocalStorage; // e colocar os itens que já tinham sido salvos
  ol.addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') {
      cartItemClickListener(event);
    }
  });
};

window.onload = () => {
  getJsonOnLink('computador');
  buttonAddCart();
};
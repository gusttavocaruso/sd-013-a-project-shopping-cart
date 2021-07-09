// const fetch = require('node-fetch');
const classNameOl = '.cart__items';

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
// ===========================================================================================
// Requisito 1 - Crie uma listagem de produtos
// ===========================================================================================
// Recupera array Results do JSON e puxa a função createProductItem para adicioná-los ao HTML 
const fetchComputers = async () => {
  const fetchAPI = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const getJson = await fetchAPI.json();
  const resultsJson = getJson.results;
  resultsJson.forEach((element) => {
    document.querySelector('.items').appendChild(createProductItemElement(element));
  });
};
// ===========================================================================================
// Requisito 4 - Carregue o carrinho de compras através do LocalStorage ao iniciar uma página
// Função que salva dados no LocalStorage
// ===========================================================================================
const salveLocalStorage = () => {
  const recoverOl = document.querySelector(classNameOl);
  const OlText = recoverOl.innerHTML;
  localStorage.setItem('products', '');
  localStorage.setItem('products', JSON.stringify(OlText));
};

// ===========================================================================================
// Requisito 5 - Função que salva dados no LocalStorage
// ===========================================================================================
const salveSumLocalStorage = () => {
  const recoverSpanPrice = document.querySelector('.price');
  const spanText = recoverSpanPrice.innerHTML;
  localStorage.setItem('totalPrice', '');
  localStorage.setItem('totalPrice', JSON.stringify(spanText));
};

// ===========================================================================================
// Requisito 5 - Some o valor total dos itens do carrinho de compras de forma assíncrona
// Requisito feito em grupo com as meninas da tribo A
// ===========================================================================================
// Toda vez que essa função for chamada, ela vai buscar os Lis, transformar no array e somar.
const totalPrice = () => {
  const getSectionFather = document.querySelector('.price'); // recupera span filho, onde vai ser colocado o texto
  let price = 0;
  const getAllLis = document.querySelectorAll('li');
  getAllLis.forEach((item) => {
  const computerItem = item.innerText.split('$');
  price += Number(computerItem[1]);
  });
  getSectionFather.innerHTML = `$${(Math.round((price * 100)) / 100)}`;
  salveSumLocalStorage();
};

// ===========================================================================================
// Requsito 6 - Função que remove tudo do carrinho de compras.
// ===========================================================================================
const removeAll = () => {
  const recoverLiProducts = document.querySelectorAll('.cart__item');
  recoverLiProducts.forEach((element) => element.remove());
};

// ===========================================================================================
// Requsito 3 - Remova o item do carrinho de compras ao clicar nele
// Requisito feito em grupo com as meninas da tribo A
// ===========================================================================================
function cartItemClickListener(event) { // a função já recebe o evento como parâmetro, então a partir do event.target (onde foi clicado), usa o método remove();
  event.target.remove();
  totalPrice();
  salveLocalStorage();
}

// ===========================================================================================
// Requisito 2 - - pesquisa o produto ao carrinho de compras
// Requisito feito em grupo com as meninas da tribo A
// ===========================================================================================
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// ===========================================================================================
// Função assíncrona que recupera o JSON da AP do mercado livre, a partir do ID do produto clicado
// Parte do requisito 2 e 6
// ===========================================================================================
const apiMl = async (id) => {
  const fetchId = await fetch(`https://api.mercadolibre.com/items/${id}`); // joga a resposta do fetch na const (objeto grande)
  const jsonId = await fetchId.json(); // joga o objeto Json na variável
  return jsonId;
};

const buttonEvent = () => {
  const fatherOfAll = document.querySelector('.container'); // recupera a section pai de todas as outras sections, com classe "items";
  fatherOfAll.addEventListener('click', async (event) => { // adiciona o evento na section pai de todos. 
    if (event.target.className === 'item__add') { // o evento só é disparado se o clique (event.target) for feito no objeto com classe 'item__add' (botões).
      const btnFather = event.target.parentElement; // recupera o pai do botão (section) para jogar na função getSkuFromProductItem (que recupera o ID);
      const btnId = getSkuFromProductItem(btnFather); // função que recupera o ID
      const getJsonApi = await apiMl(btnId); // função que recupera o JSON do API do Mercado Livre. 
      const createLiProduct = createCartItemElement(getJsonApi); // a função createCartItemElement cria uma Li a partir dos dados do Json e adiciona um evento a cada uma delas. 
      document.querySelector(classNameOl).appendChild(createLiProduct); // adiciona o li criado anteriormente como filho do elemento <ol class="cart__items">.
      salveLocalStorage();
      totalPrice();
    }

    if (event.target.className === 'empty-cart') { // se o botão "esvaziar carrinho for clicado"
      removeAll();
      salveLocalStorage();
      totalPrice();
    }
  });
};

// ===========================================================================================
// window.onload
// ===========================================================================================

window.onload = () => {
  fetchComputers();
  buttonEvent();
  const recoverLocalStorage = JSON.parse(localStorage.getItem('products'));
  const recoverSumLocalStorage = JSON.parse(localStorage.getItem('totalPrice'));
  if (recoverLocalStorage !== null) {
    const recoverOl = document.querySelector(classNameOl);
    recoverOl.innerHTML = recoverLocalStorage;
  }
  if (recoverSumLocalStorage !== null) {
    const recoverSpan = document.querySelector('.price');
    recoverSpan.innerHTML = recoverSumLocalStorage;
  }
};
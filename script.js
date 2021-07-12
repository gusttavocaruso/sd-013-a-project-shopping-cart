/* const fetch = require("node-fetch"); */
const CARRINHO = '.cart__items';
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function turnOnLoading() {
  const loader = document.createElement('h1');
  loader.className = 'loading';
  document.querySelector('.container').appendChild(loader);
}

function turnOffLoading() {
  const loader = document.querySelector('.loading');
  document.querySelector('.container').removeChild(loader);
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

function listarProdutos(produtos) {
  produtos.forEach((produto) => {
    const items = document.querySelector('.items');
    const produtoAdicionado = createProductItemElement(produto);
    items.appendChild(produtoAdicionado);
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function sumPrices() {
  const itemsCarrinho = document.querySelectorAll('.cart__item');
  const preçoTotal = document.querySelector('#sum');
  let total = 0;
  itemsCarrinho.forEach((item) => {
    const preço = item.innerText.split('PRICE: $')[1];
    total += parseInt(preço, 10);
  });
  preçoTotal.innerText = total;
}

function setCleanCart() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    const carrinho = document.querySelector(CARRINHO);
    carrinho.innerHTML = '';
    sumPrices();
  });
}

function saveCart() {
  const carrinho = document.querySelector(CARRINHO);
  const carrinhoHTML = carrinho.innerHTML;
  localStorage.setItem('carrinhoSalvo', carrinhoHTML);
}

function cartItemClickListener(event) {
  const carrinho = document.querySelector(CARRINHO);
  carrinho.removeChild(event.target);
  saveCart();
  sumPrices();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event));
  return li;
}

function setLoadedItems() {
  const itemsCarrinho = document.querySelectorAll('.cart__item');
  itemsCarrinho.forEach((item) =>
   item.addEventListener('click', (event) => cartItemClickListener(event)));
}

function loadList() {
  const carrinho = document.querySelector(CARRINHO);
  const savedCarrinho = localStorage.getItem('carrinhoSalvo');
  if (savedCarrinho !== undefined) {
    carrinho.innerHTML = savedCarrinho;
  }
  setLoadedItems();
}

async function adicionarAoCarrinho(produto) {
  const carrinho = document.querySelector(CARRINHO);
  const produtoParaCarrinho = createCartItemElement(produto);
  carrinho.appendChild(produtoParaCarrinho);
  saveCart();
}

function fetchAddToCart(id) {
  turnOnLoading();
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => {
      response.json().then(((data) => {
        turnOffLoading();
        adicionarAoCarrinho(data);
      })).then(sumPrices);  
    });
}

function setBotoesAdicionarCarrinho() {
  const botoes = document.querySelectorAll('.item__add');
  botoes.forEach((botao) => botao.addEventListener('click', () => {
    const produtoID = botao.parentNode.firstChild.innerText;
    fetchAddToCart(produtoID);
  }));
}

function fetchMercadoLivre(productName) {
  if (productName === 'computer') {
    turnOnLoading();
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${productName}`)
      .then((response) => {
        response.json().then((jsonItens) => jsonItens.results)
        .then((data) => {
          turnOffLoading();
          listarProdutos(data);
          setBotoesAdicionarCarrinho();
        });
      });
  }
}

window.onload = () => { 
  fetchMercadoLivre('computer');
  loadList();
  setCleanCart();
};

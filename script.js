/* const fetch = require("node-fetch"); */
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

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function adicionarAoCarrinho(produto) {
  const carrinho = document.querySelector('.cart__items');
  const produtoParaCarrinho = createCartItemElement(produto);
  carrinho.appendChild(produtoParaCarrinho);
}

function fetchAddToCart(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => {
      response.json().then(((data) => adicionarAoCarrinho(data)));
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
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${productName}`)
      .then((response) => {
        response.json().then((jsonItens) => jsonItens.results)
        .then((data) => {
          listarProdutos(data);
          setBotoesAdicionarCarrinho();
        });
      });
  }
}

window.onload = () => { 
  fetchMercadoLivre('computer'); 
};

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function currentValue() {
  return document.querySelector('.total-price');
}

function cartItems() {
return document.querySelector('.cart__items');
}

function addToStorage() {
  const wholeCart = document.querySelector('.cart');
  localStorage.cart = wholeCart.innerHTML;
}

function emptyCart() {
  // Busca o botão de esvaziar carrinho
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', () => {
    // Busca o ol que contém todos os itens do carrinho para zerar o innerHTML
    const cart = cartItems();
    cart.innerHTML = null;
    // Busca o valor atual para depois zerá-lo
    const cartValue = currentValue();
    cartValue.innerHTML = '0';
    addToStorage();
  });
}

function shoppingCartValue(itemPrice) {
  // Busca o elemento que tem o valor do momento através da classe
  const current = currentValue();
  // Transforma o número extraído em uma Float
  const floatcurrent = parseFloat(current.innerText);
  // Soma os valores e arredonda
  const totalAmount = Math.round((itemPrice + floatcurrent) * 100) / 100;
  // Coloca o valor somado como novo texto
  current.innerHTML = totalAmount;
  addToStorage();
}

function cartItemClickListener(event) {
  // Pega o texto do elemento removido
  const itemText = event.target.innerText;
  // Verifica onde começa o texto abaixo
  const indexOfPrice = itemText.indexOf('PRICE: $');
  // Cria uma string que começa após o price e vai até o fim, desta maneira equivalente ao valor do produto
  const stringToSubtract = itemText.substring((indexOfPrice + 8), (itemText.length));
  const valueToSubtract = parseFloat(stringToSubtract);
  // Pega o elemento pai do elemento clicado
  const father = event.target.parentNode;
  // Remove o filho clicado do elemento pai, que foi buscado acima
  father.removeChild(event.target);
  // Inova a função de valor do carrinho de compras para remover valor do produto
  shoppingCartValue(-valueToSubtract);
  addToStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart(item) {
  // Executa a função que cria um elemento do carrinho com o item do parâmetro
  const itemToAdd = createCartItemElement(item);
  // Busca o elemento referente ao carrinho de compras
  const cart = cartItems();
  // Adicionar o item criado acima ao carrinho de compras
  cart.appendChild(itemToAdd);
}

async function fetchId(iD) {
  // Faz o fetch através do iD informado para a função
  const response = await fetch(`https://api.mercadolibre.com/items/${iD}`);
  // Pega o json da consulta acima
  const data = await response.json();
  // Executa uma função que adicionar o item ao carrinho
  addToCart(data);
  // Executa uma função que adiciona o valor do item ao total
  shoppingCartValue(data.price);
}

const getItemId = (event) => {
  // Busca o elemento pai do botão apertado, que é o elemento HTML do produto inteiro
  const wholeItem = event.target.parentElement;
  // Pega o primeiro filho desse elemento HTML, correspondente ao SKU do produto
  const itemId = wholeItem.firstChild.innerText;
  // Faz o fetch do item no banco de dados do ML por meio da função abaixo
  fetchId(itemId);
};

const addChild = (items) => {
  // Faz a função de criar um elemento para cada item e colocá-lo como filho da classe .items
  const section = document.querySelector('.items');
  section.innerText = null;
  items.forEach((item) => {
    const newItem = createProductItemElement(item);
    section.appendChild(newItem);
  });
  // Busca todos os botões criados nos itens
  const everyButton = document.querySelectorAll('.item__add');
  // Adiciona o eventListener de clique em cada botão de "Adicionar ao carrinho", que dispara a função getItemId
  everyButton.forEach((button) => button.addEventListener('click', getItemId));
};

async function getApi(searchword) {
  // Recebe a promise do site do MercadoLivre
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${searchword}`);
  // Após receber o resultado da promise, pega apenas o json
  const data = await response.json();
  // Executa a função addChild enviando as informações presentes em result do json
  addChild(data.results);
  return data;
}

window.onload = () => { 
  getApi('computador');
  emptyCart();
  if (localStorage.cart) {
    // Busca o valor do cart atual e substitui com o armazenado no localStorage
    const initialValue = document.querySelector('.cart');
    initialValue.innerHTML = localStorage.cart;
    // Adiciona o eventListener ao botão de esvaziar carrinho
    const emptyButton = document.querySelector('.empty-cart');
    emptyButton.addEventListener('click', emptyCart);
    // Adiciona o eventListener aos itens do carrinho
    document.querySelectorAll('.cart__items').forEach((item) => {
      item.addEventListener('click', cartItemClickListener);
    });
  }
};

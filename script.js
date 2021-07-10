let total = 0;
const totalCart = 'total-cart';
const itemCart = 'item-cart';

// salva todos os itens no localstorage
function saveList() {
  localStorage.setItem(itemCart, document.getElementById('cart__items').innerHTML);
  localStorage.setItem(totalCart, document.getElementById('totalPayment').innerHTML);
}

// carrega todos itens salvos no localstorage
function loadList() {
  if (localStorage.getItem(itemCart)) {
    document.getElementById('cart__items').innerHTML = localStorage.getItem(itemCart);
  }
  if (localStorage.getItem(totalCart)) {
    document.getElementById('totalPayment').innerHTML = localStorage.getItem(totalCart);
    total = parseFloat(document.getElementById('totalPayment').innerHTML);
  }
}

// calcula valor total do carrinho
function createTotalPayment(value = 0) {
  total += value;
  total = Math.round(total * 100) / 100;
  if (total > 1) {
    document.getElementById('totalPayment').innerText = total;
  } else {
    document.getElementById('totalPayment').innerText = '';
  }
  saveList();
}

// elemento imagem do shopping
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// elemento texto/button do shopping
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// cria os o elemento que ira conter no shopping
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  const items = document.getElementById('items');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  items.appendChild(section);
}

// remove o item selecionado no carrinho
function cartItemClickListener(event) {
  const cartItems = document.getElementById('cart__items');
  cartItems.removeChild(event.target);
  createTotalPayment(-parseFloat(event.target.innerText.slice(-11).split('$')[1]));
  saveList();
}

// cria os o elemento que ira conter no carrinho
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  document.getElementById('cart__items').appendChild(li);
  saveList();
}

// consulta a api usando como parametro o item selecionado no carrinho
async function getCarItem(sku) {
  const result = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const data = await result.json();
  try {
    createCartItemElement(data);
    createTotalPayment(data.price);
  } catch (error) {
    alert('Deu ruim!');
  }
}

// extrai o id do item clicado no carrinho
function getSkuFromProductItem(item) {
  const itemSku = item.querySelector('span.item__sku');
  return itemSku.innerText;
}

// seleciona o item clicado no carrinho
function getItemSeleted() {
  const addItem = document.querySelectorAll('.item__add');
  addItem.forEach((item) => 
    item.addEventListener('click', function () {
      getCarItem(getSkuFromProductItem(item.parentElement));
  }));
}

// cria addEventListen para os itens já carregados pelo localStorage
function addEventListenListLoaded() {
  const cartItem = document.querySelectorAll('.cart__item');
  cartItem.forEach((i) => 
    i.addEventListener('click', cartItemClickListener));
}

// remove todos os items no carrinho
function getEmptyCart() {
  const cartItem = document.querySelectorAll('.cart__item');
  cartItem.forEach((a) => a.parentElement.removeChild(a));
  total = 0;
  createTotalPayment();
  saveList();
}

// faz a consulta da api
async function getProducts(query) {
  const items = document.getElementById('items');
  const loading = document.getElementById('loading');
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const data = await response.json();
  try {
    if (query !== 'computador') {
      throw new Error();
    }
    items.removeChild(loading); //                                                         remove o elemento com texto loading quando a requisição da api e bem sucedida
    data.results.forEach((i) => createProductItemElement(i)); //                           Chama função passando o results como paramento
    getItemSeleted(); //                                                                   seleciona o id do produto selecionado
  } catch (error) {
    alert('Deu ruim! a query pesquisada não é computador');
  }
}

window.onload = () => {
  getProducts('computador');
  loadList();
  addEventListenListLoaded();
  document.getElementById('empty-cart').addEventListener('click', getEmptyCart);
};

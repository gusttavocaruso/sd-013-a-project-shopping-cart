let total = 0;

function saveList() {
  localStorage.setItem('item-cart', document.getElementById('cart__items').innerHTML);
  localStorage.setItem('total-cart', document.getElementById('totalPayment').innerHTML);
}

function loadList() {
  if (localStorage.getItem('item-cart')) {
    document.getElementById('cart__items').innerHTML = localStorage.getItem('item-cart');
  }
  if (localStorage.getItem('total-cart')) {
    document.getElementById('totalPayment').innerHTML = localStorage.getItem('total-cart');
    total = parseFloat(localStorage.getItem('total-cart'));
  }
}

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
  document.getElementById('items').appendChild(section);
}

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  document.getElementById('cart__items').removeChild(event.target);
  createTotalPayment(-parseFloat(event.target.innerText.slice(-10).split('$')[1]));
  saveList();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  document.getElementById('cart__items').appendChild(li);
  saveList();
}

function getCarItem(sku) {
  const api = `https://api.mercadolibre.com/items/${sku}`;
  return fetch(api)
  .then((result) => result.json())
  .then((data) => {
    createCartItemElement(data);
    createTotalPayment(data.price);
  });
}

function getItemSeleted() {
  document.querySelectorAll('.item__add').forEach((item) => 
    item.addEventListener('click', function () {
      getCarItem(getSkuFromProductItem(item.parentElement));
  }));
}

function getProducts(query) {
  const api = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  // const result = await 
  return fetch(api)
  .then((result) => result.json())
  .then((data) => {
    document.getElementById('items').removeChild(document.getElementById('loading'));
    data.results.forEach((i) => createProductItemElement(i)); // Chama função passando o results como paramento
    getItemSeleted(); // seleciona o id do produto selecionado
  });
}

window.onload = () => {
  getProducts('computador');
  loadList();
  document.querySelectorAll('.cart__item').forEach((i) => // cria addEventListen para os
    i.addEventListener('click', cartItemClickListener));
  document.getElementById('empty-cart').addEventListener('click', function () {
    document.querySelectorAll('.cart__item').forEach((a) => a.parentElement.removeChild(a));
    total = 0;
    createTotalPayment();
    saveList();
  });
};

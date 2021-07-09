function saveList() {
  localStorage.setItem('save', document.getElementById('cart__items').innerHTML);
}

function loadList() {
  if (localStorage.getItem('save')) {
    document.getElementById('cart__items').innerHTML = localStorage.getItem('save');
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  document.getElementById('cart__items').removeChild(event.target);
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
  .then((data) => createCartItemElement(data));
}

function getItemSeleted() {
  document.querySelectorAll('.item__add').forEach((item) => 
    item.addEventListener('click', function () {
      getCarItem(getSkuFromProductItem(item.parentElement));
  }));
}

function getProducts(query) {
  const api = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  return fetch(api)
  .then((result) => result.json())
  .then((data) => {
    data.results.forEach((i) => createProductItemElement(i)); // Chama função passando o results como paramento
    getItemSeleted(); // seleciona o id do produto selecionado
  });
}

function addEventListenItemsSaved() {
  document.querySelectorAll('.cart__item').forEach((i) => // cria addEventListen para os
  i.addEventListener('click', cartItemClickListener));
}

window.onload = () => {
  getProducts('computador');
  loadList();
  addEventListenItemsSaved();
};

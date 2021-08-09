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

function createProductItemElement(sku, name, image) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function saveOnLocalStorage() {
  const allItems = document.querySelector(cartItems);
  localStorage.setItem('cart', JSON.stringify(allItems.innerHTML)); // Estudar sintaxe de LocalStorage
}

function cartItemClickListener(event) {
  event.target.remove('li');
  saveOnLocalStorage();
}

function getFromLocal() {
  const cartFromLocal = JSON.parse(localStorage.getItem('cart'));
  const ol = document.querySelector(cartItems);
  ol.innerHTML = cartFromLocal;
  const olAll = document.querySelectorAll(cartItems);
  olAll.forEach((li) => {
    li.addEventListener('click', cartItemClickListener);
  });
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function createItemList() {
  const completeRequest = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const request = await completeRequest.json();
  const computers = request.results;
  const list = document.querySelector('.items');
  computers.forEach((computer) => {
    const productElement = createProductItemElement(
      computer.id, computer.title, computer.thumbnail,
    );
    list.appendChild(productElement);
  });
}

function createLiElement(id) {
  const ol = document.querySelector(cartItems);
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((request) => request.json())
  .then((data) => ol.appendChild(createCartItemElement(data)));
  saveOnLocalStorage();
}

function catchId() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const wantedId = getSkuFromProductItem(event.target.parentElement);
      console.log(wantedId);
      createLiElement(wantedId);
    });
});
}

function clearCart() {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    document.querySelector(cartItems).innerHTML = '';
  });
}

function addLoading() {
  const loading = document.createElement('div');
  document.querySelector('body')
  .appendChild(loading);
  loading.innerText = 'loading...';
  loading.className = 'loading';
}

function removeLoading() {
  const loading = document.querySelector('.loading');
  loading.remove();
}

window.onload = async function onload() { // Olhar documentação onload
  addLoading();
  getFromLocal();
  await createItemList();
  removeLoading();
  catchId();
  clearCart();
};

const cartItems = '.cart__items';
let totalPrice = 0;
const totalPriceClass = '.total-price';

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

function increaseTotalPrice(item) {
  totalPrice += item.price;
  document.querySelector(totalPriceClass)
  .innerText = totalPrice;
}

function decreaseTotalPrice(item) {
  const str = item.innerText;
  let wantedStr = '';
  for (let index = 0; index < str.length; index += 1) {
    if (str[index] === '$') {
      wantedStr = str.slice((index + 1), (str.length));
    }
  }
  const wantedNumber = parseFloat(wantedStr);
  totalPrice -= wantedNumber;
  document.querySelector(totalPriceClass)
  .innerText = totalPrice;
}

function saveOnLocalStorage() {
  const allItems = document.querySelector(cartItems);
  localStorage.setItem('cart', JSON.stringify(allItems.innerHTML)); // Estudar sintaxe de LocalStorage
}

function cartItemClickListener(event) {
  event.target.remove('li');
  saveOnLocalStorage();
  decreaseTotalPrice(event.target);
}

function getFromLocal() {
  const cartFromLocal = JSON.parse(localStorage.getItem('cart'));
  const ol = document.querySelector(cartItems);
  ol.innerHTML = cartFromLocal;
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
  document.querySelector(totalPriceClass)
  .innerText = totalPrice;
}

function createLiElement(id) {
  const ol = document.querySelector(cartItems);
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((request) => request.json())
  .then((data) => {
    ol.appendChild(createCartItemElement(data));
    saveOnLocalStorage();
    increaseTotalPrice(data);
  });
}

function catchId() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const wantedId = getSkuFromProductItem(event.target.parentElement);
      createLiElement(wantedId);
    });
});
}

function clearCart() {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    document.querySelector(cartItems).innerHTML = '';
    saveOnLocalStorage();
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

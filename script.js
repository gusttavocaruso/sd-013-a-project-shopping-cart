function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function deleteItemFromStorage(index) {
  const items = JSON.parse(localStorage.getItem('cart-list')) || [];
  const filteredItems = items.filter((item, itemIndex) => itemIndex !== index);
  localStorage.setItem('cart-list', JSON.stringify(filteredItems));
}

function cartItemClickListener(event) {
  event.preventDefault();
  const itemShopList = event.target;
  const index = [...itemShopList.parentElement.children].indexOf(itemShopList);
  deleteItemFromStorage(index);
  itemShopList.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
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

function deleteAllClickListener(event) {
  event.preventDefault();
  const listItems = document.querySelectorAll('.cart__item');
  localStorage.removeItem('cart-list');
  listItems.forEach((item) => item.remove());
}

function addProductToShoppingList({ sku, name, salePrice }) {
  const cartList = document.querySelector('.cart__items');
  const elementList = createCartItemElement({ sku, name, salePrice });
  cartList.appendChild(elementList);

  const deleteAll = document.querySelector('.empty-cart');
  deleteAll.addEventListener('click', deleteAllClickListener);
}

function saveItemToStorage(item) {
  const currentList = JSON.parse(localStorage.getItem('cart-list')) || [];
  localStorage.setItem('cart-list', JSON.stringify([...currentList, item]));
}

async function getProductApi(id) {
  const response = await fetch(
    `https://api.mercadolibre.com/items/${id}`,
  );

  if (response.ok) {
    return response.json();
  }
  throw new Error(response.statusText);
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', async (event) => {
    event.preventDefault();
    const productId = getSkuFromProductItem(section);
    const product = await getProductApi(productId);
    const item = { sku: product.id, name: product.title, salePrice: product.price };
    addProductToShoppingList(item);
    saveItemToStorage(item);
  });

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(button);

  return section;
}

function addItemsToList(items) {
  const sectionItems = document.querySelector('.items');

  items.forEach((item) => {
    const itemElement = createProductItemElement(item);
    sectionItems.appendChild(itemElement);
  });
}

async function getDataApi() {
  const response = await fetch(
    'https://api.mercadolibre.com/sites/MLB/search?q=computador',
  );

  if (response.ok) {
    const { results } = await response.json();
    addItemsToList(results);
  } else {
    throw new Error(response.statusText);
  }
}

function loadCartFromStorage() {
  const items = JSON.parse(localStorage.getItem('cart-list')) || [];
  items.forEach((item) => addProductToShoppingList(item));
}

window.onload = () => {
  getDataApi();
  loadCartFromStorage();
};
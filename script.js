const url = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const url2 = 'https://api.mercadolibre.com/items/';
const sectionItems = document.querySelector('.items');
const cartShop = document.querySelector('.cart__items');

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createProductItemElement({ id, title, thumbnail }) {
  const itemInTheSection = document.createElement('section');
  itemInTheSection.className = 'item';
  itemInTheSection.appendChild(createCustomElement('span', 'item__sku', id));
  itemInTheSection.appendChild(createCustomElement('span', 'item__title', title));
  itemInTheSection.appendChild(createProductImageElement(thumbnail));
  itemInTheSection.appendChild(createCustomElement(
    'button', 'item__add', 'Adicionar ao carrinho!',
  ));
  return itemInTheSection;
}

const removeItemToLocalStorage = (id) => {
  const localStorageActual = JSON.parse(localStorage.getItem('cartShopActual')) || [];
  const removeFromLocalStorage = localStorageActual.filter((item) => item.id !== id);
  localStorage.setItem('cartShopActual', JSON.stringify(removeFromLocalStorage));
};

function updateCartTotalPrice() {
  const dadosLocalStorage = JSON.parse(localStorage.getItem('cartShopActual')) || [];
  const prices = dadosLocalStorage.map((itemLS) =>
    itemLS.price).reduce((acc, curr) => acc + curr, 0);
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerText = prices;
}

function cartItemClickListener(event, id) {
  event.target.remove();
  removeItemToLocalStorage(id);
  updateCartTotalPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event, sku));
  return li;
}

const addItemToLocalStorage = (item) => {
  const localStorageActual = JSON.parse(localStorage.getItem('cartShopActual')) || [];
  localStorageActual.push(item);
  localStorage.setItem('cartShopActual', JSON.stringify(localStorageActual));
  // localStorageActual.push({ sku: dataJson.id, name: dataJson.title, salePrice: dataJson.price });
};

const addItemToCartShop = (itemSku) => {
  fetch(url2 + itemSku)
    .then((resp) => resp.json())
      .then((dataJson) => {
        const itemInTheCartShop = createCartItemElement(dataJson);
        cartShop.appendChild(itemInTheCartShop);
        addItemToLocalStorage(dataJson);
        updateCartTotalPrice();
      });
};

const buttonEvent = () => {
  const addItemButton = document.querySelectorAll('.item__add');
  addItemButton.forEach((button) => {
    button.addEventListener('click', (event) => {
      const itemSku = event.target.parentNode.firstChild.innerText; //  PR @cassiorodp
      addItemToCartShop(itemSku);
    });
  });
};

const addItems = (items) => {
  items.forEach((item) => {
    const itemElement = createProductItemElement(item);
    sectionItems.appendChild(itemElement);
  });
};

const getMLProductList = (product) => {
  fetch(url + product)
    .then((resp) => resp.json())
      .then((dataJson) => {
        addItems(dataJson.results);
        buttonEvent(); // PR @cassiorodp
      });
};

const getItemsToLocalStorage = () => {
  // const cartShop = document.querySelector('.cart__items');
  const dadosLocalStorage = JSON.parse(localStorage.getItem('cartShopActual')) || [];
  dadosLocalStorage.forEach((itemLS) => {
    const LSElement = createCartItemElement(itemLS);
    cartShop.appendChild(LSElement);
  });
};

const clearCartShop = () => {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    const cartItemsActual = document.querySelector('.cart__items');
    cartItemsActual.innerHTML = '';
  });
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

window.onload = () => {
  getMLProductList('computador');
  clearCartShop();
  getItemsToLocalStorage();
};

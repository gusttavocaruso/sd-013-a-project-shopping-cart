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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const cartItemsOl = () => document.getElementsByClassName('cart__items')[0];

const saveLocalStorage = () => {
  localStorage.setItem('cartList', cartItemsOl().innerHTML);
};

const loadLocalStorage = () => new Promise((resolve) => {
  if (localStorage.getItem('cartList')) {
    cartItemsOl().innerHTML = localStorage.getItem('cartList');
  }
  resolve();
});

const fetchMeLiAPI = (product) => new Promise((resolve) => {
  const apiUrl = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  fetch(apiUrl)
    .then((response) => response.json()
    .then((jsonProduct) => {
      jsonProduct.results.forEach((item) => {
        const itemsSection = document.getElementsByClassName('items')[0];
        itemsSection.appendChild(createProductItemElement(item));
        resolve();
      });
    }));
});

const fetchItem = () => new Promise((resolve) => {
  const itemsSectionArray = document.getElementsByClassName('item');
  Array.from(itemsSectionArray).forEach((item) => {
    item.addEventListener('click', () => {
      const itemUrl = `https://api.mercadolibre.com/items/${getSkuFromProductItem(item)}`;
      fetch(itemUrl)
        .then((response) => response.json()
        .then((jsonProduct) => {
          cartItemsOl().appendChild(createCartItemElement(jsonProduct));
          saveLocalStorage();
        }));
    });
  });
  resolve();
});

const emptyCart = () => new Promise((resolve) => {
  const emptyBtn = document.getElementsByClassName('empty-cart')[0];
  emptyBtn.addEventListener('click', () => {
    cartItemsOl().innerHTML = '';
    saveLocalStorage();
  });
  resolve();
});

const fetchPromise = async () => {
  try {
    await fetchMeLiAPI('computador');
    await fetchItem();
    await loadLocalStorage();
    await emptyCart();
  } catch (error) {
    console.log(error);
  }
};

window.onload = () => {
 fetchPromise();
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const getItem = (itemId) => new Promise((resolve) => {
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
  .then((response) => response.json().then((catalogo) => resolve(catalogo)));
});

const getPromiseProducts = () => new Promise((resolve) => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=carro')
  .then((response) => response.json().then((catalogo) => resolve(catalogo)));
});

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const addPriceStorage = (totalPrice) => {
  localStorage.setItem('price', totalPrice);
};

// SOMA DO VALOR DAS COMPRAS

const updateCartPrice = (price = 0) => {
  const priceParagraph = document.querySelector('.total-price');
  const actualPrice = parseFloat(priceParagraph.innerHTML).toFixed(2);
  const totalPrice = parseFloat(actualPrice) + price;
  priceParagraph.innerHTML = parseFloat(Math.round(totalPrice * 100) / 100);
  addPriceStorage(totalPrice);
};

// LOCAL STORAGE CART 
// https://www.smashingmagazine.com/2019/08/shopping-cart-html5-web-storage/

const addStorage = (cart) => {
  localStorage.setItem('cart', cart.innerHTML);
};

function cartItemClickListener(event) {
  const li = event.target;
  const oList = li.parentNode;
  const priceItem = parseFloat(li.innerText.split('$')[1]);
  oList.removeChild(event.target);
  addStorage(oList);
  updateCartPrice(priceItem * -1);
}

const getPrice = () => {
  const price = localStorage.getItem('price');
  updateCartPrice(price);
};

const getStorage = () => {
  const storage = localStorage.getItem('cart');
  if (storage) {
    const cart = document.querySelector('.cart__items');
    cart.innerHTML = storage;
    Array.from(cart.children).forEach((li) => {
      li.addEventListener('click', cartItemClickListener);
    });
  }
};

// carrinho   ---------------------------------------------

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addProduct = (promise) => {
  const cart = document.querySelector('.cart__items');
  promise.then((item) => {
    const { id: sku, title: name, price: salePrice } = item;
    const liItem = createCartItemElement({ sku, name, salePrice });
    cart.appendChild(liItem);
    addStorage(cart);
    updateCartPrice(salePrice);
  });
  };

const addCart = () => {
  const arrayItem = Array.from(document.getElementsByClassName('item'));
  arrayItem.forEach((item) => {
    const sku = item.querySelector('.item__sku').innerText;
    const button = item.querySelector('.item__add');
    button.addEventListener('click', () => addProduct(getItem(sku)));
  });
  };

const cleanCart = () => {
  const cart = document.querySelector('ol');
  const button = document.querySelector('.empty-cart');
  const priceParagraph = document.querySelector('.total-price');
  button.addEventListener('click', () => {
    while (cart.firstChild) cart.removeChild(cart.firstChild);
    if (priceParagraph) priceParagraph.innerText = 0;
    addStorage(cart);
    addPriceStorage(0);
  });
};

function createProductItemElement({ sku, name, image, line }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createCustomElement('hr', 'item__line', line)).innerText = '';
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const addProductsToPage = (promise) => {
const items = document.querySelector('.items');
return promise.then((catalogo) => {
  catalogo.results.forEach((item) => {
    const { id: sku, title: name, thumbnail: image } = item;
    const theItem = createProductItemElement({ sku, name, image });
    items.appendChild(theItem);
  });
});
};

window.onload = function onload() {
  addProductsToPage(getPromiseProducts()).then(() => addCart());
  getStorage();
  getPrice();
  cleanCart();
 };

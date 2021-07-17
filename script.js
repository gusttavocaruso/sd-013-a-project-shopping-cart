const classCartItems = '.cart__items';

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

function removeAllProducts() {
  document.querySelector(classCartItems).innerText = '';
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const bttEmptyCart = document.querySelector('button.empty-cart');
  bttEmptyCart.addEventListener('click', removeAllProducts);
  return section;
}

let valueObj = {
  products: [],
};

function setStorage(li) {
  valueObj.products.push(li);
  localStorage.setItem('purchase', JSON.stringify(valueObj));
}

async function cartItemClickListener(event) {
  if (event.target.closest(classCartItems)) {
    document.querySelector(classCartItems).removeChild(event.target);
    valueObj = {
      products: [],
    };
    setStorage(document.querySelectorAll('.cart__item')
    .forEach((product) => {
      console.log(product.innerText);
      setStorage(product.innerText);
    }));
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  console.log(`SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`);
  document.querySelector(classCartItems).addEventListener('click', cartItemClickListener);
  return li;
}

function createStorageitems(cartItemStorage) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = cartItemStorage;
  document.querySelector(classCartItems).appendChild(li);
}

function localCart() {
  if (localStorage.length !== 0) {
     const getObjLStorage = JSON.parse(localStorage.getItem('purchase'));
     localStorage.setItem('purchase', localStorage.getItem('purchase'));
     getObjLStorage.products.forEach((cartItem) => {
      console.log(cartItem); 
      createStorageitems(cartItem);
      });
  }
}

// const fetch = require('node-fetch');

const addProducts = (products) => {
  products.forEach((product) => {
    const element = createProductItemElement(product);
    const section = document.querySelector('.items');
    section.appendChild(element);
});
};

const addItemtoCart = () => {
  const cart = document.querySelector(classCartItems);
  const bttsAddCarts = document.querySelectorAll('.item__add');
  bttsAddCarts.forEach((bttCart) => {
    bttCart.addEventListener('click', (e) => {
      const id = e.target.parentNode.firstChild.innerText;
      fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((promise) => promise.json())
      .then((value) => {
        const data = {
         sku: value.id,
         name: value.title,
         salePrice: value.price };
        const li = createCartItemElement(data);
        setStorage(li.innerText);
        cart.appendChild(li);
      });
    });
  });
};

const fetchAPI = async (search) => {
  try {
    return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`)
    .then((response) => {
      response.json().then((value) => {
        addProducts(value.results);
        addItemtoCart();
    });
  });
  } catch (error) {
    alert('ERROR DIFERENCIADO');
  }
};

window.onload = () => {
  fetchAPI('magiccubes');
  localCart();
 };

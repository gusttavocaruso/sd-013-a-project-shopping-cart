const getItems = document.querySelector('.items');
const getCart = document.querySelector('.cart__items');
const getEmptyButton = document.querySelector('.empty-cart');
const loading = document.querySelector('.loading');
const getTotalPrice = document.querySelector('.total-price');

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

const saveCart = () => {
  localStorage.setItem('saveCart', getCart.innerHTML);
  localStorage.setItem('savePrice', getTotalPrice.innerHTML);
};

const soma = (value, operator) => {
  const result = value + operator;
  getTotalPrice.innerHTML = Math.round(result * 100) / 100;
  saveCart();
};

const sub = (value, operator) => {
  const result = value - operator;
  getTotalPrice.innerHTML = Math.round(result * 100) / 100;
  saveCart();
};

const setTotalPrice = (value, operator) => {
  const getAtualPrice = Number(getTotalPrice.innerHTML);
  if (operator === '+') {
    soma(getAtualPrice, value);
  }
  if (operator === '-') {
    sub(getAtualPrice, value);
  }
};

const setCartItem = ({ id: sku, title: name, price: salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart_item';
  li.innerHTML = `SKU: ${sku} | NAME: ${name} | PRICE: $<span>${salePrice}</span>`;
  getCart.appendChild(li);
  setTotalPrice(salePrice, '+');
};

const setProductCart = async (id) => {
  try {
    const productInfo = await (await fetch(`https://api.mercadolibre.com/items/${id}`)).json();
    setCartItem(productInfo);
    saveCart();
  } catch (error) {
    alert(error);
  }
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.lastElementChild.addEventListener('click', (event) => {
    const productID = event.target.parentElement.firstElementChild.innerText;
    setProductCart(productID);
  });
  getItems.appendChild(section);
}

const removeCartItem = (event) => {
  if (event.target.className === 'cart_item') {
    event.target.remove();
    const getProductPrice = event.target.querySelector('span').innerText;
    setTotalPrice(getProductPrice, '-');
    saveCart();
  }
};

const returnCart = () => {
  getCart.innerHTML = localStorage.getItem('saveCart');
  getTotalPrice.innerHTML = localStorage.getItem('savePrice');
};

getEmptyButton.addEventListener('click', () => {
  const getFullCart = document.querySelectorAll('.cart_item');
  getFullCart.forEach((item) => item.parentNode.removeChild(item));
  getTotalPrice.innerHTML = 0;
  saveCart();
});

const getProducts = async (product = 'computador') => {
  try {
    ((await (await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`))
      .json())
        .results)
    .forEach((computador) => createProductItemElement(computador), loading.remove());
  } catch (error) {
    alert(error);
  }
};

getCart.addEventListener('click', (removeCartItem));

window.onload = () => {
  getProducts();
  returnCart();
};

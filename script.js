const QUERY = 'computador';
const DOMAIN = 'https://api.mercadolibre.com/';
const cartList = document.querySelector('.cart__items');
const priceDisplay = document.querySelector('.total-price');

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

const getStoredCart = () => JSON.parse(localStorage.getItem('cart')) || [];

const updateCartTotal = () => {
  const storedCart = getStoredCart();
  const total = storedCart.reduce((acc, curr) => acc + curr.price, 0);
  priceDisplay.innerText = total.toString();
};

const removeProductFromStoredCart = (sku) => {
  const storedCart = getStoredCart();
  const newCart = storedCart.filter(({ id }) => id !== sku);
  localStorage.setItem('cart', JSON.stringify(newCart));
};

const emptyCart = () => {
  cartList.innerHTML = '';
  localStorage.removeItem('cart');
  updateCartTotal();
};

function cartItemClickListener(event) {
  removeProductFromStoredCart(event.target.id);
  event.target.remove();
  updateCartTotal();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.id = sku;
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getProduct = async (id) => {
  const ENDPOINT = `${DOMAIN}items/${id}`;
  return fetch(ENDPOINT, { headers: { 'Content-Type': 'application/json' } })
    .then((response) => response.json())
    .catch((err) => console.log(`Error getting product: ${err}`));
};

const addProductToStoredCart = ({ id: sku, title: name, price: salePrice }) => {
  const storedCart = getStoredCart();
  if (storedCart.find(({ id }) => id === sku)) return;

  const productObj = {
    id: sku,
    title: name,
    price: salePrice,
  };
  storedCart.push(productObj);
  localStorage.setItem('cart', JSON.stringify(storedCart));

  updateCartTotal();
};

const loadStoredCart = () => {
  const storedCart = getStoredCart();
  storedCart.forEach((storedProduct) => {
    const li = createCartItemElement(storedProduct);
    cartList.appendChild(li);
  });
};

async function addProductToCart(event) {
  if (event.target.classList.contains('item__add')) {
    const productId = getSkuFromProductItem(event.target.parentElement);
    if (document.getElementById(productId)) return;

    await getProduct(productId)
      .then((product) => {
        const li = createCartItemElement(product);
        cartList.appendChild(li);
        addProductToStoredCart(product);
      })
      .catch((err) => console.log(err));
  }
}

const parseProducts = (products) => {
  const itemsSection = document.querySelector('.items');
  products.forEach((product) => {
    const productElement = createProductItemElement(product);
    itemsSection.appendChild(productElement);
  });
};

const searchProducts = (query) => {
  const ENDPOINT = `${DOMAIN}sites/MLB/search?q=${query}`;
  fetch(ENDPOINT, {
    headers: { 'Content-Type': 'application/json' },
  })
  .then((response) => response.json())
  .then((data) => data.results)
  .then((products) => parseProducts(products))
  .catch((error) => console.log(`Error ${error}`));
};

window.onload = () => {
  searchProducts(QUERY);
  loadStoredCart();
  document.body.addEventListener('click', addProductToCart);
  document.querySelector('.empty-cart').addEventListener('click', emptyCart);
};

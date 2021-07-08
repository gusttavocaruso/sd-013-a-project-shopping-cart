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

function createProductItemElement({ sku, name, image }) {
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

function sumProductsPrices(salePrice, type) {
  const totalPrice = document.querySelector('.total-price');
  let total = Number(totalPrice.innerHTML);

  if (type === 'add') total += salePrice;
  if (type === 'remove') total -= salePrice;

  totalPrice.innerHTML = total;
}

function cartItemClickListener(event) {
  const [,, priceText] = event.target.innerText.split('|');
  const price = priceText.replace('PRICE: $', '');
  sumProductsPrices(Number(price), 'remove');
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function saveCartToLocalStorage() {
  const cartItems = document.querySelector('.cart__items');
  localStorage.setItem('cart', cartItems.innerHTML);
}

function getCartFromLocalStorage() {
  const localStorageItems = localStorage.getItem('cart');
  const cart = document.querySelector('ol.cart__items');
  
  if (localStorageItems) {
    cart.innerHTML = localStorageItems;
  }
}

async function getCurrentProductInfo(id) {
  const productInfo = await fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json());
  return productInfo;
}

function addToTheCart(productElement) {
  const button = productElement.querySelector('.item__add');
  const cart = document.querySelector('.cart__items');

  button.addEventListener('click', async (event) => {
    const item = event.target.parentNode;
    const id = getSkuFromProductItem(item);

    const { id: sku, title: name, price: salePrice } = await getCurrentProductInfo(id);
    const cartItem = createCartItemElement({ sku, name, salePrice });
    cartItem.addEventListener('click', cartItemClickListener);
    
    cart.appendChild(cartItem);
    saveCartToLocalStorage();
    sumProductsPrices(salePrice, 'add');
  });
}

async function getProducts(search) {
  const { results } = await 
  (await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`))
  .json();
  // console.log(results);
  return results;
}

async function getPrductInfo() {
  const products = await getProducts('computador');

  const productsList = products.map(({ id, title, thumbnail }) => ({ 
    sku: id,
    name: title,
    image: thumbnail,
  }));
  
  return productsList;
}

async function createProductsList() {
  const productsList = await getPrductInfo();
  const list = document.querySelector('.items');
  // console.log(productsList);

  productsList.forEach((product) => {
    const productElement = createProductItemElement(product);
    addToTheCart(productElement);
    list.appendChild(productElement);
  });
}

window.onload = () => {
  createProductsList();
  getCartFromLocalStorage();
};

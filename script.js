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

const getCartItems = () => document.querySelector('.cart__items');

const storeCart = () => {
  const cartItems = getCartItems();
  localStorage.setItem('cart_content', cartItems.innerHTML);
};

const displayTotalPrice = () => {
  const priceDisplay = document.querySelector('.total-price');
  const cartItemsArr = [...getCartItems().children];
  const totalPrice = cartItemsArr.reduce((acc, curr) => 
    acc + Number(curr.innerText.split('$')[1]), 0);
  priceDisplay.innerText = totalPrice;
};

function cartItemClickListener(event) {
  event.target.remove();
  displayTotalPrice();
  storeCart();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const changeLoadingDisplay = (display) => {
  document.querySelector('.loading-container').style.display = display;
};

async function addItemToCart(event) {
  changeLoadingDisplay('flex');
  const cartItems = getCartItems();
  const itemSku = getSkuFromProductItem(event.target.parentElement);
  await fetch(`https://api.mercadolibre.com/items/${itemSku}`)
    .then((response) => response.json())
    .then((data) => {
      changeLoadingDisplay('none');
      cartItems.appendChild(createCartItemElement(data));
      displayTotalPrice();
      storeCart();
    });
}

function appendItemsToList(results) {
  const items = document.querySelector('section.items');
  results.forEach((element) => {
    const item = createProductItemElement(element);
    items.appendChild(item);
    const addItemBtn = item.querySelector('button.item__add');
    addItemBtn.addEventListener('click', addItemToCart);
  });
}

async function postQueryResults(query) {
  try {
    await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
      .then((response) => {
        if (!response.ok) throw new Error('Não foi possível acessar o servidor');
        return response.json();
      })
      .then((data) => {
        changeLoadingDisplay('none');
        return appendItemsToList(data.results);
      });
  } catch (err) {
    console.log(`Sua requisição falhou. ${err}`);
  }
}

const deleteItemOnClick = () => {
  const cartItemsArr = [...getCartItems().children];
  cartItemsArr.forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  });
};

function retrieveCart() {
  const cartItems = getCartItems();
  cartItems.innerHTML = localStorage.getItem('cart_content');
}

function emptyBtn() {
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', () => {
    const cartItems = getCartItems();
    cartItems.innerHTML = '';
    displayTotalPrice();
    storeCart();
  });
}

window.onload = () => {
  postQueryResults('computadores');
  retrieveCart();
  deleteItemOnClick();
  emptyBtn();
};

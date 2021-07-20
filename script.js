const items = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const addStorage = () => {
  localStorage.setItem('data', cartItems.innerHTML);
};

const getStorage = () => {
  if (cartItems.innerHTML !== null) {
    cartItems.innerHTML = localStorage.getItem('data');
  }
};

function cartItemClickListener(event) {
  event.target.remove();
  addStorage();
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {     
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;     
  li.addEventListener('click', cartItemClickListener);     
  cartItems.appendChild(li);
  return li;
}

const cartItemPromise = async (itemCart) => {
  try {
    const getCartItem = await fetch(`https://api.mercadolibre.com/items/${itemCart}`);
    const productCart = await getCartItem.json();
    createCartItemElement(productCart);
    addStorage();
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
    const productId = event.target.parentElement.firstElementChild.innerText;
    cartItemPromise(productId);
  });
  return section;
}
// Requisito 1 
const addItems = (pc) => {
  pc.forEach((elements) => {
    const item = createProductItemElement(elements);
    items.appendChild(item);
  });
};

const getItemsPromises = async (item) => {
  try {
    const getItem = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`);
    const product = await getItem.json();
    const result = product.results;
    addItems(result);
  } catch (error) {
      alert(error);
  }
};
  
// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const getFetch = async () => {
  await getItemsPromises('computador');
};

cartItems.addEventListener('click', cartItemClickListener);

window.onload = () => { 
  getFetch();  
  getStorage();
};

const cart = '.cart__items';

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function totalPrice() {
  const result = document.querySelector('.total-price');
  let price = 0;
  const gPrice = document.querySelectorAll('.cart__item');
  gPrice.forEach((preco) => {
  const remove = preco.innerText.split('$');
  price += Number(remove[1]);
  });
  result.innerHTML = `${(Math.round((price * 100)) / 100)}`;
  }

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function localStorageSave() {
  const listItems = document.querySelector(cart);  
  localStorage.setItem('listItems', listItems.innerHTML);
}

function loadingStorage() {
  const listIt = document.querySelector(cart);
  listIt.innerHTML = localStorage.getItem('listItems');
  totalPrice();
  listIt.addEventListener('click', (event) => {
    event.target.remove();
    localStorageSave();
    totalPrice();
  });
}

function cartItemClickListener(event) {
  event.target.remove();
  totalPrice();
  localStorageSave();
 }

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener); 
  return li;
}

const getId = async (id) => {
  const apiM = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const json = await apiM.json();
  return json;
};
  
function cartItem() {
  const id = this.parentNode.firstChild.innerText;
  const listCart = document.getElementsByClassName('cart__items');
  getId(id).then((product) => {
    const item = createCartItemElement(product);
    listCart[0].appendChild(item);
    localStorageSave();
    totalPrice();
  });
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', cartItem);

  return section;
}

const addItems = (its) => {
  const load = document.querySelector('.loading');
  load.remove();
  its.forEach((it) => {
    const selector = document.querySelector('.items');
    const items = createProductItemElement(it);
    selector.appendChild(items);
  });
};

const fetchProduct = () => {
    const url = fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
    url.then((response) => {
      response.json().then((data) => {
        addItems(data.results);
      });
    });
  };

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

function clearCar() {
  const emptyButton = document.querySelector('.empty-cart');
  const items = () => document.querySelector(cart);
  emptyButton.addEventListener('click', () => {
    items().innerHTML = '';
    totalPrice();
    localStorageSave();
  });
}

window.onload = () => {
fetchProduct();
loadingStorage();
totalPrice();
clearCar();
};

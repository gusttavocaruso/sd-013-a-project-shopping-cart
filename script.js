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

const saveItemsLocalStorage = () => {
  const cartItem = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', cartItem);
};

function totalPrice() {
  const priceList = document.querySelectorAll('.cart__item');
  let soma = 0;
  priceList.forEach(function (listOfItems) {
    soma += parseFloat(listOfItems.innerHTML.split('$')[1]);
  });
  document.querySelector('.total-price').innerHTML = Math.round(soma * 100) / 100;
}

function cartItemClickListener(event) {
  event.target.remove('li');
  saveItemsLocalStorage();
  totalPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItem = (itemParam) => {
  itemParam.forEach((item) => {
    const element = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(element);
  });
};

const fetchComputer = () => {
  const loading = document.querySelector('.loading');
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(url)
    .then((response) => response.json())
    .then((computer) => {
      addItem(computer.results);
      loading.remove();
  });
};

const addList = (list) => {
  const ol = document.querySelector('.cart__items');
  const li = createCartItemElement(list);
  ol.appendChild(li);
};

const selectItem = () => {
  const computerList = document.querySelector('.items'); 
  computerList.addEventListener('click',
  (event) => {
    if (event.target.classList.contains('item__add')) {
      const parent = event.target.parentElement;
      const idItem = getSkuFromProductItem(parent);
      fetch(`https://api.mercadolibre.com/items/${idItem}`)
        .then((response) => response.json())
        .then((data) => {
          addList(data);
          saveItemsLocalStorage();
          totalPrice();
     });
    }
  });
};

const loadSavedItems = () => {
  const itemSalvo = localStorage.getItem('cart');
  const element = document.querySelector('#cart__items');
  element.innerHTML = itemSalvo;
  element.addEventListener('click', (event) => {
    if (event.target.classList.contains('cart__item')) {
      cartItemClickListener(event);
    }
  });
  totalPrice();
};

const clear = () => {
  const button = document.querySelector('.empty-cart');
  const list = document.querySelector('#cart__items');
  button.addEventListener('click', () => {
    list.innerHTML = '';
    saveItemsLocalStorage();
    totalPrice();
  });
};

window.onload = () => { 
  selectItem();
  fetchComputer();
  loadSavedItems();
  clear();
 };
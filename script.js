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
  return event.target.remove('li');
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
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  fetch(url)
    .then((response) => response.json())
    .then((computer) => {
      addItem(computer.results);
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
     });
    }
  });
};

window.onload = () => { 
  fetchComputer();
  selectItem();
 };
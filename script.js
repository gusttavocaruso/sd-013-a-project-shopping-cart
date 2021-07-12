const loading = document.querySelector('.loading');

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

function createSection(itens) {
  itens.forEach((item) => {
    const createItem = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(createItem);
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(li) {
  li.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const lista = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  .then((response) => response.json()
  .then((data) => {
    createSection(data.results);
    loading.remove();
  }));
};

const fetchId = (event) => {
  const elementoPai = event.target.parentElement;
  const idElement = getSkuFromProductItem(elementoPai);
  fetch(`https://api.mercadolibre.com/items/${idElement}`)
  .then((response) => response.json())
  .then((data) => {
     const addLi = createCartItemElement(data);
     const list = document.querySelector('.cart__items');
     list.appendChild(addLi);
     localStorage.setItem('li', list.innerHTML);
  });
};

function escutarClick() {
  const itemList = document.querySelector('.items');
  itemList.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      fetchId(event);
    }
  });
}

function salvarLocal() {
  if (localStorage.li) {
    document.querySelector('.cart__items').innerHTML = localStorage.li;
  }
}

function esvaziarCarrinho() {
  const buttn = document.querySelector('.empty-cart');
  buttn.addEventListener('click', () => {
    const itemCar = document.querySelectorAll('.cart__item');
    itemCar.forEach((item) => item.parentNode.removeChild(item));
  });
}

window.onload = () => {
  lista('computador');
  escutarClick();
  salvarLocal();
  esvaziarCarrinho();
 };

 // Questão 1, 2 e 3 feita com ajuda de Matheus Macêdo
 // Questão 4 feita com ajuda de Felipe Neves
// Questão 7 feita com ajuda de Josué e Rogério.

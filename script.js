// Resolvidos com call em grupo Mateus, Leonardo, Douglas e Luisa
const loading = document.querySelector('.loading');
// const string = '.cart__items';

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
  // saveLocal();
  // pullDiv();
}

// const saveLocal = () => {
//   const ol = document.querySelector(string);
//   const htmlText = ol.innerHTML;
//   localStorage.setItem('lista', htmlText);
// };

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

function click() {
  const itemList = document.querySelector('.items');
  itemList.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      fetchId(event);
    }
  });
}

// const sumItems = () => {
//   const ol = document.querySelector(String);
//   const olChildren = [...ol.children];
//   const priceOl = olChildren.reduce((acc, li) => {
//     let acumulador = acc;
//     acumulador += Number(li.innerText.aplit('$')[1]);
//     return acumulador;
//   }, 0);
//   return priceOl;
// };

// const pullDiv = () => {
//   const div = document.querySelector('.total-price');
//   div.innerText = `${Math.round(sumItens() * 100) / 100}`;
// };

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
  click();
  salvarLocal();
  esvaziarCarrinho();
  // pullDiv();
 };

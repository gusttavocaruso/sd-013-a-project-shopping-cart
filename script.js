/* funcao criada */
const daddy = '.cart__items';
const total = '.total-price';
const setLocal = () => {
  const content = document.querySelector(daddy).innerHTML;
  const price = document.querySelector(total).innerHTML;
  localStorage.setItem('cartList', '');
  localStorage.setItem('cartList', content);
  localStorage.setItem('savePrice', price);
};

/* funcao criada */
const sum = (a, b) => {
  const price = document.querySelector(total);
  const result = a + b;
  price.innerText = Math.round(result * 100) / 100;
  setLocal();
};

const sub = (a, b) => { 
  const price = document.querySelector(total);
  const result = a - b;
  price.innerHTML = Math.round(result * 100) / 100;
  setLocal();
};

const calculaPrecoTotal = (value, operator) => {
  const price = document.querySelector(total);
  const totalValue = Number(price.innerHTML);
  if (operator === '+') sum(totalValue, value);
  if (operator === '-') sub(totalValue, value);
};
/* funcao do projeto */
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

/* funcao do projeto */
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

/* funcao do projeto */
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

/* funcao do projeto */
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
/* funcao do projeto porem criada */
function cartItemClickListener(event) {
  if (event.target.className === 'cart__item') event.target.remove();
  const precoDoProduto = Number(event.target.querySelector('span').innerText);
  calculaPrecoTotal(precoDoProduto, '-');
  setLocal();
}

/* funcao criada */
const addEventListenerToLi = () => {
  const listOfLIs = document.querySelector('.cart__items').childNodes;
  listOfLIs.forEach((eachLi) => {
    eachLi.addEventListener('click', cartItemClickListener);
  });
};

/* funcao criada */
const getLocal = () => {
  const dad = document.querySelector(daddy);
  const content = localStorage.getItem('cartList');
  const price = document.querySelector(total);
  dad.innerHTML = content;
  price.innerHTML = localStorage.getItem('savePrice');
  addEventListenerToLi();
};

/* funcao do projeto */
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerHTML = `SKU: ${sku} | NAME: ${name} | PRICE: $<span>${salePrice}</span>`;
  li.id = salePrice;
  li.addEventListener('click', cartItemClickListener);
  calculaPrecoTotal(salePrice, '+');
  return li;
}

/* funcao criada */
const fecthsku = async (sku) => {
  const promiseF = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const JSON = await promiseF.json();
  return JSON;
};

/* funcao criada */
const addCartItenListner = () => {
  const btnAdd = document.querySelectorAll('.items');
  btnAdd.forEach((btn) => {
    btn.addEventListener('click', async (event) => {
      if (event.target.className === 'item__add') {
        const dad = event.target.parentElement;
        const sku = getSkuFromProductItem(dad);
        const response = await fecthsku(sku);
        const addPC = createCartItemElement(response);
        document.querySelector(daddy).appendChild(addPC);
        setLocal();
      }
    });
  });
};

/* funcao criada */
const createItens = (itens) => {
  itens.forEach((iten) => {
    const itensEle = createProductItemElement(iten);
    const section = document.querySelector('.items');
    section.appendChild(itensEle);
  });
};

/* funcao criada */
const fetchSearch = (query) => {
  const load = document.querySelector('.loading');
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${query}`)
    .then((response) => {
      response.json().then((data) => {
        createItens(data.results);
        load.remove();
      });
    });
};

/* funcao criada */
const emptyBtn = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    const ol = document.querySelectorAll('.cart__item');
    ol.forEach((iten) => {
      iten.parentNode.removeChild(iten);
    });
    const span = document.querySelector(total);
    span.innerText = 0;
    setLocal();
  });
};

window.onload = () => { 
  fetchSearch('computador');
  addCartItenListner();
  getLocal();
  emptyBtn();
};

const string = '.cart__items';

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
// função que salva o item no local storage.
const save = () => {
  const ol = document.querySelector(string);
  const textHtml = ol.innerHTML;
  localStorage.setItem('lista', textHtml);
};
// função que retorna o valor total do carrinho.
const sumItems = () => {
  const ol = document.querySelector(string);
  const divs = [...ol.children];
  const priceTotal = divs.reduce((acc, li) => {
    let accumulator = acc;
    accumulator += Number(li.innerText.split('$')[1]);
    return accumulator;
  }, 0);
  return priceTotal;
};

const newDiv = () => {
  const div = document.querySelector('.total-price');
  div.innerText = `${Math.round(sumItems() * 100) / 100}`;
};

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
// remover o carrinho da lista
function cartItemClickListener(event) {
  event.target.remove();
  save();
  newDiv();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItensToSection = (results) => {
  results.forEach((result) => {
    const itemElement = createProductItemElement(result);
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
  });
};

const fetchML = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => {
      response.json()
      .then((data) => addItensToSection(data.results));
  });
};

const addCart = (event) => {
  const elementoPai = event.target.parentElement;
  const getId = getSkuFromProductItem(elementoPai);
  fetch(`https://api.mercadolibre.com/items/${getId}`)
  .then((response) => {
    response.json()
    .then((data) => {
      const addLi = createCartItemElement(data);
      const addOl = document.querySelector(string);
      addOl.appendChild(addLi);
      save();
      newDiv();
    });
  });
};

const buttonFunction = () => {
  const section = document.querySelector('.items');
  section.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      addCart(event);
    }
  });
};
// função para pegar o valor salvo do local Storage.
const saveReload = () => {
  const searchOl = document.querySelector(string);
  searchOl.innerHTML = localStorage.getItem('lista');
  searchOl.addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') {
      cartItemClickListener(event);
      save();
    }
  });
};

const removeBtn = () => {
  const botao = document.querySelector('.empty-cart');
  botao.addEventListener('click', () => {
    const ol = document.querySelector(string);
    ol.innerHTML = '';
    localStorage.removeItem('lista');
    document.querySelector('.total-price').innerText = 0;
  });
};

window.onload = () => { 
  fetchML('computador');
  buttonFunction();
  saveReload();
  removeBtn();
};

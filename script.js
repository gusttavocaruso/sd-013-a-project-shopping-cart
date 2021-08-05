const cart = '.cart__items';

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const save = () => {
  const olItem = document.querySelector(cart);
  const html = olItem.innerHTML;
  localStorage.setItem('carrinho', html);
};

const soma = () => {
  const elem = document.querySelector(cart);
  const n = [...elem.children];
  const somatorio = n.reduce((acc, cV) => {
    let accumulator = acc;
    accumulator += Number(cV.innerText.split('$')[1]);
    return accumulator;
  }, 0);
  return somatorio;
};
const valorTotal = () => {
  const div = document.querySelector('.total-price');
  div.innerText = `${Math.round(soma() * 100) / 100}`;
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
// Requisito 1
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
  event.target.remove();
  save();
  valorTotal();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = cart;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemsToSection = (items) => {
  items.forEach((item) => {
    const itemElement = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
  });
};

const fetchML = (query) => {
  const loading = document.querySelector('.loading');
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => {
      response.json()
    .then((data) => {
      addItemsToSection(data.results);
      });
      loading.remove();
    });
};

const request = (event) => {
  const elementoPai = event.target.parentElement;
  const getId = getSkuFromProductItem(elementoPai);
  fetch(`https://api.mercadolibre.com/items/${getId}`)
    .then((response) => response.json())
    .then((data) => {
      const li = createCartItemElement(data);
      const ol = document.querySelector(cart);
      ol.appendChild(li);
      save();
      valorTotal();
  });
};

const botaoAddCart = () => { 
  const itemAdd = document.querySelector('.items');
  itemAdd.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      request(event);
    }
   });
};

const get = () => {
  const olItem = document.querySelector(cart);
  olItem.innerHTML = localStorage.getItem('carrinho');
  olItem.addEventListener('click', (event) => {
    if (event.target.className === '.cart__items') {
      cartItemClickListener(event);
      save();
    }
  });
};

const esvaziaCarrinho = () => {
  const ol = document.getElementsByClassName('cart__items')[0];
  while (ol.firstChild) {
    ol.removeChild(ol.firstChild);
  }
  save();
  valorTotal();
};

const botaoEsvaziaCarrinho = () => {
  const botao = document.getElementsByClassName('empty-cart')[0];
  botao.addEventListener('click', esvaziaCarrinho);
};

window.onload = () => {
  fetchML('computador');
  botaoAddCart();
  get();
  valorTotal();
  botaoEsvaziaCarrinho();
};

const string = '.cart__items';

const sumItems = () => {
  const ol = document.querySelector(string);
  const olChildren = [...ol.children];
  const priceOl = olChildren.reduce((acc, li) => {
    let accumulator = acc;
    accumulator += Number(li.innerText.split('$')[1]);
    return accumulator;
  }, 0);
  return priceOl;
};

const pullDiv = () => {
  const div = document.querySelector('.total-price');
  div.innerText = `${Math.round(sumItems() * 100) / 100}`;
};

const saveLocal = () => {
  const ol = document.querySelector(string);
  const htmlText = ol.innerHTML;
  localStorage.setItem('lista', htmlText);
};

function cartItemClickListener(event) {
  event.target.remove();
  saveLocal();
  pullDiv();
}

const getItem = () => {
  const ol = document.querySelector(string);
  ol.innerHTML = localStorage.getItem('lista');
  const olChildren = [...ol.children];
  olChildren.forEach((li) => {
    li.addEventListener('click', cartItemClickListener);
  });
};

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

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const appendData = (resultado) => {
  resultado.forEach((res) => {
    const createElement = createProductItemElement(res);
    const section = document.querySelector('.items');
    section.appendChild(createElement);
  });
};

const fetchML = (item) => {
  const paragraph = document.querySelector('.loading');
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`)
  .then((response) => {
    response.json().then((data) => {
      appendData(data.results);
      paragraph.remove();
      });
    });
};

const fetchItemCart = (element) => {
  const elementoPai = element.target.parentElement;
  const getId = getSkuFromProductItem(elementoPai);
  fetch(`https://api.mercadolibre.com/items/${getId}`)
    .then((response) => {
      response.json()
        .then((data) => {
          const getLi = createCartItemElement(data);
          const olCart = document.querySelector(string);
          olCart.appendChild(getLi);
          saveLocal();
          pullDiv();
        });
    });
};

const button = () => {
  const section = document.querySelector('.items');
  section.addEventListener('click', (element) => {
    if (element.target.className === 'item__add') {
      fetchItemCart(element);
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
  button();
  getItem();
  pullDiv();
  removeBtn();
};

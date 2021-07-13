const olClass = '.cart__items';
const containerDiv = '.total-price';

const somaDeItems = () => {
  const ol = document.querySelector(olClass);
  const olChildren = [...ol.children];
  const priceOl = olChildren.reduce((acc, li) => {
    let accumulator = acc;
    accumulator += Number(li.innerText.split('$')[1]);
    return accumulator;
  }, 0);
  return priceOl;
};
  
const pullDiv = () => {
  const container1 = document.querySelector(containerDiv);
  container1.innerText = `${Math.round(somaDeItems() * 100) / 100}`;
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

const salvarTudo = () => {
  const listPai1 = document.querySelector(olClass);
  const container2 = document.querySelector(containerDiv);
  
  localStorage.setItem('lista', listPai1.innerHTML);
  localStorage.setItem('prices', container2.innerHTML);
};

function cartItemClickListener(event) {
  event.target.remove();
  salvarTudo();
  pullDiv();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const pegarObj = (id) => 
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((result) => result.json())
    .then((data) => data);

const aPromiseML = (pesquisa) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${pesquisa}`)
    .then((data) => data.json())
    .then((subResults) => subResults.results
    .forEach((item) => {
      const itemList = document.querySelector('.items');
      itemList.appendChild(createProductItemElement(item));
    }));
};

const buttonAdd = () => {
  const listPai2 = document.querySelector(olClass);
  listPai2.addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') cartItemClickListener(event);
  });

  const section = document.querySelector('.items');
  section.addEventListener('click', async (event) => {
    if (event.target.className === 'item__add') {
      const elementPai = event.target.parentElement;
      const pegarId = getSkuFromProductItem(elementPai);
      const requisitarObj = await pegarObj(pegarId);
      const addLi = createCartItemElement(requisitarObj);
      listPai2.appendChild(addLi);
      salvarTudo();
      pullDiv();
    }
  });
};

const apagarLi = () => {
  const pegarLis = document.querySelectorAll('.cart__item');
  if (pegarLis) {
    pegarLis.forEach((element) => {
      localStorage.clear();
      element.remove();
    });
  }
  localStorage.clear();
};

const clearCart = () => {
  const buttonClear = document.querySelector('.empty-cart');
  buttonClear.addEventListener('click', apagarLi);
};

const creatPload = () => {
  const body = document.querySelector('.container');
  const criarP = document.createElement('p');
  criarP.className = 'loading';
  criarP.innerHTML = 'loading...';
  body.appendChild(criarP);
};

window.onload = () => {
  creatPload();
  setTimeout(() => {
    const container = document.querySelector('.container');
    container.removeChild(document.querySelector('.loading'));
    aPromiseML('computador');
  }, 2000);

  buttonAdd();
  clearCart();
  if (localStorage.lista) {
    document.querySelector('.cart__items').innerHTML = localStorage.lista;
    document.querySelector(containerDiv).innerHTML = localStorage.prices;
  }
};

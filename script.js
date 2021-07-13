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
  event.target.remove();
}

const createP = (price = 0) => {
  const olPai = document.querySelector('.cart');
  const paragrafo = document.createElement('p');
  paragrafo.innerHTML = `Preço total: $${price}`;
  paragrafo.className = 'total-price';
  olPai.appendChild(paragrafo);
};

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
  const listPai = document.querySelector('.cart__items');
  const salvar = () => localStorage.setItem('lista', listPai.innerHTML);
  listPai.addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') cartItemClickListener(event);
  });
  
  const section = document.querySelector('.items');
  section.addEventListener('click', async (event) => {
    if (event.target.className === 'item__add') {
      const elementPai = event.target.parentElement;
      const pegarId = getSkuFromProductItem(elementPai);
      const requisitarObj = await pegarObj(pegarId);
      const addLi = createCartItemElement(requisitarObj);
      listPai.appendChild(addLi);
      salvar();
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
  const body = document.getElementsByTagName('body')[0];
  const criarP = document.createElement('p');
  criarP.className = 'loading';
  criarP.innerHTML = 'loading...';
  body.appendChild(criarP);
};

window.onload = () => {
  creatPload();

  setTimeout(() => {
    const bodyRemove = document.getElementsByTagName('body')[0];
    bodyRemove.removeChild(document.querySelector('.loading'));
    aPromiseML('computador');
  }, 2000);

  buttonAdd();
  createP();
  clearCart();
  if (localStorage.lista) document.querySelector('.cart__items').innerHTML = localStorage.lista;
};

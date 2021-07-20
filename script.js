const olLista = '.cart__items';

const somaCarrinho = () => {
  const ol = document.querySelector(olLista);
  const olChildren = [...ol.children];
  const olPrice = olChildren.reduce((acc, li) => {
    let acumulador = acc;
    acumulador += parseFloat(li.innerText.split('$')[1]);
    return acumulador;
  }, 0);
  return olPrice;
};

const precoTotal = () => {
  const precoElement = document.querySelector('.total-price');
  precoElement.innerText = `${somaCarrinho()}`;
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const salvar = () => {
  const ol = document.querySelector(olLista);
  localStorage.setItem('lista', ol.innerHTML);
};

function cartItemClickListener(event) {
  event.target.remove();
  precoTotal();
  salvar();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Adicionando na lista:
const fetchItemId = (botao) => {
  const elementoBotao = botao.target;
  const elementoPai = elementoBotao.parentElement;
  const pegarId = elementoPai.firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${pegarId}`)
  .then((response) => response.json())
  .then((data) => {
    const criarLi = createCartItemElement(data);
    const addOl = document.querySelector(olLista);
    addOl.appendChild(criarLi);
    precoTotal();
    salvar();
  });
};

// Criando os elementos:
const appendData = (results) => {
  results.forEach((result) => {
    const createItem = createProductItemElement(result);
    const itemList = document.querySelector('.items');
    itemList.appendChild(createItem);
  });
};

// Requisitando a fetch lista de produtos:
const fetchCart = (pesquisa) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${pesquisa}`)
    .then((response) => response.json())
    .then((data) => appendData(data.results))
    .catch((error) => (error));
};

// Adicionar ao carrinho:
const btnAddCart = () => {
  const section = document.querySelector('.items');
  section.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      fetchItemId(event);
    }
  });
};

const limparCarrinho = () => {
  const btnLimpar = document.querySelector('.empty-cart');
  btnLimpar.addEventListener('click', () => {
    // document.location.reload();
    const ol = document.querySelector(olLista);
    const lis = document.querySelectorAll('.cart__item');
    lis.forEach((elements) => ol.removeChild(elements));
    localStorage.clear();
    precoTotal();
    salvar();
  });
};

const loadApi = () => {
  const loading = document.querySelector('.items');
  const loadingText = document.createElement('p');
  loadingText.className = 'loading';
  loadingText.innerHTML = 'loading...';
  loading.appendChild(loadingText);
  setTimeout(() => {
    fetchCart('computador');
    loadingText.remove();
  }, 2000);
};

window.onload = () => {
  loadApi();
  btnAddCart();
  precoTotal();
  limparCarrinho();
  
  if (localStorage.lista) {
    document.querySelector(olLista).innerHTML = localStorage.lista;
  }
};

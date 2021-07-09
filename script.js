// const fetch = require('node-fetch');
const classNameOl = '.cart__items';

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

// Requisito 1
// Recupera array Results do JSON e puxa a função createProductItem para adicioná-los ao HTML 
const fetchComputers = async () => {
  const fetchAPI = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const getJson = await fetchAPI.json();
  const resultsJson = getJson.results;
  resultsJson.forEach((element) => {
    document.querySelector('.items').appendChild(createProductItemElement(element));
  });
};
// ===========================================================================================
// Requisito 4
// ===========================================================================================
const salveLocalStorage = () => {
  const recoverOl = document.querySelector(classNameOl);
  const OlText = recoverOl.innerHTML;
  localStorage.setItem('products', '');
  localStorage.setItem('products', JSON.stringify(OlText));
};

// ===========================================================================================
// Requsito 3
// ===========================================================================================
function cartItemClickListener(event) { // a função já recebe o evento como parâmetro, então a partir do event.target (onde foi clicado), usa o método remove();
  event.target.remove();
  salveLocalStorage();
}

// ===========================================================================================
// Requisito 2
// ===========================================================================================
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

// Função assíncrona que recupera o JSON da AP do mercado livre, a partir do ID do produto clicado
const apiMl = async (id) => {
  const fetchId = await fetch(`https://api.mercadolibre.com/items/${id}`); // joga a resposta do fetch na const (objeto grande)
  const jsonId = await fetchId.json(); // joga o objeto Json na variável
  return jsonId;
};

const buttonEvent = () => {
  const fatherOfAll = document.querySelector('.items'); // recupera a section pai de todas as outras sections, com classe "items";
  fatherOfAll.addEventListener('click', async (event) => { // adiciona o evento na section pai de todos. 
    if (event.target.className === 'item__add') { // o evento só é disparado se o clique (event.target) for feito no objeto com classe 'item__add' (botões).
      const btnFather = event.target.parentElement; // recupera o pai do botão (section) para jogar na função getSkuFromProductItem (que recupera o ID);
      const btnId = getSkuFromProductItem(btnFather); // função que recupera o ID
      const getJsonApi = await apiMl(btnId); // função que recupera o JSON do API do Mercado Livre. 
      const createLiProduct = createCartItemElement(getJsonApi); // a função createCartItemElement cria uma Li a partir dos dados do Json e adiciona um evento a cada uma delas. 
      document.querySelector(classNameOl).appendChild(createLiProduct); // adiciona o li criado anteriormente como filho do elemento <ol class="cart__items">.
      salveLocalStorage();
    }
  });
};

// ===========================================================================================
// window.onload
// ===========================================================================================

window.onload = () => {
  fetchComputers();
  buttonEvent();
  const recoverLocalStorage = JSON.parse(localStorage.getItem('products'));
  if (recoverLocalStorage !== null) {
    const recoverOl = document.querySelector(classNameOl);
    recoverOl.innerHTML = recoverLocalStorage;
  }
};
// Global
const cartItems = '.cart__items';
// ==========================================================

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

// 1° Desestruturando ID, title, thumbnail que acessar os dados fornecidos pela API
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// 4º Função para fazer o setItem do storage para adicionar/atualizar valores
const setItemsLocalStorage = () => {
  const ol = document.querySelector(cartItems);
  const text = ol.innerHTML; 
  localStorage.setItem('cartList', '');
  localStorage.setItem('cartList', JSON.stringify(text));
};

function cartItemClickListener(event) {
  // 3º Remove item do carrinho clicando nele
  if (event.target.className === 'cart__item') {
    event.target.remove();    
  }
  setItemsLocalStorage();
}

// 4° Função para fazer o getItem do storage para retornar o valor
const getItemsLocalStorage = () => {
  const getLocalStorage = JSON.parse(localStorage.getItem('cartList'));
  const ol = document.querySelector(cartItems);
  ol.innerHTML = getLocalStorage;
  ol.addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') {
      cartItemClickListener(event);
    }
  });
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// 2° Fazendo a resuiqição para a API para pegar por ID utilizando async/await
const pegaComputadorId = async (id) => {
  const fetchApi = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const jsonObject = await fetchApi.json();
  return jsonObject;
};

// Função já existente
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
// 2° Função que adiciona o item ao carrinho
const bttAdicionarAoCarro = () => {
  const parent = document.querySelector('.items'); // recupera a classe que contem os 50 computadores
  parent.addEventListener('click', async (event) => {
    if (event.target.className === 'item__add') { // Se o local que dispara o evento for igual a classe item__add      
      const buttonId = getSkuFromProductItem(event.target.parentElement);
      const buttonData = await pegaComputadorId(buttonId);
      const createComputer = createCartItemElement(buttonData);
      document.querySelector(cartItems).appendChild(createComputer);
      setItemsLocalStorage(); // 4° Chama a função ao disparar o evento, ao add ao carrinho, salva 
    }
  });
};

// 1° Função responsavel por adicionar cada item como filho da section
const addItensToSection = (items) => {
  items.forEach((item) => {
    const itemElement = createProductItemElement(item); // item === produto
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
  });
};

// 1° Estou fazendo a requisição para a API pegando a informação de todos os computadores
const buscaML = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => { // response traz todas a informações
      response.json().then((data) => {
        // Utiliza a função addItensToSection para inserir o data.results
        addItensToSection(data.results);
      });
    });
};

//  6° Função para esvaziar o carrinho
const createButtonRemoveAll = () => {
  const buttonRemoveAll = document.querySelector('.empty-cart'); // Armazena o botão já criado numa constante
  buttonRemoveAll.addEventListener('click', () => { // Adiciono uma escuta no botão com a função
    const ol = document.querySelector(cartItems); // Armazeno numa const toda a ol que contem os intens do carrinho    
    while (ol.firstChild) { // While/enquanto ol tiver um filhos, está é a condição, apagará o primeiro
      ol.removeChild(ol.firstChild);      
      setItemsLocalStorage();
    }
  });
};

window.onload = () => {
  buscaML('computador');
  bttAdicionarAoCarro();
  getItemsLocalStorage();
  createButtonRemoveAll();
};

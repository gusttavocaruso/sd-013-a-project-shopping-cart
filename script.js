// const fetch = require('node-fetch');
// Projeto feito com a ajuda da Lanai, Luiza e Júlia

const olClassName = '.cart__items';

// Cria imagem para cada item - requisito 1
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// cria elementos de forma dinâmica que será criado de fato quando for chamado na função abaixo com os parâmetros do objeto
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// Cria componentes HTML referentes a um produto - requisito 1
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// REQUISITO 1 =================================================================================
const listProducts = () => { // REQUISITO 7 ====================================================
  const getLoading = document.querySelector('.loading'); // pega o elemento P criado no HTML para colocar o loading
  getLoading.innerText = 'loading...'; // acrescenta o texto loading
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  const getSection = document.querySelector('.items');
  
  fetch(url)
    .then((response) => {
      getLoading.remove(); // remove o loading... antes dos elementos computadores serem colocados na tela
      return response.json();
    })
    .then((data) => data.results.forEach((computer) => 
      getSection.appendChild(createProductItemElement(computer))));
};
// =============================================================================================

// pega o id do cart que vai adicionar ao carrinho - requisito 2
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// REQUISITO 4 (parte 1)=======================================================================
// colocar as lis criadas no requisito 3 no localSorage
const setItemLocalStorage = () => {
  const getOl = document.querySelector(olClassName);
  console.log(getOl);
  const lis = getOl.innerHTML; // recupera todas as lis
  localStorage.setItem('liItems', ''); // limpa se tiver algo na chave
  localStorage.setItem('liItems', JSON.stringify(lis)); // guarda os itens a serem colocados no localStorage
};
// =============================================================================================

// REQUISITO 5 =================================================================================
const priceSum = () => {
  const getSpan = document.querySelector('.total-price'); // elemento onde a soma será colocada no html
  const getLi = document.querySelectorAll('.cart__item');
  let sum = 0;
  getLi.forEach((item) => {
    const price = item.innerText.split('$');
    sum += Number(price[1]);
  });
  getSpan.innerText = `${(Math.round((sum * 100)) / 100)}`;
};

function cartItemClickListener(event) {
  event.target.remove(); // REQUISITO 3 ========================================================
  setItemLocalStorage(); // é preciso chamar a função do local storage para atualizá-lo sempre que um item for removido
  priceSum();
}

// cria o elemento li do carrinho - requisito 2
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// REQUISITO 4 (parte 2)========================================================================
const getItemLocalStorage = () => {
  const getLocalStorage = JSON.parse(localStorage.getItem('liItems')); // recupera o item criado no setItem
  const getOl = document.querySelector(olClassName); // recuperando ol
  getOl.innerHTML = getLocalStorage; // coloca os itens que foram salvos
  getOl.addEventListener('click', (event) => { // adiciona o evento de clique para apagar do localStorage quando apaga da lista
    if (event.target.className === 'cart__item') {
      cartItemClickListener(event);
    }
  });
};
// =============================================================================================

// REQUISITO 2 =================================================================================
const getCartItem = async (ItemID) => {
  const fetchCart = await fetch(`https://api.mercadolibre.com/items/${ItemID}`);
  const apiJson = await fetchCart.json();
  return apiJson;
};

const buttonCart = () => {
  const getSection = document.querySelector('.items');
  getSection.addEventListener('click', async (event) => {
    if (event.target.className === 'item__add') { // especifica o único elemento da seção que pode ser clicado que é o botão
    const getCart = event.target.parentElement; // pega o pai do botão para usar depois para acessar o id
    const cartId = getSkuFromProductItem(getCart); // acessa o id
    const buttonData = await getCartItem(cartId); // acessa os dados de cada cart
    const computer = createCartItemElement(buttonData); // cria o elemento que irá para o carrinho
    const getOl = document.querySelector(olClassName); // pega o elemento pai que é a OL
    getOl.appendChild(computer);
    setItemLocalStorage(); // chama a função do localStorage pra acrescentar o lis lá 
    priceSum();
  }
});
};
// =============================================================================================

// REQUISITO 6 =================================================================================
const buttonEmptyCart = () => {
  const getButton = document.querySelector('.empty-cart');
  getButton.addEventListener('click', () => {
    const getOl = document.querySelector(olClassName);
    while (getOl.firstChild) { // enquanto existir a primeira filha da ol:
      getOl.removeChild(getOl.firstChild); // essa filha será removida
      priceSum(); // chama a função de soma para atualizar o preço total
      setItemLocalStorage(); // chama a função para atualizar o localStorage
    }
  });
};

window.onload = () => {
  listProducts();
  buttonCart();
  getItemLocalStorage();
  priceSum();
  buttonEmptyCart();
};

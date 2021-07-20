// Variáveis Globais
const getItems = document.querySelector('.items');
const getCart = document.querySelector('.cart__items');
const getTotalPrice = document.querySelector('.total-price');
const getEmptyButton = document.querySelector('.empty-cart');
const loading = document.querySelector('.loading');
const getDarkMode = document.querySelector('.darkMode');

function createProductImageElement(imageSource) { // Função que cria o card do produto
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const saveCart = () => { // Essa função salva os valores do carrinho e seus preços no local storage
  localStorage.setItem('saveCart', getCart.innerHTML);
  localStorage.setItem('savePrice', getTotalPrice.innerHTML);
};

getEmptyButton.addEventListener('click', () => { // Adiciono uma escuta para o botão limpar o carrinho
  const getFullCart = document.querySelectorAll('.cart__item'); // Pego cada item do carrinho
  getFullCart.forEach((item) => item.parentNode.removeChild(item)); // Removo cada item dele com forEach
  getTotalPrice.innerHTML = 0; // Reseto o preço total dos itens do carrinho

  saveCart(); // Executo a função para salvar o carrinho
});

const sum = (value, operation) => { // Função para somar os valores dos produtos
  const result = value + operation;
  getTotalPrice.innerHTML = Math.round(result * 100) / 100;
  
  saveCart(); // Salvo carrinho após somar os valores dos produtos
};

const sub = (value, operation) => { // Função para somar os valores dos produtos
  const result = value - operation;
  getTotalPrice.innerHTML = Math.round(result * 100) / 100;

  saveCart(); // Salvo carrinho após subtrair os valores dos produtos
};

// Resolvi consultando o Matheus Duarte T13-A
const setTotalPrice = (value, operation) => {
  const getActualPrice = Number(getTotalPrice.innerHTML); // Transformo o innerHTML(string) do preço total do carrinho em Number

  // Realizando as funções acima com base no operador escolhido
  if (operation === '+') sum(getActualPrice, value);
  if (operation === '-') sub(getActualPrice, value);
};

const returnCart = () => { // Função para retornar os valores do carrinho salvos no local storage
  getCart.innerHTML = localStorage.getItem('saveCart');
  getTotalPrice.innerHTML = localStorage.getItem('savePrice');
};

const removeCartItem = (event) => { // Função para remover item do carrinho
  if (event.target.className === 'cart__item') {
    event.target.remove(); // removo o item selecionado

    const getProductPrice = event.target.querySelector('span').innerText; 
    setTotalPrice(getProductPrice, '-'); // Criei uma constante que define o preço do item selecionado para subtrair valor total do carrinho

    saveCart();
  }
};

// Usei destructuring para pegar apenas o sku, name e price como parâmetros
const setCartItem = ({ id: sku, title: name, price: salePrice }) => { // Função para adicionar item no carrinho
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerHTML = `SKU: ${sku} | NAME: ${name} | PRICE: $<span>${salePrice}</span>`; // O innerhtml do item do carrinho deve conter as informações dos parâmetros desta função.

  getCart.appendChild(li);
  setTotalPrice(salePrice, '+'); 
};

const setProductCart = async (ID) => {
  try {
    const api = await fetch(`https://api.mercadolibre.com/items/${ID}`); // Acesso a api do produto pelo Sku passado
    const productInfo = await api.json(); 

    setCartItem(productInfo); // Esta função recebe o json retornado acima como parâmetro
    saveCart();
  } catch (error) {
    alert(error);
  }
};

function createCustomElement(element, className, innerText) { // Função que cria os elementos dentro do card do produto
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// A escuta é criada diretamente dentro do botão
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.lastElementChild.addEventListener('click', (event) => {
    const productID = event.target.parentElement.firstElementChild.innerText; // Equivale ao Sku que está invisível na página
    setProductCart(productID); // O Sku equivale ao id do produto e está função o recebe como parâmetro
  });

  getItems.appendChild(section);
}

const catchProducts = async (product = 'computador') => { // Função que adiciona os computadores na página
  try {
    const api = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`);
    const apiJson = await api.json();
    apiJson.results.forEach((computador) => createProductItemElement(computador), loading.remove());
  } catch (e) {
    alert(e);
  }
};

getDarkMode.addEventListener('click', () => {
  const body = document.querySelector('body').style;
  if (body.backgroundColor === 'rgb(55, 63, 81)') {
    body.backgroundColor = 'white';
    body.color = 'black';
    getDarkMode.innerText = '🌚';
    getDarkMode.style.backgroundColor = '#ffe868';
  } else {
    body.backgroundColor = 'rgb(55, 63, 81)';
    body.color = 'white';
    getDarkMode.innerText = '🌝';
    getDarkMode.style.backgroundColor = '#4a788f';
  }
});

getCart.addEventListener('click', (removeCartItem));

window.onload = () => { 
  catchProducts();
  returnCart();
};

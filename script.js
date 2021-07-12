// const fetch = require('node-fetch'); achei que precisava assim como o assert, mas o lint não aceitou, ainda assim, pelo terminal tive que instalar o fetch para que funcionasse
const cartItems = '.cart__items';

// Função já existente
// Objetivo: Criar as imagens que serão renderizadas no browser
function createProductImageElement(imageSource) {
  const img = document.createElement('img'); // cria o elemento img
  img.className = 'item__image'; // dá uma classe para cada item img
  img.src = imageSource; // usa o parâmetro como src
  return img; // retorna a imagem
}

// Função já existente
// Objetivo: Criar alementos, com classes e acessar o html

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element); // cria elemento que for colocado no parâmetro element
  e.className = className; // dá a classe que for colocada no parâmetro className
  e.innerText = innerText; // renderiza
  return e;
}

// ==============================================

// Requisito 5 - Some o valor total dos itens do carrinho de compras

// ==============================================

// Exercício 5: Passo 1 - Criar no index.html:
// <p>Preço Total: <span class="total-price"></span></p>

// Exercício 5: Passo 2 - Criar função totalPrice()
// Objetivo: Somar 
// Função já veio no projeto, porém vazia, ou seja, o escopo da função foi criado

function totalPrice() {
  const getTotalPrice = document.querySelector('.total-price'); // acessamos o elemento que criamos no html chamando ele pela classe
  let price = 0; // iniciamos nosso preço total em 0
  const AllLi = document.querySelectorAll('li'); // selecionamos todas as lis
  AllLi.forEach((item) => { // para cada item da li
  const computer = item.innerText.split('$'); // vamos até o código do HTML e fazemos um split, que vai separar tudo do preço que vinha com $0000 (preço)
  price += Number(computer[1]); // indicamos a partir do número, sem o $, que é onde vamos acessar apenas os números para fazer a soma
  });
  getTotalPrice.innerHTML = `${(Math.round((price * 100)) / 100)}`; // Verifiquei no Slack de uma das turmas antigas que estavam usando esse formato no código
  }

  // Chamar função do Requisito 5 dentro da função do Requisito 3, que apaga tudo
  // Chamar função do Requisito 5 dentro da função do Requisito 6, para que a soma esteja acessível lá

// ==============================================

// Requisito 1 - Crie uma listagem de produtos

// ==============================================

// Exercício 1: Passo 2 - Verificar como essa função funciona e usar na função getJsonOnLink
// Função já existente no código
// Objetivo: Criar elementos dentro de sections

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// Exercício 1: Passo 1
// Função criada
// Objetivo: Resgatar os elementos do JSON e enviá-los para o html dinamicamente

const getJsonOnLink = async (query) => {
  const api = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${query}`);
  const apiJson = await api.json();
  const arrayResultsJson = apiJson.results; // acessa exatamente os results do json que é onde iremos trabalhar
  arrayResultsJson.forEach((product) => document.querySelector('.items') // percorrer cada computador que contenha a classe .items e injetar a função que cria os elementos no html
    .appendChild(createProductItemElement(product))); // usando a função createProductItemElement para criar realmente o elemento
};

// ==============================================

// Requisito 4 - Carregue o carrinho de compras através do LocalStorage ao iniciar a página [PARTE 1]

// ==============================================

// Exercício 4: Passo 1
// Função criada
// Objetivo: Fazer o setItem do Local Storage

const setItemsLocalStorage = () => {
  const ol = document.querySelector(cartItems); // resgatando ol
  const text = ol.innerHTML; // acessar html
  localStorage.setItem('cartList', ''); // limpando o que tinha antes
  localStorage.setItem('cartList', JSON.stringify(text)); // pegar todo o texto de dentro da variável e transforma no formato JSON
};

  // Chamar função do Requisito 5 dentro da função do Requisito 3, que apaga tudo

// ==============================================

// Requisito 3 - Remova o item do carrinho de compras ao clicar nele [Resolvido com ajuda de Luíza Antiques]

// ==============================================

// Exercício 3: Passo 1
// Função veio com o projeto, mas veio vazia
// Como já temos a função createCartItemElement() que cria as lis, aqui apenas removemos o evento criado
// Objetivo: Apagar coisas

function cartItemClickListener(event) {
  event.target.remove(); // Exercício 3: Passo 2
  setItemsLocalStorage(); // chamando a função do requisito 4
  totalPrice(); // chamando a função do requisito 5
}

// ==============================================

// Requisito 4 - Carregue o carrinho de compras através do LocalStorage ao iniciar a página [PARTE 2]

// ==============================================

// Exercício 4: Passo 2
// Objetivo: Fazer o getItem nos itens do Local Storage

const getItemsLocalStorage = () => {
  const getLocalStorage = JSON.parse(localStorage.getItem('cartList')); // recupera o item criado no requisito 4
  const ol = document.querySelector(cartItems); // pegar onde tem os itens
  ol.innerHTML = getLocalStorage; // e colocar os itens que já tinham sido salvos
  ol.addEventListener('click', (event) => { // se algum elemento da ol for clicado
    if (event.target.className === 'cart__item') { // e contiver a classe cart__item
      cartItemClickListener(event); // será apagado (usando a função do requisito 3)
    }
  });
};

// ==============================================

// Requisito 2 - Adicione o produto ao carrinho de compras

// ==============================================

// Exercício 2: Passo 2
// Função já existente no projeto
// Objetivo: criar o elemento li dentro da ol no formato id, name, price

function createCartItemElement({ id: sku, title: name, price: salePrice }) { // desestruturando
  const li = document.createElement('li'); // criando li
  li.className = 'cart__item'; // para cada li criada a classe cart__item é adicionada
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`; // o formato que será entregue na li
  li.addEventListener('click', cartItemClickListener); // o segundo parâmetro é a função que ainda vamos implementar no Requisito 3
  return li;
}

// Exercício 2: Passo 1
// Função criada
// Objetivo: Acessar cada link único de cada computador da API

const getCartComputer = async (id) => { // função assíncrona que recebe o id dos computadores como parâmetro
  const api = await fetch(`https://api.mercadolibre.com/items/${id}`); // aguarda resposta do link da API
  const apiJson = await api.json(); // aguarda o formato json do link da API
  return apiJson;
};

// Função já existente no projeto
// Objetivo:

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Função criada (PASSO 2)
// Objetivo: selecionar o botão do 'Adicionar ao carrinho' e criar um evento de click que cria uma lista

const buttonAddCart = () => {
  const parent = document.querySelector('.items'); // acessamos a classe que possui os 50 computadores
  parent.addEventListener('click', async (event) => {
    if (event.target.className === 'item__add') { // se o click no botão do Add carrinho for feito
      const buttonParent = event.target.parentElement; // acessando o pai do botão pq temos uma função que pega o ID do computador
      const buttonId = getSkuFromProductItem(buttonParent);
      const buttonData = await getCartComputer(buttonId); // acessa o link de cada computador
      const createComputer = createCartItemElement(buttonData); // cria no formato id, nome e preço as lis de acordo com os dados do json que foram específicados na função createCartItemElement
      document.querySelector(cartItems).appendChild(createComputer); // tornamos o retorno no formato especificado na createCartItemElement um filho de onde devem aparecer essas lis
      setItemsLocalStorage(); // chamando a função do requisito 4
      totalPrice();
    }
  });
};

// ==============================================

// Requisito 6 - Crie um botão para limpar carrinho de compras

// ==============================================

// Função criada
// Objetivo: Remover todas as lis criadas após apertarmos o botão

const buttonRemoveAll = () => {
  const getButtonRemoveAll = document.querySelector('.empty-cart'); // selecionamos o botão que remove tudo
  getButtonRemoveAll.addEventListener('click', () => { // evento de click
    const ol = document.querySelector(cartItems); // pegamos o caminho da ol
    while (ol.firstChild) { // e enquanto existir a primeira filha da ol (li)
      ol.removeChild(ol.firstChild); // vamos removê-la
      totalPrice(); // chamar função do Requisito 5 que soma o valor total dos itens colocados no carrinho
      setItemsLocalStorage(); // chamar função do Requisito 4, que guarda informações na Local Storage
    }
  });
};

// Chamar as funções quando a página iniciar

window.onload = () => {
  getJsonOnLink('computador');
  buttonAddCart();
  getItemsLocalStorage();
  totalPrice();
  buttonRemoveAll();
};

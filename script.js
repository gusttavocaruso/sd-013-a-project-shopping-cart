function createProductImageElement(imageSource) {
  const img = document.createElement('img'); // cria o elemento img
  img.className = 'item__image'; // dá uma classe para cada item img
  img.src = imageSource; // usa o parâmetro como src
  return img; // retorna a imagem
}

// Função já existente
// Objetivo: criar elementos, com classes e acessar o html
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element); // cria elemento que for colocado no parâmetro element
  e.className = className; // dá a classe que for colocada no parâmetro className
  e.innerText = innerText; // renderiza...como assim renderiza?
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

// ======================================
// Requisito 6
// 1o passo: criar uma função que cria um botão que ao ser clicado remove todos os itens do carrinho
// Feito com a ajuda do Notion da turma
// ======================================

const removeItemsCart = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    const getLi = document.querySelectorAll('.cart__item');
    getLi.forEach((item) => item.parentNode.removeChild(item));
  });
};

// =======================================
// Requisito 3
// =======================================
function cartItemClickListener(event) { // função que cria o evento de click, para remover item da lista
  event.target.remove();
}

// =====================

// Requisito 2

// =====================

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Função de adicona o elemeto filho ao elemento pai quando clicar no botão "adicionar ao carrinho"
const fetchId = (itemId) =>
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then((response) => response.json())
    .then((data) => {
      const createLi = createCartItemElement(data);
      const recuperateOl = document.querySelector('.cart__items');
      recuperateOl.appendChild(createLi);
    });

// Função que cria o evento de click no botão para adicionar o item ao carrinho quando clicar no botão.
const adicionaItem = () => {
  const getButton = document.getElementsByClassName('item__add');
    for (let index = 0; index < getButton.length; index += 1) {
      getButton[index].addEventListener('click', (event) => {
      const itemId = getSkuFromProductItem(event.target.parentElement);
      fetchId(itemId);
      });
    }
};

// ==================

// Requisito 1 - cria uma listagem de produtos

// ==================

// Parte 2
const addItensToSection = (items) => {
  items.forEach((item) => {
    const itemElement = createProductItemElement(item); // item == produto
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
  });
};

// Parte 1
// Função criada
// Objetivo: Resgatar os elementos do JSON e enviá-los para o html dinamicamente

const fetchML = (query) => { // query = pesquisa
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`) // o que o fetch retorna? uma PROMISE
    .then((response) => { // response traz todas as informações
      response.json().then((data) => { // o json também retorna uma PROMISE
        addItensToSection(data.results);
        adicionaItem(); // Função do requisito 2
        removeItemsCart();
      });
    });
};

// Chamar as funções quando a página iniciar
window.onload = () => {
  fetchML('computador');
};

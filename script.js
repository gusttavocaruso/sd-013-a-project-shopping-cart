const addLoading = document.querySelector('.loading');
const ol = document.querySelector('.cart__items');
const liLocalStorage = localStorage.getItem('item-cart');
ol.innerHTML = liLocalStorage;

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

// Requisot 6 Função que apaga tudo
const removeItemsCart = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
  const li = document.querySelectorAll('.cart__item');
    li.forEach((item) => item.parentNode.removeChild(item));
  });
};

// Requisito 3
// função que cria o evento de click, para remover item da lista
function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Função de adicona o elemeto filho ao elemento pai quando clicar no botão "adicionar ao carrinho"
const productML = (itemId) =>
   fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then((response) => response.json())
    .then((itemLi) => {
      // const item = {
      //   sku: itemLi.id,
      //   name: itemLi.title,
      //   salePrice: itemLi.price,
      // };
      // ol.appendChild(item);
      localStorage.setItem('item-cart', ol.innerHTML);
      const item = createCartItemElement(itemLi);
      ol.appendChild(item);
      localStorage.setItem('item-cart', ol.innerHTML);
    });

// Função que cria o evento de click no botão para adicionar o item ao carrinho quando clicar no botão.
const addEventBtn = () => {
  const button = document.getElementsByClassName('item__add');
    for (let i = 0; i < button.length; i += 1) {
      button[i].addEventListener('click', (event) => {
      const itemId = getSkuFromProductItem(event.target.parentElement);
      productML(itemId);
      });
    }
};

// Função que adiciona ao HTML, os itens trazidos da requisição feita pela função mercadoLivre
const addItensTo = (items) => {
  items.forEach((item) => {
   const createItem = createProductItemElement(item);
   const addItemSection = document.querySelector('.items');
   addItemSection.appendChild(createItem);
  });
};

// função que efetua a requisição a API do mercado livre
const mercadoLivre = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  .then((response) => {
    response.json()
  .then((data) => {
    addItensTo(data.results); // Chama a função que adiciona Itens ao elemeneto HTML.
    addLoading.remove();
    addEventBtn(); // Chama a função com evento de click no botão, que adiciona os itens ao html
    removeItemsCart();
  });
  });
};
// window.onload = () => {}
mercadoLivre('computador');

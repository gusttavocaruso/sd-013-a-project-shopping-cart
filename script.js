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

function cartItemClickListener() {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const produtoML = (itemId) => fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then((response) => response.json())
    .then((data) => {
      const item = createCartItemElement(data);
      const ol = document.querySelector('.cart__items');
      ol.appendChild(item);
      console.log(item);
    });

// Função que cria o evento de click no botão para adicionar o item ao carrinho quando clicar no botão.
const addEventBtn = () => {
  const btn = document.getElementsByClassName('item__add');
  for (let i = 0; i < btn.length; i += 1) {
    btn[i].addEventListener('click', (event) => {
     const itemId = getSkuFromProductItem(event.target.parentElement);
     produtoML(itemId);
    });
  }
};

// Função que adiciona ao HTML, os itens trazidos da requisição
const addItensTo = (items) => {
  items.forEach((item) => {
   const createItem = createProductItemElement(item);
   const addItemSection = document.querySelector('.items');
   addItemSection.appendChild(createItem);
  });
};

const mercadoLivre = (query) => { // função que efetua a requisição a API do mercado livre
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  .then((response) => {
    response.json()
  .then((data) => {
    addItensTo(data.results); // Chama a função que adiciona Itens ao elemeneto HTML.
    addEventBtn(); // Chama a função que adiciona o evento no botão
    });
  });
};
window.onload = () => {
  mercadoLivre('computador');
};

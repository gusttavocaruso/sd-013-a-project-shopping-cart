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

function cartItemClickListener() {
  
}

// Cria a lista de elementos para ser adicionada ao carrinho;
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const createCartListElement = document.createElement('li');
  createCartListElement.className = 'cart__item';
  createCartListElement.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  createCartListElement.addEventListener('click', cartItemClickListener);

  return createCartListElement;
}

// Faz a segunda requisição a API do ML pra recuperar o 'id' do elemento;
// Popula a lista que será adicionada ao carinho;
const fetchOneItem = (productId) => {
  fetch(`https://api.mercadolibre.com/items/${productId}`)
    .then((response) => response.json())
    .then((results) => {
      const getOrderListCart = document.querySelector('.cart__items');
      getOrderListCart.appendChild(createCartItemElement(results));
    });
};

// Acessa o 'id' do elemento e acrescenta como parâmetro da função 'fetchOneItem';
const addItemToCart = (event) => {
  fetchOneItem(event.target.parentElement.firstChild.innerText);
};

// Cria e popula a section com os elementos trazidos a partir da requisição;
// Adiciona o 'Event Listener' aos botões de cada elemento(produto);
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const createButtonAdd = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(createButtonAdd);
  createButtonAdd.addEventListener('click', addItemToCart);
  const getSectionItems = document.querySelector('.items');
  getSectionItems.appendChild(section);

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// Faz a requisição na API do Mercado Livre;
const returnFetch = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => response.json()
    .then((data) => data.results)
    .then((results) => results.forEach((result) => createProductItemElement(result))));
};

window.onload = () => {
  returnFetch('computador');
};

const getClearButton = document.querySelector('.empty-cart');
const getOrderListCart = document.querySelector('ol.cart__items');

// Cria a imagem de todos os produtos da lista;
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// Cria os elementos da lista a partir do fetch;
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// Salva Itens do carrinho no Local Storage;
const saveCartItems = () => {
  localStorage.setItem('products', getOrderListCart.innerHTML);
};

// Cria o botão que limpa a lista de itens do carrinho;
const clearButton = () => {
  getClearButton.addEventListener('click', () => {
    getOrderListCart.innerHTML = '';
    saveCartItems();
  });
};

// Remove o elemento do carrinho ao ser clicado;
function cartItemClickListener(event) {
  event.target.remove();
  saveCartItems();
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
      getOrderListCart.appendChild(createCartItemElement(results));
      saveCartItems();
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

// Limpa a Tag .loading após o carregamento da página;
const clearTagLoading = () => {
  const clearLoading = document.querySelector('.loading');
  clearLoading.remove();
};

// Faz a requisição na API do Mercado Livre;
const returnFetch = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => response.json()
    .then((data) => data.results)
    .then((results) => {
      results.forEach((result) => createProductItemElement(result));
      clearTagLoading();
    }));
};

// Carrega os produtos do carrinho a partir do Local Storage;
const loadCartFromLocalStorage = () => {
  getOrderListCart.innerHTML = localStorage.getItem('products');
  getOrderListCart.addEventListener('click', (event) => {
    event.target.remove();
    saveCartItems();
  });
};

window.onload = async () => {
  await returnFetch('computador');
  clearButton();
  loadCartFromLocalStorage();
};

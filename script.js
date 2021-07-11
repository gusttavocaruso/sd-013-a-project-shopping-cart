const apiMercadoLivre = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const cartsItems = document.querySelector('.cart__items');

const updateTotalPrice = (newComputerPrice) => {
  const elementoTotalPrice = document.querySelector('.total-price');
  const currentPrice = Number(elementoTotalPrice.innerHTML);
  elementoTotalPrice.innerHTML = currentPrice + newComputerPrice;
};

function cartItemClickListener(event) {
  const element = event.target;

  element.remove();

  const id = element.getAttribute('data-id');
  const computersFromLocalStorage = window.localStorage.getItem('computadoresNoCarrinhoDeCompras');
  const computerList = JSON.parse(computersFromLocalStorage);
  const computerListUpdated = computerList.filter((computer) => computer.id !== id);

  window.localStorage.setItem(
    'computadoresNoCarrinhoDeCompras',
    JSON.stringify(computerListUpdated),
  );

  const elementPrice = Number(element.innerText.split('$')[1]);

  updateTotalPrice(elementPrice * -1);
}

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

function createProductItemElement({ sku, name, image }) {
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

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.setAttribute('data-id', sku);
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

//  DEBORA CODE

const addLocalStorageItems = (dados) => {
  // local storage
  // pegar os items que ja foram adicionados
  const valorDoLocalStorage = JSON.parse(
    window.localStorage.getItem('computadoresNoCarrinhoDeCompras'),
  );
  const computerAdicionados = valorDoLocalStorage || [];

  // adiciona aos items ja salvos um novo computador
  computerAdicionados.push(dados);

  // salvando no local storage novamente
  window.localStorage.setItem(
    'computadoresNoCarrinhoDeCompras', JSON.stringify(computerAdicionados),
  );
};

const getCartComputer = async (id) => {
  const api = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const apiJason = await api.json();
  return apiJason;
};

const buttonDeleteAllCards = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    cartsItems.innerHTML = '';
  });
};

const buttonAddCards = () => {
  const classSection = document.querySelector('.items');
  classSection.addEventListener('click', async (evento) => {
    if (evento.target.className === 'item__add') {
      const buttonDeAdicionar = evento.target.parentElement;
      const idDoComputador = getSkuFromProductItem(buttonDeAdicionar);
      const dadosDoComputador = await getCartComputer(idDoComputador);
      const elementoLiComputador = createCartItemElement(dadosDoComputador);
      cartsItems.appendChild(elementoLiComputador);
      addLocalStorageItems(dadosDoComputador);
      updateTotalPrice(dadosDoComputador.price);
    }
  });
};

async function fetchApi() {
  const response = await fetch(apiMercadoLivre);
  const data = await response.json();
  const { results } = data;
  results.forEach((produto) => {
    const novoProduto = {
      sku: produto.id,
      name: produto.title,
      image: produto.thumbnail,
    };
    const element = createProductItemElement(novoProduto);
    const items = document.querySelector('.items');
    items.appendChild(element);
  });
}

const getComputersFromLocalStorage = () => {
  const computersFromLocalStorage = window.localStorage.getItem('computadoresNoCarrinhoDeCompras');
  const computerList = JSON.parse(computersFromLocalStorage) || [];

  computerList.forEach((computer) => {
    const elementoLiComputador = createCartItemElement(computer);
    cartsItems.appendChild(elementoLiComputador);
  });
};

window.onload = () => {
  fetchApi();
  buttonAddCards();
  getComputersFromLocalStorage();
  buttonDeleteAllCards();
};

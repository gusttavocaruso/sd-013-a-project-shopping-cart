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

function cartItemClickListener(event) {
  if (event.target.className === 'cart__item') {
    event.target.remove();
  }
}

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
// Função que adiciona o item ao carrinho
const bttAdicionarAoCarro = () => {
  const parent = document.querySelector('.items'); // recupera a classe que contem os 50 computadores
  parent.addEventListener('click', async (event) => {
    if (event.target.className === 'item__add') { // Se o local que dispara o evento for igual a classe item__add      
      const buttonId = getSkuFromProductItem(event.target.parentElement);
      const buttonData = await pegaComputadorId(buttonId);
      const createComputer = createCartItemElement(buttonData);
      document.querySelector(cartItems).appendChild(createComputer);     
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

window.onload = () => {
  buscaML('computador');
  bttAdicionarAoCarro();
};

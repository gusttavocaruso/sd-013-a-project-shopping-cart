const apiMercadoLivre = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

function cartItemClickListener(event) {
  event.target.remove();
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

const getCartComputer = async (id) => {
  const api = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const apiJason = await api.json();
  return apiJason;
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const buttonAddCards = () => {
  const classSection = document.querySelector('.items');
  classSection.addEventListener('click', async (evento) => {
    if (evento.target.className === 'item__add') {
      const buttonPai = evento.target.parentElement;
      const buttonId = getSkuFromProductItem(buttonPai);
      const buttonData = await getCartComputer(buttonId);
      const computer = createCartItemElement(buttonData);
      document.querySelector('.cart__items').appendChild(computer);
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

window.onload = () => {
  fetchApi();
  buttonAddCards();
};

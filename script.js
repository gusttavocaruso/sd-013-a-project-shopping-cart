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

const listaProduto = async () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  return fetch(url)
    .then((response) => response.json()
    .then((data) => data));
};

const listaComputadorPorId = async (id) => {
  const url = `https://api.mercadolibre.com/items/${id}`;
  return fetch(url)
    .then((response) => response.json()
    .then((data) => data));
};

function computadoresNoCarrinho() {
  const listaComputadores = localStorage.getItem('pc');
  document.querySelector('.cart__items').innerHTML = listaComputadores;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addCart() {
  const idComputador = this.parentNode.firstChild.innerText;
  listaComputadorPorId(idComputador)
    .then((response) => {
      const objComputador = {
        sku: response.id,
        name: response.title,
        salePrice: response.price,
      };
      const computador = createCartItemElement(objComputador);
      document.querySelector('.cart__items').appendChild(computador);
      localStorage.setItem('pc', document.querySelector('.cart__items').innerHTML);
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', addCart);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = () => {
  listaProduto()
    .then((response) => {
      response.results.forEach((result) => {
        const objComputador = {
          sku: result.id,
          name: result.title,
          image: result.thumbnail,
        };
        const computadores = createProductItemElement(objComputador);
        document.querySelector('.items').appendChild(computadores);
      });
    });
  computadoresNoCarrinho();
};

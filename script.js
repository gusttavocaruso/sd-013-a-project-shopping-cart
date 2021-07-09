function constantes() {
  const cartItems = document.querySelector('.cart__items');
  const tPrice = document.querySelector('.total-price');
  return {
    pcs: cartItems,
    totalPrices: tPrice,
  };
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

const listaComputadorPorId = async (id) => {
  const url = `https://api.mercadolibre.com/items/${id}`;
  return fetch(url)
    .then((response) => response.json()
    .then((data) => data));
};

function computadoresNoCarrinho() {
  constantes().pcs.innerHTML = localStorage.getItem('pc');
  constantes().totalPrices.innerHTML = (localStorage.getItem('total') === null ? 0
    : localStorage.getItem('total'));
}

function cartItemClickListener(event) {
  const valor = event.target.innerHTML.split('$')[1];
  const total = Number(constantes().totalPrices.innerHTML) - valor;
  localStorage.setItem('total', total);
  constantes().totalPrices.innerHTML = Math.round(total * 100) / 100;
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const somarPreco = (price) => {
  const total = Number(constantes().totalPrices.innerHTML) + price;
  localStorage.setItem('total', Math.round(total));
  constantes().totalPrices.innerHTML = Math.round(total * 100) / 100;
};

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
      constantes().pcs.appendChild(computador);
      localStorage.setItem('pc', constantes().pcs.innerHTML);
      somarPreco(response.price);
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

const listagemPesquisa = (data) => {
  data.results.forEach((result) => {
    const objComputador = {
      sku: result.id,
      name: result.title,
      image: result.thumbnail,
    };
    const computadores = createProductItemElement(objComputador);
    document.querySelector('.items').appendChild(computadores);
  });
};

const requestML = async () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  return fetch(url)
    .then((response) => response.json()
    .then((data) => listagemPesquisa(data)));
};

function limparCart() {
  localStorage.removeItem('pc');
  localStorage.removeItem('total');
  while (constantes().pcs.firstChild) {
    constantes().pcs.removeChild(constantes().pcs.firstChild);
  }
}

window.onload = () => {
  requestML()
    .then(() => document.querySelector('.loading').remove());
  computadoresNoCarrinho();

  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', limparCart);
};

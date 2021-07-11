const cartItenms = document.querySelector('.cart__items');
// dica Matheus Duarte, Matheus Camillo, Josue, Rafael.
const valorTotal = document.querySelector('#totalPreco');
const bntClear = document.querySelector('.empty-cart');

// Soma o valor passando com o valor total da compra.
const soma = (valor) => {
  const total = Number(valorTotal.innerText) + valor;
  valorTotal.innerText = total;
};

// Subtrair o valor passando pelo valor total da compra.
const sub = (valor) => {
  const total = Number(valorTotal.innerText) - Number(valor.querySelector('#p').innerText);
  valorTotal.innerText = Math.round(total * 100) / 100;
};

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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Salva os produtos no local Storage.
const salveCart = () => {
  localStorage.setItem('product', cartItenms.innerHTML);
};

// Add o evento de remove nos produtos da lista
function cartItemClickListener(eventt) {
  eventt.target.remove();
  sub(eventt.target);
  salveCart();
}

// Carrega os produtos salvos no local Storage e add evento de remove.
const loadCart = () => {
  cartItenms.innerHTML = localStorage.getItem('product');
  document.querySelectorAll('.cart__item').forEach((el) =>
    el.addEventListener('click', (event) => {
      event.target.remove();
      sub(event.target);
      salveCart();
    }));
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerHTML = `SKU: ${sku} | NAME: ${name} | PRICE: $<span id='p'>${salePrice}<span>`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Faz a requisição de um produto pela a Id, salva e soma o valor.
const addItemToCart = async (id) => {
  const productDate = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const product = await productDate.json();
  cartItenms.appendChild(createCartItemElement(product));
  soma(product.price);
  salveCart();
};

// Add o evento ao elemento do produto de add item ao carrinho.
const addItemCart = (elemnto) => {
  elemnto.querySelector('.item__add').addEventListener('click', () => {
    addItemToCart(getSkuFromProductItem(elemnto));
  });
  return elemnto;
};

// Recebe uma lista de produtos para criar os elemento sessao da pagina.
const listItemProductToElement = (listProduct) => {
  listProduct.forEach((product) => {
    document
      .querySelector('.items')
      .appendChild(addItemCart(createProductItemElement(product)));
  });
};

// Faz requisiçao no mercadolivre.
const requestApiMercadoLivre = async (query = 'computador') => {
  try {
    const request = await fetch(
      `https://api.mercadolibre.com/sites/MLB/search?q=${query}`,
    );
    const dateProduct = await request.json();
    return dateProduct.results;
  } catch (e) {
    const error = document.body;
    error.setAttribute('class', 'error');
    error.innerText = 'Tente Mais Tarde.';
  }
};

// reseta a lista de items.
bntClear.addEventListener('click', () => {
  cartItenms.innerText = '';
  valorTotal.innerText = 0;
});

window.onload = async () => {
  const listProduct = await requestApiMercadoLivre();
  listItemProductToElement(listProduct);
  document.querySelector('.loading').remove();
  loadCart();
};

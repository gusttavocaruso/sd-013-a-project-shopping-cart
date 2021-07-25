const olCart = document.querySelector('.cart__items');
const loading = document.querySelector('.loading');
const total = document.querySelector('.total-price');
const btnClear = document.querySelector('.empty-cart');

// exclui items do carrinho - ajuda do Emanoel
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

// requisito 4 concluido com a ajuda do Emanoel da tribo 13 A
const saveCart = () => {
  localStorage.setItem('productSave', olCart.innerHTML);
  localStorage.setItem('totalPriceCart', total.innerHTML);
};

const getCartSave = () => {
  olCart.innerHTML = localStorage.getItem('productSave');
  total.innerHTML = localStorage.getItem('totalPriceCart');
};

function removeItemCarts() {
  olCart.innerHTML = '';
  total.innerHTML = 0;
  saveCart();
}

btnClear.addEventListener('click', () => {
  removeItemCarts();
});

const soma = (valorAtual, precotot) => {
  const result = valorAtual + precotot;
  total.innerHTML = Math.round(result * 100) / 100;
};

const sub = (valorAtual, precotot) => {
  const result = precotot - valorAtual;
  total.innerHTML = Math.round(result * 100) / 100;
};

// vi no notion da turma que o Matheus Duarte postou
const precototal = (valorAtual, operador) => {
  const precotot = Number(total.innerHTML);
  if (operador === '+') soma(valorAtual, precotot);
  if (operador === '-') sub(valorAtual, precotot);
};
// Pego por parametro a <li> clicada, crio a const ol que tem a classe cart__items, depois removo a <li> que foi clicada. 
function cartItemClickListener(event) {
  event.target.remove();
  const precoDoProduto = event.target.querySelector('span').innerText;
  precototal(precoDoProduto, '-');
  saveCart();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  const ol = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerHTML = `SKU: ${sku} | NAME: ${name} | PRICE: $<span>${salePrice}</span>`;
  ol.appendChild(li);
  li.addEventListener('click', cartItemClickListener);
  precototal(salePrice, '+');
  saveCart();
  return li;
}

//  fetch para adiciona o produto ao carrinho
const addCartFetch = async (query) => {
  try {
    await fetch(`https://api.mercadolibre.com/items/${query}`)
    .then((response) => response.json())
    .then((data) => createCartItemElement(data));
  } catch (error) {
    alert(error);
  }
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(button);
  button.addEventListener('click', () => {
    addCartFetch(sku);
  });
  return section;
}

// aprendi com o fechamento de hoje dia 8 de julho com o tio Jack
const productComponent = (items) => {
  items.forEach((item) => {
    const productItem = createProductItemElement(item);
    const sectionItem = document.querySelector('.items');
    sectionItem.appendChild(productItem);
  });
};

const fetchML = async (query) => {
  try {
    await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => {
      response.json().then((data) => {
        productComponent(data.results);
        loading.remove();
      });
    });
  } catch (error) {
    alert(error);
  }
};

// Agradeço ao Emanoel, Rogerio, Gildo e Matheus da tribo 13A por compartilharem seus conhecimentos.
window.onload = () => {
  fetchML('computador');
  getCartSave();
};
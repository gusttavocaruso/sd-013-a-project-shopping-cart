const totalPrice = document.querySelector('.total-price');
let sumPrices = 0;

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
// usa o source da imagem do json do produto para criar uma tag html de imagem respectiva

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
// função responsavel por pegar o itentificador do item em questão

const saveLocalStorage = () => {
  const carrinhoHtml = document.querySelector('ul').innerHTML;
  localStorage.setItem('carrinho', carrinhoHtml);
};
// função responsavel por salvar o local storage toda vez que ocorre alterações

function cartItemClickListener(event) {
  event.target.remove();
  saveLocalStorage();
}
// remove o item clicado do carrinho, no futuro terá tambem que fazer a subtração

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => {
    cartItemClickListener(event);
    sumPrices -= salePrice;
    totalPrice.innerHTML = `$ ${sumPrices}`;
  });
  return li;
}
// função de criar elementos html que representam os item no carrinho elemento li de uma ul

function cliqueDeAdicionaNoCarrinho(section) {
  section.querySelector('button').addEventListener('click', (event) => {
    const item = event.target.parentNode;
      fetch(`https://api.mercadolibre.com/items/${getSkuFromProductItem(item)}`)
      .then((response) => response.json())
      .then((data) => {
        const cartList = document.querySelector('.cart__items');
        cartList.appendChild(createCartItemElement(data));
        sumPrices += data.price;
        totalPrice.innerHTML = `$ ${sumPrices}`;
        saveLocalStorage();
      });
  });
}
// evento para popular o carrinho de compras apartir de click no botao html

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
  cliqueDeAdicionaNoCarrinho(section);
  return section;
}
// função que cria uma sessão e os itens html dos respectivos produtos, com imagem, indentificador e titulo,
// alem do event listner clique de adicionar ao carrinho

async function fetchElement(query) {
  if (!query) query = 'computador';
  const loading = document.createElement('h2');
  loading.className = 'loading';
  loading.innerHTML = 'loading...';
  document.body.appendChild(loading);
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => response.json());
}
// função que lança as requisições e retorna seu json

async function criaItemDaPesquisa(item) {
  fetchElement(item)
  .then((data) => {
    data.results
    .forEach((element) => {
      const sessão = document.querySelector('.items');
      sessão.appendChild((createProductItemElement(element)));
    });
    const loading = document.querySelector('.loading');
    loading.remove();
  });
}
// função para carregar os dados da promises da API e apartir dos dados popular a pagina de itens a serem vendidos

function addClickListner() {
  const li = document.getElementsByTagName('li');
  for (let i = 0; i < li.length; i += 1) {
    li[i].addEventListener('click', cartItemClickListener);
  }
}

const loadPreviusCart = () => {
  const carrinhoLS = document.getElementById('cart');
  const LSLoad = localStorage.getItem('carrinho');
  carrinhoLS.innerHTML = LSLoad;
  addClickListner();
};
// função para carregar e adicionar event de remove para todos os itens do carrinho salvos no LS

function emptyCart() {
  const clearBtn = document.querySelector('.empty-cart');
  clearBtn.addEventListener('click', () => {
  const cartItems = document.getElementsByClassName('cart__items')[0];
  cartItems.innerHTML = '';
  totalPrice.innerHTML = `$ ${0}`;
  saveLocalStorage();
});
}

function newSerch() {
  const valor = document.querySelector('#bora').value;
  const itens = document.querySelectorAll('.item');
  itens.forEach((item) => item.remove());
  criaItemDaPesquisa(valor);
}
// função para limpar o local storage e limpar o carrinho de compras // src = https://github.com/tryber/sd-013-b-project-shopping-cart/pull/107/files

window.addEventListener('scroll', () => {
  const windowTop = window.pageYOffset;
  if (windowTop >= 318) {
    document.querySelector('#pageUp').style.display = 'flex';

  } else {
    document.querySelector('#pageUp').style.display = 'none';
  }
});

window.onload = function onload() {
  criaItemDaPesquisa();
  loadPreviusCart();
  emptyCart();
  const input = document.querySelector('#bora');
  input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      newSerch();
    }
  });
};
// ao ser carregado executa as funções no windown.onload
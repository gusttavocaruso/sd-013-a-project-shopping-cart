const cartItem = document.querySelector('.cart__items');
const items = document.querySelector('.items');
const botao = document.querySelector('.empty-cart');
const loading = document.querySelector('.loading');
const totalPrice = document.querySelector('.total-price');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const salvaCarrinho = () => {
  localStorage.setItem('carrinhoSalvo', cartItem.innerHTML);
  localStorage.setItem('precoSalvo', totalPrice.innerHTML);
};

botao.addEventListener('click', () => {
  const carrinhoCheio = document.querySelectorAll('.cart__item');
  carrinhoCheio.forEach((item) => item.parentNode.removeChild(item));
  totalPrice.innerHTML = 0;
  salvaCarrinho();
});

const soma = (valorAtual, valorOperacao) => {
  const somaResultado = valorAtual + valorOperacao;
  totalPrice.innerHTML = Math.round(somaResultado * 100) / 100;
  salvaCarrinho();
};

 const subtracao = (valorAtual, valorOperacao) => {
  const subtracaoResultado = valorAtual - valorOperacao;
  totalPrice.innerHTML = Math.round(subtracaoResultado * 100) / 100;
  salvaCarrinho();
};

const calculaPrecoTotal = (valor, operador) => {
    const precoAtual = Number(totalPrice.innerHTML);
    if (operador === '+') soma(precoAtual, valor);
    if (operador === '-') subtracao(precoAtual, valor);
};

const recuperaCarrinho = () => {
  cartItem.innerHTML = localStorage.getItem('carrinhoSalvo');
  totalPrice.innerHTML = localStorage.getItem('precoSalvo'); 
};

function cartItemClickListener(event) {
  if (event.target.className === 'cart__item') {
    event.target.remove();
    const precoDoProduto = event.target.querySelector('span').innerText;
    calculaPrecoTotal(precoDoProduto, '-'); 
    salvaCarrinho();
  }
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerHTML = `SKU: ${sku} | NAME: ${name} | PRICE: $<span>${salePrice}</span>`;
  cartItem.appendChild(li);
  calculaPrecoTotal(salePrice, '+');
}

const addProdutoNoCarrinho = async (ID) => {
  try {
    const infosProduto = await (await fetch(`https://api.mercadolibre.com/items/${ID}`)).json();
    createCartItemElement(infosProduto);
    salvaCarrinho();
  } catch (error) {
    alert(error);
  }
};

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
  section.lastElementChild.addEventListener('click', (event) => {
    const productID = event.target.parentElement.firstElementChild.innerText;
    addProdutoNoCarrinho(productID);
  });
  
  items.appendChild(section);
}

const pegaProdutos = async (produto = 'computador') => {
  try {
    ((await (await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${produto}`))
    .json())
      .results)
        .forEach((result) => createProductItemElement(result), loading.remove());
  } catch (error) {
    alert(error);
  }
};

cartItem.addEventListener('click', (cartItemClickListener)); 

window.onload = () => {
  pegaProdutos();
  recuperaCarrinho();
};
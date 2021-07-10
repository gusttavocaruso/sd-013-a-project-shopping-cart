// Em conjunto com Rafael e Josué a definir esta constante global (items).
const items = document.querySelector('.items');
const carrinho = document.querySelector('.cart__items');
const precoTotal = document.querySelector('.total-price');
const botao = document.querySelector('.empty-cart');
const loading = document.querySelector('.loading');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const salvaCarrinho = () => {
  localStorage.setItem('carrinhoSalvo', carrinho.innerHTML);
  localStorage.setItem('precoSalvo', precoTotal.innerHTML);
};

botao.addEventListener('click', () => {
  const carrinhoCheio = document.querySelectorAll('.cart__item');
  carrinhoCheio.forEach((item) => item.parentNode.removeChild(item));
  precoTotal.innerHTML = 0;
  salvaCarrinho();
});

const soma = (valorAtual, valorOperacao) => {
  const somaResultado = valorAtual + valorOperacao;
  precoTotal.innerHTML = Math.round(somaResultado * 100) / 100;
  salvaCarrinho();
};

 const subtracao = (valorAtual, valorOperacao) => {
  const subtracaoResultado = valorAtual - valorOperacao;
  precoTotal.innerHTML = Math.round(subtracaoResultado * 100) / 100;
  salvaCarrinho();
};

// Resolvi em conjunto com Matheus Camilo T13-A
const calculaPrecoTotal = (valor, operador) => {
    const precoAtual = Number(precoTotal.innerHTML);
    if (operador === '+') soma(precoAtual, valor); 
    if (operador === '-') subtracao(precoAtual, valor);
};

const recuperaCarrinho = () => {
  carrinho.innerHTML = localStorage.getItem('carrinhoSalvo');
  precoTotal.innerHTML = localStorage.getItem('precoSalvo'); 
};

// Rogério P. Silva e Josué Lobo me ajudaram a pensar nesta estratégia
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
  // Rogerio P. Silva bolou essa estratégia de tornar o salePrice interagível colocando-o como um spam.
  li.innerHTML = `SKU: ${sku} | NAME: ${name} | PRICE: $<span>${salePrice}</span>`;
  carrinho.appendChild(li);
  calculaPrecoTotal(salePrice, '+');
  // return li;
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

// Rogerio P. Silva recomendou criar a escuta do botao dentro de onde ele é criado.
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
        .forEach((computador) => createProductItemElement(computador), loading.remove());
  } catch (error) {
    alert(error);
  }
};

carrinho.addEventListener('click', (cartItemClickListener));

window.onload = () => {
  pegaProdutos();
  recuperaCarrinho();
};

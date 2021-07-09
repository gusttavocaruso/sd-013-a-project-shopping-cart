// Rafael com coAutoria de Josué me ajudaram a definir esta constante global.
const items = document.querySelector('.items');
const carrinho = document.querySelector('.cart__items');

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

const salvaCarrinho = () => {
  const htmlDoCarrinho = document.querySelector('.cart__items').innerHTML; // pq colocar 2 underline?
  localStorage.setItem('carrinhoSalvo', htmlDoCarrinho);
};

// Rogério P. Silva e Josué Lobo me ajudaram a pensar nesta estratégia
function cartItemClickListener(event) {
    event.target.remove();
  salvaCarrinho();
}

document.querySelector('.cart__items').addEventListener('click', (cartItemClickListener));

const recuperaCarrinho = () => {
  const storedCart = localStorage.getItem('carrinhoSalvo');
  if (storedCart !== null) {
    carrinho.innerHTML = storedCart;
  }
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  carrinho.appendChild(li);
  return li;
}

const addProdutoNoCarrinho = async (ID) => {
  try {
    const infosProduto = await (await fetch(`https://api.mercadolibre.com/items/${ID}`)).json();
    const itemDoCarrinho = createCartItemElement(infosProduto);
    salvaCarrinho();
  } catch (error) {
    alert(error);
  }
};

// Rogerio P. Silva recomendou criar a escuta do botao dentro de onde ele é criado.
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.lastElementChild.addEventListener('click', (event) => {
    addProdutoNoCarrinho(event.target.parentElement.firstElementChild.innerText);
  });

  items.appendChild(section);
}

const pegaProdutos = async (produto) => {
  try {
    ((await (await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${produto}`))
    .json()).results).forEach((computador) => createProductItemElement(computador));
  } catch (error) {
    alert(error);
  }
};

// const addProdutoCarrinho = async (botao) => {
//   try {
//     const produtoID = pegaIDdoProduto(botao.target.)
//   }
// }

window.onload = () => {
  pegaProdutos('computador');
  recuperaCarrinho();
 };

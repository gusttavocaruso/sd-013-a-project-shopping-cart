// Rafael com coAutoria de Josué me ajudaram a definir esta constante global.
const items = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');


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

function createProductItemElement({ id:sku, title:name, thumbnail:image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.lastElementChild.addEventListener('click', (event) => {
    console.log(event.target.parentElement.firstElementChild.innerText);
  })

  items.appendChild(section);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const pegaProdutos = async (produto) => {
  try {
    ((await(await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${produto}`)).json()).results).forEach((computador) => createProductItemElement(computador));
  } catch (error) {
    alert(error);
  }
}

const pegaProduto = async (ID) => {
  try {
    (await (await fetch(`https://api.mercadolibre.com/items/${ID}`)).json());
  } catch (error) {
    alert(error);
  }
}

const pegaIDdoProduto = (produto) => produto.getElementById('span.item__sku').innerText;

// const addProdutoCarrinho = async (botao) => {
//   try {
//     const produtoID = pegaIDdoProduto(botao.target.)
//   }
// }
 

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

function createCartItemElement({ id:sku, title:name, price:salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}


window.onload = () => {
  pegaProdutos('computador');
 };

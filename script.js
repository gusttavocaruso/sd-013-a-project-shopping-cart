let count = 0;

const totalPrice = document.querySelector('.total-price');

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

const storageAdd = (item) => {
// localStorage.setItem('carrinho', '');
localStorage.setItem('carrinho', item.innerHTML);
};

function cartItemClickListener(event) {
  const span = Number(event.target.lastElementChild.innerHTML);
  if (event.target.className === 'cart__item') {
    event.target.remove();
    localStorage.removeItem('carrinho', event.target.innerHTML);
    count -= span;
    const arredondar = Math.round(count * 100) / 100;
    totalPrice.innerHTML = arredondar;
    localStorage.setItem('total', totalPrice.innerHTML);
  }
 }
 
const somaPrices = async (preco) => {
  count += preco;
  const arredondar = Math.round(count * 100) / 100;
  totalPrice.innerHTML = arredondar;
  // localStorage.setItem('total', 0);
  localStorage.setItem('total', totalPrice.innerHTML);
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li
  .innerHTML = `SKU: ${sku} | NAME: ${name} | PRICE: $<span class ="spanPrice">${salePrice}</span>`;
  li.addEventListener('click', cartItemClickListener);
  return li; 
}

 const storageArm = () => {
  carrinho.innerHTML = localStorage.getItem('carrinho');
  totalPrice.innerHTML = localStorage.getItem('total');
}; 

const fetchItemId = async (id) => {
  const product = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const produto = await product.json();
  await somaPrices(produto.price);
    return produto;
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

 function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
 }
// requisito 2 tive a ideia consultando projetos de outros estudantes como  o da lanai T13-A
// https://github.com/tryber/sd-013-a-project-shopping-cart/blob/lanai-conceicao-shopping-cart/script.js e do Matheus Duarte T13-A atraves do seu notion que ele disponibilizou para a turma https://www.notion.so/Solu-o-Projeto-Shopping-Cart-7bde9d0b71584592962d361b658e46c9;

const addToCart = () => {
  const items = document.querySelector('.items');
  items.addEventListener('click', async (event) => {
    if (event.target.className === 'item__add') {
      const product = await fetchItemId(getSkuFromProductItem(event.target.parentElement));
      const createCart = createCartItemElement(product);
      carrinho.appendChild(createCart);
      storageAdd(carrinho);
    }
  });
};

const createItems = (items) => {
items.forEach((item) => {
  const section = document.querySelector('.items');
   section.appendChild(createProductItemElement(item));
});
};

const fetchML = async (query) => {
  try {
  const queryResult = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const dataQuery = await queryResult.json(); 
  createItems(dataQuery.results);
  } catch (error) {
    alert(error);
  } 
}; 

const removeAll = () => {
const emptyCart = document.querySelector('.empty-cart');
emptyCart.addEventListener('click', () => {
  carrinho.innerHTML = '';
  totalPrice.innerHTML = ' 0';
  localStorage.clear('carrinho');
});
};

window.onload = () => {
  fetchML('computador');
  storageArm();
  addToCart();
  removeAll();
 };

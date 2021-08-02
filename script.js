const items = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');

// requesito 4
const addStorage = () => {
  localStorage.setItem('data', cartItems.innerHTML);
};

const getStorage = () => {
  if (cartItems.innerHTML !== null) {
    cartItems.innerHTML = localStorage.getItem('data');
  }
};

// Requisito 5 
const total = () => {
  const precoTotal = document.querySelector('.total-price');
  let preco = 0;
  const lista = document.querySelectorAll('li');
  lista.forEach((item) => {
    const computer = item.innerText.split('$');
    preco += Number(computer[1]);
    precoTotal.innerHTML = `${(Math.round((preco * 100)) / 100)}`;
    addStorage();
  });
};

// requisito 6 = pegar o button e apagar a lista do carrinho.
const removeItems = () => {
  const btnRemove = document.querySelector('.empty-cart');
  const listaOl = document.querySelector('.cart__items');
  btnRemove.addEventListener('click', () => {
    const list = document.querySelectorAll('li');
    list.forEach((item) => {
      listaOl.removeChild(item);
      total();
      addStorage();
    });
  });
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  event.target.remove();
  total();
  addStorage();
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {     
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;     
  li.addEventListener('click', cartItemClickListener);     
  cartItems.appendChild(li);
  total();
  return li;
}
// Requesito 2
// requisição para adicionar ao carrinho. ItemCart é o valor id do item selecionado. Colocando o parâmetro itemCart torna a requisição assincrona, dinâmica
const cartItemPromise = async (itemCart) => {
  try {
    const getCartItem = await fetch(`https://api.mercadolibre.com/items/${itemCart}`);
    const productCart = await getCartItem.json();
    createCartItemElement(productCart);
    addStorage(); // referente ao requesito 4
  } catch (error) {
    alert(error);  
  }
};
// Cria a section, com a class 'item' que vai receber imagem, descrição, e botão. Cria Evento de click para add produto ao carrinho que vai adicionar com o resultado da promise na lista'(cartItemPromise(productId))'
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.lastElementChild.addEventListener('click', (event) => {
    const productId = event.target.parentElement.firstElementChild.innerText; // Filho do elemento section
    cartItemPromise(productId);
  });
  return section;
}
// Requisito 1 
const addItems = (pc) => {
  pc.forEach((elements) => {
    const item = createProductItemElement(elements);
    items.appendChild(item);
  });
};
// Requisito 1
const getItemsPromises = async (item) => {
  try {
    const getItem = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`);
    const product = await getItem.json();
    const result = product.results; // A lista de produtos que devem ser exibidos é o array results no json.
    addItems(result);
  } catch (error) {
      alert(error);
  }
};
  
// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
// Requisito 1- Chama a promise com parâmetro 'computador'.
const getFetch = async () => {
  await getItemsPromises('computador');
};

cartItems.addEventListener('click', cartItemClickListener);

window.onload = () => { 
  getFetch();  
  getStorage();
  total();
  removeItems();
};

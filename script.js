/* const ol = document.querySelector('.cart__items');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
} // cria a imagem do produto;

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
} // adiciona a classe e uma texto dentro do card;

 function cartItemClickListener(event) {
   if (event.target.className === 'cart__item') {
      event.target.remove();
   }
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerHTML = `SKU: ${sku} | NAME: ${name} | PRICE: $<span>${salePrice}</span>`;
  ol.appendChild(li);
  li.addEventListener('click', cartItemClickListener);
} 

const fetchItemId = async (id) => {
  try {
  const ulrProduct = await fetch(`https://api.mercadolibre.com/items/${id}
 `);
 const data = await ulrProduct.json();
 createCartItemElement(data); 
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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.lastElementChild.addEventListener('click', (event) => {
    const productID = event.target.parentElement.firstElementChild.innerText;
    fetchItemId(productID);
  });
 document.querySelector('.items').appendChild(section);
} 

const createItems = (items) => {
  items.forEach((item) => {
  createProductItemElement(item);
  });
}; // para cada item da minha requisiçao em fetchML executa funçao productItemElement e adiciona na minha section com a classe"items";

const fetchML = async (query) => {
  try {
  const queryResult = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const dataQuery = await queryResult.json(); 
  createItems(dataQuery.results);
  } catch (error) {
    alert(error);
  } 
}; 

window.onload = () => { 
 fetchML('computador');
}; */
const ol = document.querySelector('.cart__items');

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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// function getSkuFromProductItem(item) {
//  return item.querySelector('span.item__sku').innerText;
// }

 function cartItemClickListener(event) {
  if (event.target.className === 'cart__item') {
    event.target.remove();
  }
 }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

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

window.onload = () => {
  fetchML('computador');
 };

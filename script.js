function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__name', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// requisito 4 // a função deve ser declarada antes da sua execução na linha 92
function saveCart() {
  const info = document.querySelector('ol').innerHTML;
  const obj = {
    dados: 'itemsList',
    content: info,
  };
  if (info) localStorage.setItem(obj.dados, obj.content);
}

// requisito 1
const fetchItems = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
};

const appendProducts = async () => {
  const p = document.querySelector('.loading');
  const items = document.querySelector('.items');
  const products = await fetchItems('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  if (products) p.remove(); // requisito 7;
  products.forEach((element) => items.append((createProductItemElement({
    sku: element.id,
    name: element.title,
    image: element.thumbnail,
  }))));
};
// requisito 2

const fetchItem = async (item) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${item}`);
  const itemAdded = await response.json();
  return itemAdded;
};

const addButtonListener = () => {
  const items = document.querySelector('.items');
  for (let i = 0; i < items.children.length; i += 1) {
    const element = items.children[i];
    const id = getSkuFromProductItem(element);
    const button = element.getElementsByClassName('item__add')[0];
    button.addEventListener('click', async () => {
      const data = await fetchItem(id);
      const cart = createCartItemElement({
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      });
      const ol = document.querySelector('ol');
      ol.appendChild(cart);
      saveCart(); // a função deve ser chamada aqui pois é quando a li é criada.
    });
  }
};

// requisito 4
function getSavedCart() {
  const getInfo = localStorage.getItem('itemsList');
  document.querySelector('ol').innerHTML = getInfo;
}

// requisito 5
// const sumItensValue = async () => {
//   const items = await document.querySelector('.cart__items').children; // seleciona todos os filhos da da section.cart__items
//   console.log(items);
//   const htmlArray = Array.from(items, (item) => (item.innerText.split('$'))); // cria uma array com os elementos HTML dos itens filhos
//   console.log(htmlArray);
//   const pricesArray = htmlArray.map((item) => parseInt(item[1])); // cria um array com os  nomes e valores de cada item
//   //console.log(pricesArray);
//   const total = pricesArray.reduce((acc, crr) => acc + crr, 0);
//   console.log(total);
//   return total;
// };

// const appendTotalElement = async () => {
//   const sectionCart = document.querySelector('.cart');
//   const span = document.createElement('span');
//   span.style.textAlign = 'center';
//   span.innerText = await `Total: ${sumItensValue()}`;
//   sectionCart.appendChild(span);
// };

// requisito 6
const wipeCart = () => {
  const button = document.querySelector('button.empty-cart');
  const ol = document.querySelector('ol');
  button.addEventListener('click', () => {
    ol.innerHTML = '';
  });
};

window.onload = async () => {
  await fetchItems('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  await appendProducts();
  addButtonListener();
  // await appendTotalElement();
  getSavedCart();
  wipeCart();
};
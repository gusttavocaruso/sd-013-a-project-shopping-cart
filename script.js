// requisito 1
const fetchProducts = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data.results 
} 

const appendProducts = async () => {
  const itemsSection = document.querySelector('.items');
  const elements = await fetchProducts('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const items = elements.forEach((element) => itemsSection.append((createProductItemElement({
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
// requisito 4
function getSavedCart() {
  const getInfo = localStorage.getItem('itemsList');
  document.querySelector('ol').innerHTML = getInfo;
}

// requisito 4
function saveCart() {
  const info = document.querySelector('ol').innerHTML;
  const obj = {
    dados: 'itemsList',
    content: info,
  };
  localStorage.setItem(obj.dados, obj.content);
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
// requisito 3
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

// requisito 5

const sumItensValue = () => {
  const ol = document.querySelector('ol');
  const total = 0;
  if (ol.innerHTML) {
    const items = document.querySelector('.cart__items').children; // seleciona todos os filhos da da section.cart__items
    console.log(items);
    const contentsArray = Array.from(items); // cria uma array com os elementos HTML dos itens filhos
    console.log(contentsArray);
    const pricesArray = contentsArray.map((item) => parseInt(item.innerText.split('$')[1])); // cria um array com os valores de cada item
    console.log(pricesArray);
    const total = pricesArray.reduce((acc, crr) => acc + crr);
    console.log(total);
  }
  const sectionCart = document.querySelector('.cart');
  const span = document.createElement('span');
  span.style.textAlign = 'center';
  span.innerText = `Total: ${total}`;
  sectionCart.appendChild(span);
};

const appendTotalElement = () => {
  const sectionCart = document.querySelector('.cart');
  const span = document.createElement('span');
  span.style.textAlign = 'center';
  span.innerText = `Total: ${sumItensValue()}`;
  sectionCart.appendChild(span);
};

window.onload = async () => {
  await fetchProducts('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  await appendProducts();
  addButtonListener();
  getSavedCart();
  sumItensValue();
  // appendTotalElement();
};
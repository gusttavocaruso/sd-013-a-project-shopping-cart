//Queria agradecer aos trybees, em especial Matheus Duarte pela força ^^!
//============== Variáveis globais ==============
const getCartOl = document.querySelector('.cart__items');
//==============                   ==============

//============== Começo do código ==============
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
  const items = document.querySelector('.items')
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.lastElementChild.addEventListener('click', (callback) => {
    const getId = callback.target.parentElement.firstElementChild.innerText;
    setItemOnCart(getId);
  })

  items.appendChild(section);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSiteApi() {
  fetch("https://api.mercadolibre.com/sites/MLB/search?q=computador")
    .then((result) => {result.json()
    .then((another) => another.results.forEach((element) => {
      createProductItemElement(element)
    }))
  })
    .catch(() => console.log('Error'));
}

function setItemOnCart(itemId) {
  const product = fetch(`https://api.mercadolibre.com/items/${itemId}`)
  .then((result) => result.json())
  // .catch(() => alert('Erro: Alguma coisa fora do comum aconteceu :c'));
  createCartItemElement(product);
}


window.onload = () => { getSiteApi() };

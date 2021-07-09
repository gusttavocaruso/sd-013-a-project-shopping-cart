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
  document.getElementById('items').appendChild(section);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  document.getElementById('cart__items').removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  document.getElementById('cart__items').appendChild(li);
}

function getCarItem(sku) {
  const api = `https://api.mercadolibre.com/items/${sku}`;
  return fetch(api)
  .then((result) => result.json())
  .then((data) => createCartItemElement(data));
}

function getProducts(filter) {
  const api = `https://api.mercadolibre.com/sites/MLB/search?q=${filter}`;
  return fetch(api)
  .then((result) => result.json())
  .then((data) => data.results.forEach((i) => {
    createProductItemElement(i);
  }))
  .then(() => document.querySelectorAll('.item__add').forEach((i) => 
    i.addEventListener('click', function () {
      getCarItem(i.parentElement.firstChild.innerText);
  })));
}

window.onload = () => getProducts('computador');

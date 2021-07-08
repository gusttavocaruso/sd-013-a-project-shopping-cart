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

function createProductItemElement(sku, name, image) {
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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getProducts(filter) {
  if (filter === 'computador') {
    const api = `https://api.mercadolibre.com/sites/MLB/search?q=${filter}`;
    return fetch(api)
      .then((r) => r.json())
      .then((r) => (r.results));
  } 
    throw new Error();
}

async function getArrayWithProducts(filter) {
  const array = await getProducts(filter)
    .then((r) => r)
    .catch(() => 'endpoint não existe');
  array.forEach((a) => {
    createProductItemElement(a.id, a.title, a.thumbnail);
  });
}

window.onload = () => getArrayWithProducts('computador');

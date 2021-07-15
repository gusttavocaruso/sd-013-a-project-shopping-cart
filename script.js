const cartItems = '.cart__items';

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

  jsonLink = async () => {
    const loading = document.querySelector('.loading');
    const api = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
    const apiJson = await api.json();
    const jsonResults = apiJson.results;
    loading.remove();
    jsonResults.forEach((element) => document.querySelector('.items')
      .appendChild(createProductItemElement(element)));
};

const setItems = () => {
  const ol = document.querySelector(cartItems);
  const text = ol.innerHTML;
  localStorage.setItem('cartList', '');
  localStorage.setItem('cartList', JSON.stringify(text));
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = () => {
  jsonLink();
 };

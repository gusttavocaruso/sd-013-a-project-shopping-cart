function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function cliqueDeAdicionaNoCarrinho(section) {
  section.querySelector('button').addEventListener('click', (event) => {
    const item = event.target.parentNode;
      fetch(`https://api.mercadolibre.com/items/${getSkuFromProductItem(item)}`)
      .then((response) => response.json())
      .then((data) => {
        const cartList = document.querySelector('.cart__items');
        cartList.appendChild(createCartItemElement(data));
      });
    });
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
  cliqueDeAdicionaNoCarrinho(section);
  return section;
}

function fetchElement(query) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => response.json());
}

function criaItemNoCarrinho() {
  fetchElement('computador')
  .then((data) => {
    data.results
    .forEach((element) => {
      const sessão = document.querySelector('.items');
      sessão.appendChild((createProductItemElement(element)));
    });
  });
}
window.onload = function onload() {
  criaItemNoCarrinho();
};
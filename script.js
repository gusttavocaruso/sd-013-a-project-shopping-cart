// const fetch = require('node-fetch');

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
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
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

const addItensInSection = (items) => {
  items.forEach((item) => {
    const { id: sku, title: name, thumbnail: image } = item;
    const itemElement = createProductItemElement({ sku, name, image });
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
  });
};

const fetchMeli = (query) => fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  .then((response) => {
    response.json().then((data) => {
      addItensInSection(data.results);
  });
});

const itemAdd = async () => {
  try {
    await getProducts('computador');
    await getProduct('MLB1607748387');
      const product = document.querySelectAll('.item__add');
      console.log(product);
  }catch (error) {
    alert(`Erro ao adicionar produto> ${error}`);
  }
};

window.onload = () => {
  itemAdd();
};
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
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }
const addItem = (items) => {
  items
    .forEach((item) => {
      const createdProdItem = createProductItemElement(item);
      const sectionItems = document.querySelector('.items');

      sectionItems.appendChild(createdProdItem);
    });
};

const fetchML = (query) => {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;

  fetch(url)
    .then((response) => response.json()) // response materializa as informações buscadas no fetch
    .then((productData) => {
      addItem(productData.results); 
    }); // esse then realiza algo em cima do que foi trago no response
};


window.onload = () => {
  fetchML('computador');
};

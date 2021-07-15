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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener() {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// const addItensToSection = (items) => {
//     items.forEach((item) => {
//         const itemElement = createProductItemElement(item);
//         const section = document.querySelector('.items');
//         section.appendChild(itemElement);
//     });
// };

function createChild(itens) {
  itens.forEach((item) => {
    const createItem = createProductItemElement(item);
    const child = document.querySelector('.items');
    child.appendChild(createItem);
  });
}

const fetchMl = (query) => {
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
      .then((response) => response.json()
      .then((data) => createChild(data.results)));
};

const fetchId = (event) => {
  const element = event.target.parentElement;
  const idElement = getSkuFromProductItem(element);
  fetch(`https://api.mercadolibre.com/items/${idElement}`)
  .then((response) => response.json())
  .then((data) => {
    const adicionaLi = createCartItemElement(data);
    const lista = document.querySelector('.cart__item');
    lista.appendChild(adicionaLi);
  });
};

function click() {
  const itemList = document.querySelector('.items');
  itemList.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      fetchId(event);
    }
  });
}

window.onload = () => { 
    fetchMl('computador');
    click();
};

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

function createSection(itens) {
  itens.forEach((item) => {
    const createItem = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(createItem);
  });
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

const lista = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  .then((response) => response.json()
  .then((data) => createSection(data.results)));
};

const fetchId = (event) => {
  const elementoPai = event.target.parentElement;
  const idElement = getSkuFromProductItem(elementoPai);
  fetch(`https://api.mercadolibre.com/items/${idElement}`)
  .then((response) => response.json())
  .then((data) =>  {
     const addLi = createCartItemElement(data);
     const lista = document.querySelector('.cart__items');
     lista.appendChild(addLi);
  })
}

function escutarClick () {
  const itemList = document.querySelector('.items');
  itemList.addEventListener('click', (event) => {
    if(event.target.className === 'item__add') {
      fetchId(event);
    }
  })
}

window.onload = () => {
  lista('computador');
  escutarClick();
 };

 // Função 1 e 2 feita com ajuda de Matheus Macêdo
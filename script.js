const string = '.cart__items';
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

const save = () => { // Requisito 4
  const olCart = document.querySelector(string);
  const html = olCart.innerHTML;
  localStorage.setItem('lista', html);
};

function cartItemClickListener(event) {
  event.target.remove();
  save();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Requisito 1
const addProductList = (products) => { // Adicionando cada item a section
  products.forEach((product) => {
    const element = createProductItemElement(product);
    const sectionList = document.querySelector('.items');
    sectionList.appendChild(element);
  });
};

const fetchMl = async (query) => { // Puxando o conteúdo da Api que contém os produtos 
    const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
      const data = await response.json();
      const { results } = data;
      return addProductList(results);
  }; 

  // Requisito 2
const fetchItems = async (itemId) => { 
  const responseItems = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
    const dataItems = await responseItems.json();
    return dataItems;
};

const buttonEvent = () => {
  const sectionItems = document.querySelector('.items');
  sectionItems.addEventListener('click', async (event) => {
    event.preventDefault();
    if (event.target.className === 'item__add') {
      const parent = event.target.parentElement;
      const idProduct = getSkuFromProductItem(parent);
      const searchId = await fetchItems(idProduct);
      const cartItems = document.querySelector(string);
      cartItems.appendChild(createCartItemElement(searchId));
      save();
    }
  });
};

const getItem = () => {
  const olItems = document.querySelector(string);
  olItems.innerHTML = localStorage.getItem('lista');
  const divs = [...olItems.children];
  divs.forEach((li) => {
    li.addEventListener('click', cartItemClickListener);
  });
  };

window.onload = () => { 
  fetchMl('computador');
  buttonEvent();
  getItem();
};

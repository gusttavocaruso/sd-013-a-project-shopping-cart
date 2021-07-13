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

function cartItemClickListener(event, sku) {
  const localStorageData = JSON.parse(localStorage.getItem('itens')) || [];
  const filterData = localStorageData.filter((localData) => localData.sku !== sku);
  localStorage.setItem('itens', JSON.stringify(filterData));
  event.target.remove();  
}
// -------------------------------------------------------------- parte 2

 function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event, sku));
  return li;
}

function createCartItemElementStorage({ sku, name, salePrice }) {
  const list = document.createElement('li');
  list.className = 'cart__item';
  list.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  list.addEventListener('click', (event) => cartItemClickListener(event, sku));
  return list;
}
 
const fetchCartApi = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json())
  .then((data) => {
    const localStorageData = JSON.parse(localStorage.getItem('itens')) || [];
    const objectData = { sku: data.id, name: data.title, salePrice: data.price };
    localStorageData.push(objectData);
    localStorage.setItem('itens', JSON.stringify(localStorageData));
    const itemElementCart = createCartItemElement(data);
    const listCart = document.querySelector('.cart__items');
    listCart.appendChild(itemElementCart);
    });  
}; 

const getIdItem = (event) => {
  const id = getSkuFromProductItem(event.target.parentNode);
  fetchCartApi(id);
};

const getItensFromLocalStorage = () => {
  const itensLocalStorage = JSON.parse(localStorage.getItem('itens'));
  if (itensLocalStorage) {
  itensLocalStorage.forEach((item) => {
    const liItem = createCartItemElementStorage(item);
    const listCart = document.querySelector('.cart__items');
    listCart.appendChild(liItem);
  });
}
};

// --------------------------------------------------------------- parte 1

const addItensToSection = (items) => {
   items.forEach((item) => {
    const itemElement = createProductItemElement(item); // cada um dos produtos da lista JSON
    const section = document.querySelector('.items');
     section.appendChild(itemElement);
  });
  const buttonAddItem = document.querySelectorAll('.item__add');
  buttonAddItem.forEach((button) => button.addEventListener('click', getIdItem));
};

const fetchSearchApi = (produto) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${produto}`)
  .then((response) => { 
    response.json().then((data) => {
      addItensToSection(data.results);
      });
  });
};

window.onload = () => { 
  fetchSearchApi('computador');
  getItensFromLocalStorage();
};

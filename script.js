const sumPrice = async () => {
  const itensStorage = await JSON.parse(localStorage.getItem('itens')) || [];
  // localStorage.removeItem('itens');
  const price = document.querySelector('.price-value');
  const precoTotal = itensStorage
  .map((itens) => itens.price)
  .reduce((acc, current) => acc + current, 0);
  price.innerText = precoTotal;
};

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
  const filterData = localStorageData.filter((localData) => localData.id !== sku);
  localStorage.setItem('itens', JSON.stringify(filterData));
  event.target.remove();
  sumPrice();
}
// -------------------------------------------------------------- parte 2

 function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event, sku));
  sumPrice();
  return li;
}

const fetchCartApi = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json())
  .then(async (data) => {
    const localStorageData = await JSON.parse(localStorage.getItem('itens')) || [];
    const objectData = { id: data.id, title: data.title, price: data.price };
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
    const liItem = createCartItemElement(item);
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

 const clearList = () => {
  const listCart = document.getElementsByClassName('cart__item');
  localStorage.removeItem('itens');
  for (let i = 0; i < listCart.length; i += 0) {
   listCart[i].remove(); 
  }
  sumPrice();
}; 

 const buttonEmpety = document.querySelector('.empty-cart');
 buttonEmpety.addEventListener('click', clearList);

window.onload = () => { 
  fetchSearchApi('computador');
  getItensFromLocalStorage();
  sumPrice();
};

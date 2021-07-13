const cartString = '.cart__items';
const clearCartBtn = document.querySelector('.empty-cart');
const newOl = document.querySelector('.cart__items');

const sumPrices = () => {
  const ol = document.querySelector(cartString);
  const olChildren = [...ol.children];
  const priceOl = olChildren.reduce((acc, curr) => {
  let accumulator = acc;
  accumulator += Number(curr.innerText.split('$')[1]);
  return accumulator;
  }, 0);
  return priceOl;
  };
  
  const createDiv = () => {
  const div = document.querySelector('.total-price');
  div.innerText = `${Math.round(sumPrices() * 100) / 100}`;
  }; 

const saveStorage = () => {
  const olHtml = newOl.innerHTML;
  localStorage.setItem('lista', olHtml);
};

function cartItemClickListener(event) {
  event.target.remove();
  saveStorage();
  createDiv();
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// Realizado com a ajuda do Leonardo da turma 13.
const getStorage = () => {
  const getItem = document.querySelector(cartString);
  getItem.innerHTML = localStorage.getItem('lista');
  const divs = [...newOl.children];
  divs.forEach((li) => {
    li.addEventListener('click', cartItemClickListener);
  });
};

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

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  newOl.appendChild(li);

  return li;
}

// Requisito 1 feito com a ajuda do Jack no fechamento do dia do projeto.
const addItems = (items) => {
  items.forEach((item) => {
    const itemElement = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
  });
};

const fetchComputer = () => {
  const paragraph = document.querySelector('.loading');
  const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(URL)
    .then((response) => {
      response.json().then((data) => {
        addItems(data.results);
        paragraph.remove();
      });
    });
 };

 // Requisito 2 resolvido com a ajuda de Matheus Macedo.
 const fetchItemId = (element) => {
  const parentElem = element.target.parentElement;
  const idSku = getSkuFromProductItem(parentElem);
  fetch(`https://api.mercadolibre.com/items/${idSku}`)
  .then((response) => { 
    response.json()
    .then((data) => {
      const addLi = createCartItemElement(data);
      newOl.appendChild(addLi);
      saveStorage();
      createDiv();
    });
  });
};

const buttonAdd = () => {
  const section = document.querySelector('.items');
  section.addEventListener('click', (element) => {
    if (element.target.className === 'item__add') {
      fetchItemId(element);
    }
  });
};
// Requisito 6 realizado com a ajuda do Leonardo da turma 13.
const clearCart = () => {
  newOl.innerHTML = '';
  localStorage.removeItem('lista');
  document.querySelector('.total-price').innerText = 0;
};

clearCartBtn.addEventListener('click', clearCart);

window.onload = () => {
  fetchComputer();
  buttonAdd();
  getStorage();
};

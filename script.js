const ol = document.querySelector('.cart__items');
const olPrice = document.querySelector('.total-price');
const eraseButton = document.querySelector('.empty-cart');
let startCart = 0;
const totalValue = 'valor total';

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

const removeItemFromLocalStorage = (indexDeletedItem) => {
  const getLocalStorageToUpdate = JSON.parse(localStorage.getItem('valor'));
  if (getLocalStorageToUpdate !== null) {
    getLocalStorageToUpdate.splice(indexDeletedItem, 1);//  Ajudado pela Bianca turma 8
    localStorage.setItem('valor', JSON.stringify(getLocalStorageToUpdate));
  }
};

const subValueDeletedItem = (value) => {
  const getTotalPrice = document.querySelector('.price');
  const updateTotalPrice = getTotalPrice.innerHTML - value;
  getTotalPrice.innerHTML = updateTotalPrice;
  localStorage.setItem(totalValue, updateTotalPrice);
};

function cartItemClickListener(event) {
  const getCartItens = document.querySelectorAll('.cart__item');
  const getIndex = Array.from(getCartItens).indexOf(event.target);
  removeItemFromLocalStorage(getIndex);

  const texto = event.target.innerText;
  const split = texto.split('$');
  const deletedItemValue = (split[1]);
  subValueDeletedItem(deletedItemValue);
  event.target.remove('li');
}

const addLocalStorage = (data) => {
  if (localStorage.getItem('valor') === null) {
    localStorage.setItem('valor', JSON.stringify([]));
  } else {
    const oldStorage = JSON.parse(localStorage.getItem('valor'));
    const valor = data;
    oldStorage.push(valor);
    localStorage.setItem('valor', JSON.stringify(oldStorage));
  }
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const createItens = (itens) => {
  itens.forEach((item) => {
    const create = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(create);
  });
};

const showTotalPrice = (totalPrice) => {
  const createLi = document.createElement('li');
  createLi.className = 'price';

  olPrice.innerText = '';
  createLi.innerHTML = totalPrice;
  olPrice.appendChild(createLi);
};

const sumAll = (price) => {
  startCart += price;

  const round = Number((startCart).toFixed(2));
  localStorage.setItem(totalValue, round);
  showTotalPrice(round);
};

const createItemInCart = (data) => {
  const sendItensToCart = createCartItemElement(data);
  ol.appendChild(sendItensToCart);

  sumAll(data.price);
};

const sendToCart = (id) => {
  const numberId = id.innerText;
  fetch(`https://api.mercadolibre.com/items/${numberId}`)
    .then((resolve) => {
      resolve.json().then((data) => {
        createItemInCart(data);
        addLocalStorage(data);
      });
  });
};

const getId = (e) => {
  const itemClicado = e.path[1];
  const idItemClicado = itemClicado.querySelector('.item__sku');
  sendToCart(idItemClicado);
};

const getItensML = (product) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
    .then((response) => {
      response.json().then((data) => {
        createItens(data.results);

        const buttons = document.querySelectorAll('.item__add');
        buttons.forEach((button) => {
          button.addEventListener('click', getId);
        });
      });
    });
};

eraseButton.addEventListener('click', () => {
  ol.innerHTML = '';
  olPrice.innerText = '';
  startCart = 0;
  localStorage.removeItem('valor');
  localStorage.removeItem(totalValue);
});

function initialRenderization() {
  if (localStorage.getItem('valor') === null) {
    localStorage.setItem('valor', JSON.stringify([]));
  } else {
    const cartList = JSON.parse(localStorage.getItem('valor'));
    cartList.forEach((item) => {
      const test = createCartItemElement(item);
      ol.appendChild(test);
    });
  }
  if (localStorage.getItem(totalValue) === null) {
    localStorage.setItem(totalValue, JSON.stringify([]));
  } else {
    const totalPrice = localStorage.getItem(totalValue);
    showTotalPrice(totalPrice);
  }
}

window.onload = () => {
  getItensML('computador');
  initialRenderization();
};

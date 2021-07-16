const ol = document.querySelector('.cart__items');
const olPrice = document.querySelector('.total-price');
const eraseButton = document.querySelector('.empty-cart');
// const storageList = JSON.parse(localStorage.getItem('valor'));
let startCart = 0;

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

// // function getSkuFromProductItem(item) {
// //   return item.querySelector('span.item__sku').innerText;
// // }

const removeItemFromLocalStorage = (idDeletedItem) => {
  console.log(idDeletedItem);
};

function cartItemClickListener(event) {
  const texto = event.target.innerText;
  const split = texto.split(' ');
  const idDeletedItem = split[1];
  removeItemFromLocalStorage(idDeletedItem);
  event.target.remove('li');
}

const addLocalStorage = (data) => {
  const oldStorage = JSON.parse(localStorage.getItem('valor'));
  const valor = data;
  oldStorage.push(valor);
  localStorage.setItem('valor', JSON.stringify(oldStorage));
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
  createLi.className = 'total-price';

  olPrice.innerText = '';
  createLi.innerHTML = `$${totalPrice}`;
  olPrice.appendChild(createLi);
};

const sumAll = (price) => {
  startCart += price;

  const round = Math.floor(startCart);

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
}

window.onload = () => {
  getItensML('computador');
  initialRenderization();
};

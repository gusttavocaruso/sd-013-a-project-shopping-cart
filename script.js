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
//  return item.querySelector('span.item__sku').innerText;
// }

 function cartItemClickListener(event) {
  const elementoClicado = event.target;
  const ol = document.getElementsByClassName('cart__items');
  ol[0].removeChild(elementoClicado);
 }

const addItems = (produtos) => {
  produtos.forEach((produto) => {
    const section = document.querySelector('.items');
    const items = createProductItemElement(produto);
    section.appendChild(items);
  });
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li'); 
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
 }

const fetchComputerId = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => {
    response.json().then((dataId) => {
      const ol = document.querySelector('.cart__items');
      const produtos = createCartItemElement(dataId);
      ol.appendChild(produtos);
    });
  });
};

const clearCart = () => {
  const buttonEmpty = document.querySelector('.empty-cart');
  const cartItems = document.querySelector('.cart__items');
  buttonEmpty.addEventListener('click', () => {
    cartItems.innerHTML = '';
  });
};

function addCart(event) {
  const elementoClicado = event.target;
  fetchComputerId(elementoClicado.parentNode.firstChild.innerHTML);
}

const fetchComputerML = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((response) => {
    response.json().then((data) => {
      addItems(data.results);
      const buttonAdd = document.querySelectorAll('.item__add');
      buttonAdd.forEach((button) => {
        button.addEventListener('click', addCart);
      });
    });
  });
};

window.onload = () => { 
  fetchComputerML();
  clearCart();
};
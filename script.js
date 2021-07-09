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

const sum = () => {
  const items = document.querySelectorAll('.cart__item');
  const total = document.querySelector('.total-price');
  let result = 0;
  items.forEach((item) => {
    const preço = parseFloat(item.innerText.split('$')[1]);
    result += preço;
  });
  total.innerText = Math.round(result * 100) / 100;
};

function cartItemClickListener(event) {
  event.target.remove();
  sum();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const fetchComputer = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => {
      response.json().then((data) => {
        const { results } = data;
          results.forEach((product) => {
            const createElement = document.getElementsByClassName('items')[0];
            createElement.appendChild(createProductItemElement(product));
            sum();
      });
    });
  });
};
const addProduct = (product) => {
  const myCart = document.querySelector('.cart__items');
  const newLi = createCartItemElement(product);
  myCart.appendChild(newLi);
  sum();
};

const addButtons = () => {
  const section = document.querySelector('.items');
  section.addEventListener('click', async (event) => {
    if (event.target.className === 'item__add') {
      const parentSection = event.target.parentElement;
      const itemId = getSkuFromProductItem(parentSection);
      const obj = await fetch(`https://api.mercadolibre.com/items/${itemId}`)
        .then((response) => response.json());
      addProduct(obj);
    }
  });
};

const clearCart = () => {
  const button = document.querySelector('.empty-cart');
  const ol = document.querySelector('.cart__items');
  button.addEventListener('click', () => {
    ol.innerHTML = '';
    sum();
  });
};

window.onload = () => {
  fetchComputer('computador');
  addButtons();
  clearCart();
  sum();
};

let total = 0;

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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(price, id) {
  const list = document.querySelector('.cart_items');
  const item = document.querySelectorAll('.cart__item');
  item.forEach((value) => {
    const localId = value.attributes.id.value;
    if (localId === id) {
      list.removeChild(value);
      total -= Number(price);
    }
  });
  const totalPrice = document.querySelector('.total_price');
  totalPrice.innerText = Math.round(total * 100) / 100;
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.setAttribute('id', sku);
  li.addEventListener('click', () => cartItemClickListener(salePrice, sku));
  return li;
}

const appendItensSection = (itens) => {
  itens.forEach((item) => {
    const element = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(element);
  });
};

const fetchItemList = (product) =>
  new Promise((resolve) => {
    const load = document.querySelector('.loading');
    load.style.display = 'block';
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`).then(
      (response) => {
        response.json().then((data) => {
          appendItensSection(data.results);
          load.parentElement.removeChild(load);
          resolve();
        });
      },
    );
  });

const appendCartItens = (data) => {
  const li = createCartItemElement(data);
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
};

const addPrice = async (data) => {
  const totalPrice = document.querySelector('.total-price');
  total += data.price;
  totalPrice.innerText = Math.round(total * 100) / 100;
};

const fetchCartItens = (itemId) => {
  fetch(`https://api.mercadolibre.com/items/${itemId}`).then((response) => {
    response.json().then((data) => {
      appendCartItens(data);
      addPrice(data);
    });
  });
};

const removeItem = () => {
  const btn = document.querySelector('.empty-cart');
  const list = document.querySelector('.cart__items');
  const totalPrice = document.querySelector('.total-price');
  btn.addEventListener('click', () => {
    list.innerHTML = '';
    totalPrice.innerText = '';
    total = 0;
  });
};
window.onload = () => {
  fetchItemList('computador').then(() => {
    document.querySelectorAll('.item').forEach((value) => {
      const id = value.querySelector('.item__sku').innerText;
      value.querySelector('.item__add').addEventListener('click', () => {
        fetchCartItens(id);
      });
    });
  });
  removeItem();
};

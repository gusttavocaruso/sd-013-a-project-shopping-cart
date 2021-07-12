let olShopCart = document.querySelector('.cart__items');

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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// const calcTotalRemove = (price) => {
//   sum -= price;
//   localStorage.setItem('total-price', sum);
// };

function cartItemClickListener(event) {
  event.target.remove();
  // calcTotalRemove();
  localStorage.setItem('shopping_cart', olShopCart.innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addSections = (request) => {
  const items = document.querySelector('.items');
  request.forEach((element) => {
    const { id, title, thumbnail } = element;
    const card = createProductItemElement({ sku: id, name: title, image: thumbnail });
    items.appendChild(card);
  });
};

const getProducts = (query) => fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  .then((response) => response.json())
  .then((data) => {
    addSections(data.results);
    const loading = document.querySelector('.loading');
    loading.remove();
  });

let sum = 0;

const calcTotalSum = (price) => {
  sum += price;
  localStorage.setItem('total-price', sum);
  // let totalPriceChild = document.querySelector('.total-price').firstElementChild.innerText;
  // totalPriceChild = parseFloat(totalPriceChild) + price;
};

const getProduct = (element) => {
  const identify = element.target.parentElement.querySelector('span.item__sku').innerText;
  fetch(`https://api.mercadolibre.com/items/${identify}`)
  .then((response) => response.json())
  .then(({ id, title, price }) => {
    olShopCart.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));
    localStorage.setItem('shopping_cart', olShopCart.innerHTML);
    calcTotalSum(price);
  });
};

const itemAdd = async () => {
  try {
    const product = document.querySelector('.items');
    await getProducts('computador');
    product.addEventListener('click', (element) => {
      if (element.target.className === 'item__add') {
        getProduct(element);
      }
    });
  } catch (error) {
    alert(`Erro ao adicionar produto ao carrinho: ${error}`);
  }
};

window.onload = () => {
  olShopCart = document.querySelector('.cart__items');
  const buttonClear = document.querySelector('.empty-cart');
  buttonClear.addEventListener('click', () => {
    olShopCart.innerText = '';
    localStorage.setItem('shopping_cart', olShopCart.innerHTML);
  });
  const locStorCart = localStorage.getItem('shopping_cart');
  olShopCart.addEventListener('click', (e) => {
    if (e.target.className === 'cart__item') {
      cartItemClickListener(e);
    }
  });
  olShopCart.innerHTML = locStorCart;
  // const locStorPrice = localStorage.getItem('total-price');
  // let totalPriceChild = document.querySelector('.total-price').firstElementChild.innerText;
  // totalPriceChild = locStorPrice;
  itemAdd();
};

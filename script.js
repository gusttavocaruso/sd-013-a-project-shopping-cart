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
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemsToSection = (items) => {
    items.forEach((item) => {
        const itemElement = createProductItemElement(item);
        const section = document.querySelector('.items');
        section.appendChild(itemElement);
    });
};

const saveStorage = () => {
  const cartItems = document.getElementsByClassName('cart__items')[0];
  localStorage.setItem('cartList', cartItems.innerHTML);
};

const storage = () => new Promise((resolve) => {
  if (localStorage.getItem('cartList')) {
    const cartItems = document.getElementsByClassName('cart__items')[0];
    cartItems.innerHTML = localStorage.getItem('cartList');
    resolve();
  }
});

const fetchML = (query) => new Promise((resolve) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  .then((response) => {
    response.json().then((data) => {
      addItemsToSection(data.results);
      document.querySelector('.loading').remove();
      resolve();
      });
    });
});

const addToCartClicked = (event) => new Promise((resolve) => {
  const button = event.target;
  const buttonParent = button.parentElement;
  const skuProduct = buttonParent.querySelector('.item__sku').innerText;
  fetch(`https://api.mercadolibre.com/items/${skuProduct}`)
    .then((response) => {
    response.json().then((data) => {
      document.querySelector('.cart__items').appendChild(createCartItemElement(data));
      saveStorage();
    });
  });
  resolve();
});

const addToCart = () => new Promise((resolve) => {
  const addToCartButtons = document.getElementsByClassName('item__add');
  for (let i = 0; i < addToCartButtons.length; i += 1) {
    const button = addToCartButtons[i];
    button.addEventListener('click', addToCartClicked);
  }
  resolve();
});

const clearCart = () => new Promise((resolve) => {
  const btnClear = document.querySelector('.empty-cart');
  const ol = document.querySelector('.cart__items');
  btnClear.addEventListener('click', () => {
    ol.innerHTML = '';
  });
  resolve();
});

const fetchPromise = async () => {
  try {
    await fetchML('smartphone');
    await addToCart();
    await clearCart();
    await storage();
  } catch (error) {
    console.log(error);
  }
};

window.onload = () => {
  fetchPromise();
};

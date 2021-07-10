  // const cartElement = document.getElementsByClassName('cart');
  const shoppingCart = document.getElementsByClassName('cart__items')[0];

// const createloadingElement = () => {
//   const loadingElement = document.createElement('div');
//   loadingElement.classList.add('loading');
//   loadingElement.innerText = 'loading';
//   cartElement.appendChild(loadingElement);
// };

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

const fetchResults = () => fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => data.results);

const fetchItem = (id) => fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((data) => data);

const getTotalPrice = () => {
  let arrayPrices = localStorage.getItem('idList');
  const priceElement = document.getElementsByClassName('total-price')[0];
  arrayPrices = arrayPrices.split(',');
  const totalPrice = arrayPrices.reduce((acc, price) => acc + Number(price), 0); 
  priceElement.innerText = totalPrice;
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const saveShoppingCart = () => {
  const cartItems = document.getElementsByClassName('cart__item');
  const arrayIds = [];
  for (let i = 0; i < cartItems.length; i += 1) {
    const id = cartItems[i].innerText.split('$')[1];
    arrayIds.push(id);
  }
  localStorage.setItem('idList', arrayIds);
  const products = shoppingCart.innerHTML;
  localStorage.setItem('shoppingCart', products);
};

async function cartItemClickListener(event) {
  const ol = event.target.parentElement;
  ol.removeChild(event.target);
  saveShoppingCart();
  await getTotalPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

  const insertElement = async () => {
    const json = await fetchResults();
    const sectionItems = document.getElementsByClassName('items')[0];
    json.forEach((productObject) => {
      const item = createProductItemElement(productObject);
      sectionItems.appendChild(item);
    });
  };

  const addToCart = () => {
    document.addEventListener('click', async (event) => {
      if (event.target.classList.contains('item__add')) {
        const id = event.target.parentElement.firstChild.innerText;
        const productJson = await fetchItem(id);
        const cartProduct = createCartItemElement(productJson);
        shoppingCart.appendChild(cartProduct);
        saveShoppingCart();
        await getTotalPrice();
      }
    });
  };

  const loadShoppingCart = () => {
    const shoppingCartProducts = localStorage.getItem('shoppingCart');
    shoppingCart.innerHTML = shoppingCartProducts;
    const products = shoppingCart.children;
    for (let i = 0; i < products.length; i += 1) {
      products[i].addEventListener('click', cartItemClickListener);
    }
  };

  const clearShoppingCart = () => {
    const clearButton = document.getElementsByClassName('empty-cart')[0];
    clearButton.addEventListener('click', () => {
      shoppingCart.innerHTML = null;
      saveShoppingCart();
    });
  };

  // const checkCartItems = async () => {
  //   while (shoppingCart.length > 0) {
  //   } 
  // };

window.onload = async () => {
    loadShoppingCart();
    insertElement();
    addToCart();
    clearShoppingCart();
    await getTotalPrice();
    // await checkCartItems();
  };

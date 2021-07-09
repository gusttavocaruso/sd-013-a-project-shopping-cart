// const fetch = require('node-fetch'); 

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

const fetchItem = (id) => fetch(`https://api.mercadolibre.com/items/${id}`)
.then((response) => response.json())
.then((itemJson) => itemJson);

const getTotalPrice = async () => {
  let arrayIds = localStorage.getItem('idList');
  if (arrayIds) {
    arrayIds = arrayIds.split(',');
    const totalPrice = await arrayIds.reduce(async (acc, id) => {
      const { price } = await fetchItem(id);
      return await acc + price;
    }, 0); 
    const priceElement = document.getElementsByClassName('total-price')[0];
    // if ()
    priceElement.innerText = totalPrice;
  }
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const saveShoppingCart = () => {
  const cartItems = document.getElementsByClassName('cart__item');
  const arrayIds = [];
  for (let i = 0; i < cartItems.length; i += 1) {
    const id = cartItems[i].innerText.slice(5, 18);
    arrayIds.push(id);
  }
  localStorage.setItem('idList', arrayIds);
  const shoppingCart = document.getElementsByClassName('cart__items')[0].innerHTML;
  localStorage.setItem('shoppingCart', shoppingCart);
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

const fetchResults = () => fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((responseJson) => responseJson.results);

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
        const cartList = document.getElementsByClassName('cart__items')[0];
        cartList.appendChild(cartProduct);
        saveShoppingCart();
        await getTotalPrice();
      }
    });
  };

  const loadShoppingCart = () => {
    const shoppingCartProducts = localStorage.getItem('shoppingCart');
    const shoppingCart = document.getElementsByClassName('cart__items')[0];
    shoppingCart.innerHTML = shoppingCartProducts;
    const products = shoppingCart.children;
    for (let i = 0; i < products.length; i += 1) {
      products[i].addEventListener('click', cartItemClickListener);
    }
  };

  const clearShoppingCart = () => {
    const clearButton = document.getElementsByClassName('empty-cart')[0];
    const cartList = document.getElementsByClassName('cart__items')[0];
    clearButton.addEventListener('click', async () => {
      const products = cartList.childNodes;
      for (let i = 0; i <= products.length; i += 1) {
        cartList.removeChild(products[i]);
      }
     await getTotalPrice();
    });
  };

window.onload = async () => {
     loadShoppingCart();
    insertElement();
    addToCart();
    await getTotalPrice();
    clearShoppingCart();
  };

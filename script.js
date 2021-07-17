const classCartItems = '.cart__items';
let valueObj = {
  products: [],
};
const sumProducts = {
  total: 0,
};
const priceKey = 'total-price';

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

function removeAllProducts() {
  document.querySelector(classCartItems).innerText = '';
  localStorage.clear();
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const bttEmptyCart = document.querySelector('button.empty-cart');
  bttEmptyCart.addEventListener('click', removeAllProducts);
  return section;
}

function setStorage(li) {
  valueObj.products.push(li);
  localStorage.setItem('purchase', JSON.stringify(valueObj));
  document.querySelector('.total-price')
  .innerText = Math.floor(sumProducts.total * 100) / 100;
}

async function cartItemClickListener(event) {
  if (event.target.closest(classCartItems)) {
    let subPrice = event.target.innerText.slice(-5);
    if (subPrice.indexOf('$') !== -1) {
      subPrice = subPrice.substring(1);
    } 
    sumProducts.total -= Number(subPrice);
    localStorage.setItem(priceKey, JSON.stringify(sumProducts.total));
    document.querySelector(classCartItems).removeChild(event.target);
    valueObj = {
      products: [],
    };
    setStorage(document.querySelectorAll('.cart__item')
    .forEach((product) => {
      setStorage(product.innerText);
    }));
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  document.querySelector(classCartItems).addEventListener('click', cartItemClickListener);
  sumProducts.total += salePrice;
  localStorage.setItem('total-price', JSON.stringify(sumProducts.total));
  return li;
}

function createStorageitems(cartItemStorage) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = cartItemStorage;
  document.querySelector(classCartItems).appendChild(li);
}

function localCart() {
  if (localStorage.length !== 0) {
     const getObjLStorage = JSON.parse(localStorage.getItem('purchase'));
     localStorage.setItem('purchase', localStorage.getItem('purchase'));
     sumProducts.total = JSON.parse(localStorage.getItem(priceKey));
     console.log('variável', sumProducts.total);
     localStorage.setItem(priceKey, JSON.stringify(sumProducts.total));
     document.querySelector('.total-price').innerText = Math.floor(sumProducts.total * 100) / 100;
     getObjLStorage.products.forEach((cartItem) => {
      createStorageitems(cartItem);
      document.querySelector(classCartItems).addEventListener('click', cartItemClickListener);
      });
  }
}

const addProducts = (products) => {
  products.forEach((product) => {
    const element = createProductItemElement(product);
    const section = document.querySelector('.items');
    section.appendChild(element);
});
};

const addItemtoCart = () => {
  const cart = document.querySelector(classCartItems);
  const bttsAddCarts = document.querySelectorAll('.item__add');
  bttsAddCarts.forEach((bttCart) => {
    bttCart.addEventListener('click', (e) => {
      const id = e.target.parentNode.firstChild.innerText;
      fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((promise) => promise.json())
      .then((value) => {
        const data = {
         sku: value.id,
         name: value.title,
         salePrice: value.price };
        const li = createCartItemElement(data);
        setStorage(li.innerText);
        cart.appendChild(li);
      });
    });
  });
};

async function loading() {
  const li = document.createElement('li');
  li.innerText = 'loading...';
  li.className = 'loading';
  document.querySelector(classCartItems).appendChild(li);
}

const fetchAPI = async (search) => {
  try {
    loading();
    return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`)
    .then((response) => {
      response.json().then((value) => {
        document.querySelector(classCartItems).innerText = '';
        localCart();
        addProducts(value.results);
        addItemtoCart();
    });
  });
  } catch (error) {
    alert('ERROR DIFERENCIADO');
  }
};

window.onload = () => {
  fetchAPI('magiccubes');
 };

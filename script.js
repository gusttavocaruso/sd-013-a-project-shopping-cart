const prices = {};
// let totalPrice = 0;

const totalPrice = () => {
  const allItems = document.querySelectorAll('.cart__item');
  if (allItems.length === 0) {
    document.querySelector('.total-price').innerText = 0;
    console.log('lista vazia');
    return;
  }
  const allId = Array.from(allItems).map((item) => item.id);
  // console.log(allId);
  const cartValues = allId.map((id) => prices[id]);
  // console.log(cartValues.reduce((acc, cur) => acc + cur));
  document.querySelector('.total-price').innerText = cartValues
    .reduce((acc, cur) => acc + cur).toFixed(2);
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText, meuId) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;

  if (element === 'button') {
    e.setAttribute('id', meuId);
  }

  return e;
}

const allPrice = (price, id) => { prices[id] = price; };

function createProductItemElement({ id: sku, title: name, thumbnail: image, price: salePrice }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku));
  allPrice(salePrice, sku);
  totalPrice();
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const saveCart = () => {
    const cart = document.querySelector('ol');
    localStorage.setItem('CartList', cart.innerHTML);
};

function cartItemClickListener(event) {
    event.target.parentNode.removeChild(event.target);
    saveCart();
    totalPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const loadCart = () => {
    const cart = document.querySelector('.cart__items');
    cart.innerHTML = localStorage.getItem('CartList');
    Array.from(cart.children).forEach((item) => {
        // console.log(item);
        item.addEventListener('click', cartItemClickListener);
    });
};

const addToCart = (ItemID) => {
    // console.log(ItemID);
    fetch(`https://api.mercadolibre.com/items/${ItemID}`)
    .then((response) => {
        response.json().then((data) => {
            const productElement = createCartItemElement(data);
            const cart = document.querySelector('.cart__items');
            cart.appendChild(productElement);
            saveCart();
            totalPrice();
        });
    });
};

const addEventbuttons = () => {
    const buttons = document.getElementsByClassName('item__add');
    const arrayButtons = Array.from(buttons);
    
    arrayButtons.forEach((button) => {
        // console.log(button);
        if (button === arrayButtons[arrayButtons.length - 1]) {
            button.addEventListener('click', () => {
                addToCart(button.id);
            });
        }
    });
};

const addProductToSection = (products) => {
    products.forEach((product) => {
        const productElement = createProductItemElement(product);
        const section = document.querySelector('.items');
        section.appendChild(productElement);
        addEventbuttons();
    });
};

/* ToDo
    inverter a ordem das funções
*/
const fetchMercadoLivre = (query) => {
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => {
        response.json().then((data) => {
            addProductToSection(data.results);
        });
    });
};

window.onload = () => { 
    fetchMercadoLivre('computador');
    loadCart();
};

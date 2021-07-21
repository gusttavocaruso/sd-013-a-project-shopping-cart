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

const renderTotalPrice = (price) => {
  const place = document.querySelector('.total-price');
  place.innerText = price;
};

const setTotalPrice = () => {
  const allCartItems = document.querySelectorAll('.cart__item');
  const allPrices = [];
  allCartItems.forEach((current) => {
    const split = current.innerText.split(' ');
    const price = split[split.length - 1];
    allPrices.push(parseFloat(price.replace('$', '')));
  });
  renderTotalPrice(allPrices.reduce((accumulator, current) => accumulator + current, 0));
};

const saveInLocalStorage = () => {
  const allCartItems = document.querySelectorAll('.cart__item');
  const arrayAllCart = [];

  allCartItems.forEach((currentCart) => {
    const split = currentCart.innerText.split(' ');
    arrayAllCart.push({
      cartClass: currentCart.classList,
      id: split[1],
    });
  });
  localStorage.setItem('cart', JSON.stringify(arrayAllCart));
};

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => {
      response.json().then((obj) => {
      const { id: sku, title: name, price: salePrice } = obj;

      const cartSection = document.querySelector('.cart__items');
      cartSection.appendChild(createCartItemElement({ sku, name, salePrice }));
      saveInLocalStorage();
      setTotalPrice();
      });
    });
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');

  button.addEventListener('click', () => {
    addToCart(sku);
  });

  section.appendChild(button);

  return section;
}

const addItensToSection = (items) => {
  const getLoading = document.querySelector('.loading');
  items.forEach((item) => {
    const itemElement = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
    getLoading.remove(); // retirando a classe .loading
  });
};

const fetchML = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => {
      response.json().then((data) => {
        addItensToSection(data.results);
      });
    });
};

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

window.onload = () => {
  fetchML();
};

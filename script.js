const nameClass = '.cart__items';

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

const itemsToSection = (items) => {
  items.forEach((item) => {
    const itemElement = createProductItemElement(item);
    const sectionItems = document.querySelector('.items');
    sectionItems.appendChild(itemElement);
  });
};

const fetchInitial = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => response.json())
    .then((data) => itemsToSection(data.results));
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const saveLocalStorage = () => {
  const ol = document.querySelector(nameClass);
  localStorage.setItem('items', ol.innerHTML);
};

function cartItemClickListener(event) {
  event.target.remove();
  saveLocalStorage();
}

const localStorageHTML = () => {
  const ol = document.querySelector(nameClass);
  ol.innerHTML = localStorage.getItem('items');
  const divs = [...ol.children];
  divs.forEach((li) => {
    li.addEventListener('click', cartItemClickListener);
  });
};

// const totalPrice = () => {
//   const textPrice = document.querySelector('#total');
//   console.log(textPrice);
// };

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addCartItem = (jsonItem) => {
  const cart = document.querySelector('.cart__items');
  const addLiCart = createCartItemElement(jsonItem); 
  cart.appendChild(addLiCart);
  saveLocalStorage();
};

const btnClicked = () => {
  const sectionsBtn = document.querySelector('.items');
  sectionsBtn.addEventListener('click', async (e) => {
    if (e.target.className === 'item__add') {
      const id = getSkuFromProductItem(e.target.parentElement);
      const jsonItem = await fetch(`https://api.mercadolibre.com/items/${id}`)
        .then((response) => response.json());
        addCartItem(jsonItem);
    }
  });
};

window.onload = () => {
  fetchInitial('computador');
  btnClicked();
  localStorageHTML();
};

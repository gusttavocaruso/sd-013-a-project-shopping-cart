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

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
}

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
};

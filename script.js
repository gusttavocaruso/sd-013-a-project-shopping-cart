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

const addItensToSection = (objProducts) => {
  objProducts.forEach((product) => {
    const productCreated = createProductItemElement(product);
    const sectionItems = document.querySelector('.items');
    sectionItems.appendChild(productCreated);
  });
};

const fetchProduct = (query) => fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
.then((response) => response.json())
.then((data) => addItensToSection(data.results));

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const appendItem = (itemLiHTML) => {
  const olItem = document.querySelector('.cart__items');
  olItem.appendChild(itemLiHTML);
};

const fetchItemSelected = (item) => {
  fetch(`https://api.mercadolibre.com/items/${item}`)
  .then((response) => response.json())
  .then((data) => createCartItemElement(data))
  .then((element) => appendItem(element));
};

fetchItemSelected('MLB1341706310');

function addEvtListenerClickToAllProds() {
  const allBtnsForAddToCart = document.querySelectorAll('.item-add');
  allBtnsForAddToCart.addEventListener('click', fetchItemSelected);
}

window.onload = async () => {
   await fetchProduct('computador');
   await addEvtListenerClickToAllProds();
};

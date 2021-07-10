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
  event.target.remove();
  const skuToRemove = event.target.innerText.substring(5, 18);
  // console.log(skuToRemove);
  localStorage.removeItem(skuToRemove, JSON.stringify(skuToRemove));
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function updateLocalStorage(sku) {
  localStorage.setItem(sku, JSON.stringify(sku)); // inseri o id do produto (necessário converter em string 'strongify')
}

// localStorage.clear();

const appendItem = (itemLiHTML) => { // Para apendar os elementos li no carrinho de compras
  const olItem = document.querySelector('.cart__items');
  olItem.appendChild(itemLiHTML);
};

const fetchItemSelected = (item) => fetch(`https://api.mercadolibre.com/items/${item}`)
  .then((response) => response.json())
  .then((data) => {
    const { id } = data; // Destructuring para inserir no localStorage
    // console.log(id);
    updateLocalStorage(id); // função para inserir o id no localStorage
    appendItem(createCartItemElement(data));
  });

function addEvtListenerClickToAllProds() {
  const allBtnsForAddToCart = document.querySelectorAll('.item__add');
  allBtnsForAddToCart.forEach((btn) => {
    const IdItem = btn.parentElement.firstElementChild.innerText;
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      fetchItemSelected(IdItem);
    });
  });
}

function chargePreviousCart() {
  const cartInLocalStorage = Object.keys(localStorage); // Dá para fazer com Object.values
  console.log(cartInLocalStorage);
  cartInLocalStorage.forEach((id) => {
    // const idClean = JSON.parse(id); // Se utilizar Object.values é necessário trabalhar a string
    console.log(id);
    // console.log(idClean);
    fetchItemSelected(id);
  });
}

window.onload = async () => {
   await fetchProduct('computador');
   await addEvtListenerClickToAllProds();
   await chargePreviousCart();
};

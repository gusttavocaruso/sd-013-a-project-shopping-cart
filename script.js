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

function appendTotalPrice() {
  // Clear the previous totalPrice
  const totalPrice = document.querySelector('.total-price');
  if (totalPrice) totalPrice.remove();
  let PriceAmount = 0; // somar os valores da ol;
  const olItens = document.querySelectorAll('.cart__item');
  olItens.forEach((item) => {
    const arrProduct = item.innerText.split('|').map((strItem) => strItem.trim()); // Para Obter um array onde cada item é uma string no padrão 'key: Value'
    const price = parseFloat(arrProduct[2].split('$')[1]);
    PriceAmount += price;
  });
  const spanTotalPrice = document.createElement('span');
  spanTotalPrice.innerText = PriceAmount;
  spanTotalPrice.className = 'total-price';
  const ParentElement = document.querySelector('.cart');
  ParentElement.appendChild(spanTotalPrice);
}

function cartItemClickListener(event) {
  event.target.remove();
  const skuToRemove = event.target.innerText.substring(5, 18); // string que será utilizada para remover item no localStorage
  // console.log(skuToRemove);
  localStorage.removeItem(skuToRemove, JSON.stringify(skuToRemove));
  appendTotalPrice();
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

const appendItem = (itemLiHTML) => { // Para apendar os elementos li no carrinho de compras
  const olItem = document.querySelector('.cart__items');
  olItem.appendChild(itemLiHTML);
};

const fetchItemSelected = (item) => fetch(`https://api.mercadolibre.com/items/${item}`)
  .then((response) => response.json())
  .then((data) => {
    const { id } = data; // Destructuring para inserir no localStorage
    updateLocalStorage(id); // função para inserir o id no localStorage
    appendItem(createCartItemElement(data));
    appendTotalPrice();
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
  cartInLocalStorage.forEach((id) => {
    fetchItemSelected(id);
  });
}

function clearCart() {
  const cart = document.querySelectorAll('.cart__item');
  cart.forEach((item) => item.remove());
  appendTotalPrice();
}

function addListenerBtnClearCart() {
  const btnClearCart = document.getElementById('btn__clear');
  btnClearCart.addEventListener('click', clearCart);
}

function displayLoading() {
  const div = document.querySelector('.container');
  const h = document.createElement('h2');
  h.className = 'loading';
  h.id = 'elemLoading';
  h.innerHTML = 'Loading...';
  div.appendChild(h);
}

function turnOffDisplayLoading() {
  const elLoading = document.getElementById('elemLoading');
  elLoading.remove();
}

window.onload = async () => {
  await displayLoading();
  await fetchProduct('computador');
  turnOffDisplayLoading();
  addEvtListenerClickToAllProds();
  await chargePreviousCart();
  addListenerBtnClearCart();
};

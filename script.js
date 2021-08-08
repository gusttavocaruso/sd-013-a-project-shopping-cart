const cartItemClass = '.cart__item';
let itemNumber = 1;

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function saveItems() {
  const itemToSave = document.querySelectorAll(cartItemClass);
  let i = 1;
  itemToSave.forEach((item) => {
    localStorage.setItem(i, item.innerText);
    i += 1; 
  });
}

function emptyLocal() {
  localStorage.clear();
}

function removeLocalStorageItem(id) {
  localStorage.removeItem(id);
}
function sumCart() {
  const itemToSum = document.querySelectorAll(cartItemClass);
  let valorTotal = 0;
  itemToSum.forEach((item) => {
    valorTotal += Number(item.innerText.split('$')[1]);
  });
  const divTotal = document.querySelector('.total-price');
  divTotal.innerText = Math.round(valorTotal * 100) / 100;
}
function cartItemClickListener(event) {
  const { parentElement, id } = event.target;
  parentElement.removeChild(event.target);
  sumCart();
  removeLocalStorageItem(id);
}
function reloadCart() {
  const olCart = document.querySelector('.cart__items');
  for (let i = 1; i <= localStorage.length; i += 1) {
    const itemToCart = localStorage.getItem(i);
    const itemElementCart = document.createElement('li');
    itemElementCart.innerText = itemToCart;
    itemElementCart.className = 'cart__item';
    itemElementCart.id = `${i}`;
    itemElementCart.addEventListener('click', cartItemClickListener);
    olCart.appendChild(itemElementCart);
  }
}

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

function createProductItemElement(sku, name, image) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = `${itemNumber}`;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  itemNumber += 1;
  return li;
}

function fetchMercadoLivre(produto) {
  const loading = document.querySelector('.loading');
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${produto}`)
  .then((response) => {
    response.json().then((dadosProduto) => {
      dadosProduto.results.forEach((result) => {
        const itemShowed = createProductItemElement(result.id, result.title, result.thumbnail);
        const sectionItems = document.querySelector('.items');  
        sectionItems.appendChild(itemShowed);
        loading.remove();
      });
    });
  });
}

function addToCart() {
  const itemToAdd = document.querySelector('.items');
  itemToAdd.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const itemToBeAdd = getSkuFromProductItem(event.target.parentElement);
      fetch(`https://api.mercadolibre.com/items/${itemToBeAdd}`).then((response) => {
        response.json().then((dadosAdicionar) => {
          const itemAdicionar = createCartItemElement(
            dadosAdicionar.id, dadosAdicionar.title, dadosAdicionar.price,
            );
            const olCart = document.querySelector('.cart__items');
            olCart.appendChild(itemAdicionar);
            sumCart();
            saveItems();
        });
      });
    }
  });
}

function emptyCart() {
  const removeButton = document.querySelector('.empty-cart');
  removeButton.addEventListener('click', () => {
    const itemToRemove = document.querySelectorAll(cartItemClass);
    itemToRemove.forEach((item) => {
      const father = item.parentElement;
      father.removeChild(item);
    });
    sumCart();
    emptyLocal();
  });
}

window.onload = () => {
  fetchMercadoLivre('computador');
  addToCart();
  emptyCart();
  reloadCart();
};
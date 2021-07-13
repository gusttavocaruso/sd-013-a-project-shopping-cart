function saveData() {
  localStorage.clear();
  const ol = document.querySelector('.cart__items');
  localStorage.setItem('lista', ol.innerHTML);
}

function cartItemClickListener(event) {
  event.target.remove();
  saveData();
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
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

function createCartItemElement({ id: sku, title: name, price: salePrice }) { 
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getTotalPrice() {
  let total = 0;
  const totalPrice = document.querySelector('.total-price');
  const products = document.querySelectorAll('li');
  products.forEach((product) => {
    const aux = product.innerText.split('$');
    total += parseFloat(aux[1]);
  });
    totalPrice.innerHTML = `${(Math.round((total * 100)) / 100)}`;
}

function addToCart(event) { 
  const section = event.target.parentElement;
  const idProduct = getSkuFromProductItem(section);
    return new Promise((resolve, reject) => {
      fetch(`https://api.mercadolibre.com/items/${idProduct}`)
        .then((response) => response.json()
          .then((jsonProduct) => {
            const li = createCartItemElement(jsonProduct);
            document.querySelector('.cart__items').appendChild(li);
            getTotalPrice();
            resolve();
            saveData();
          }));
    });
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', addToCart);
  return section;
}

const getProducts = () => new Promise((resolve, reject) => {
   fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then((response) => { 
        response.json().then((jsonProduct) => { 
          document.querySelector('.loading').remove();   
          jsonProduct.results.forEach((element) => {              
              const product = createProductItemElement(element);
              const bigSection = document.querySelector('.items');
              bigSection.appendChild(product);
              resolve();
            });
        });
      });
  });

function getData() {
  const ol = document.querySelector('ol');
  ol.innerHTML = localStorage.getItem('lista');
  ol.addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') { 
      cartItemClickListener(event); 
    }
    getTotalPrice();
  });
}

function emptyCart() {
  const emptyBtn = document.querySelector('.empty-cart');
  emptyBtn.addEventListener('click', () => {
  const products = document.querySelectorAll('li');
  products.forEach((li) => li.remove());
  getTotalPrice();
  });
  
}

window.onload = () => {
  getProducts();
  getData();
  getTotalPrice();
  emptyCart();
};

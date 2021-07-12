const ol = document.querySelector('.cart__items');
const arr = [];

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

// function getSkuFromProductItem(item) {
  //   return item.querySelector('span.item__sku').innerText;
  // }
  
const sub = (string) => {
  const ultimoElement = string.innerText.split(' ');
  const elementoComCifrao = ultimoElement[ultimoElement.length - 1].replace('$', '');
  const semCifrao = elementoComCifrao;
  const span = document.querySelector('.total-price');
  const newValue = parseFloat(span.innerHTML) - parseFloat(semCifrao);
  span.innerHTML = Math.round(newValue * 100) / 100;
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  const itemToRemove = event.target;
  itemToRemove.remove();
  localStorage.cartList = ol.innerHTML;
  sub(itemToRemove);
}

const sumOfPrices = (key) => {
  arr.push(key.salePrice);
  console.log(arr);
  const totalPrice = arr.reduce((sum, acc) => (sum + acc), 0);
  const result = (totalPrice * 100) / 100;
  const span = document.querySelector('.total-price');
  span.innerHTML = result;
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  sumOfPrices({ salePrice });
  return li;
}

const achaID = async (event) => {
  const idProduct = event.target.parentElement.firstChild.innerHTML;
  const response = await fetch(`https://api.mercadolibre.com/items/${idProduct}`);
    const data = await response.json();
    const itensCompraveis = createCartItemElement(data);
    ol.appendChild(itensCompraveis);
    localStorage.cartList = ol.innerHTML;
    // sumOfPrices(itensCompraveis);
};
  
const fetchAPI = () => new Promise(() => {
   fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
   .then((response) => response.json()
  .then((computer) => {
    // Recebi Ajuda do Luiz Furtado
    const itemList = document.querySelector('.items');
    const arra = computer.results;
    arra.forEach((obj) => {
      const objs = createProductItemElement(obj);
      itemList.appendChild(objs);
      objs.lastChild.addEventListener('click', achaID);
    });
  }));
});

const eraseShopList = () => {
  const bntErase = document.querySelector('.empty-cart');
  bntErase.addEventListener('click', () => {
    const list = document.querySelectorAll('.cart__item');
    list.forEach((item) => item.remove());
    localStorage.cartList = ol.innerHTML;
  });
};

ol.innerHTML = localStorage.cartList || null;

document.querySelectorAll('li')
  .forEach((li) => li.addEventListener('click', cartItemClickListener));
  
eraseShopList(); 
window.onload = async () => {
    await fetchAPI();
};
const ol = document.querySelector('.cart__items');

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
  
function cartItemClickListener(event) {
  // coloque seu código aqui
  const itemToRemove = event.target;
  itemToRemove.remove();
  localStorage.cartList = ol.innerHTML;
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const achaID = async (event) => {
  const idProduct = event.target.parentElement.firstChild.innerHTML;
  const response = await fetch(`https://api.mercadolibre.com/items/${idProduct}`);
    const data = await response.json();
    const itensCompraveis = createCartItemElement(data);
    console.log(itensCompraveis);
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
    const arr = computer.results;
    arr.forEach((obj) => {
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
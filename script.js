// const fetch = require('node-fetch');

// =======================================================================================
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// =======================================================================================
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// =======================================================================================
function cartItemClickListener(event) {
  // coloque seu código aqui
  const itemRemove = event.target;
  // console.log(itemRemove)
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/remove
  itemRemove.remove();
}

// =======================================================================================
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// =======================================================================================
async function fetchItemID(itemID) {
  const response = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  const data = await response.json();
  return data;
}

// =======================================================================================
function getIdElement() {
  const itemID = this.parentNode.firstChild.innerText;
  const cartItemOl = document.getElementsByClassName('cart__items');
  
  fetchItemID(itemID).then((product) => {
    console.log(product);
    const productItem = createCartItemElement(product);
    cartItemOl[0].appendChild(productItem);
  });
}

// =======================================================================================
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', getIdElement);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// =======================================================================================
const getMblPromise = (item) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`) // retorna uma promise
    .then((response) => {
      response.json().then((jsonMbl) => {
        // console.log(jsonMbl.results);
        jsonMbl.results.forEach((result) => {
          // console.log(result)
          const teste = document.getElementsByClassName('items');
          // console.log(createProductItemElement(result));
          teste[0].appendChild(createProductItemElement(result));
        });
      });
    });
};

const fetchMblPromise = async () => {
  try {
    await getMblPromise('computador');
  } catch (error) {
    console.log(error);
  }
};

// =======================================================================================
window.onload = () => fetchMblPromise();
// window.onload = () => { };

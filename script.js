// =======================================================================================
/* https://pt.stackoverflow.com/questions/22726/como-esconder-mostrar-uma-div-em-html */

function loading() {
  const display = document.querySelector('.loading');
  display.remove();
}

// =======================================================================================
function totalCart() {
  let valorTotal = 0;
  const listItems = document.querySelectorAll('.cart__item');
  const totalPrice = document.querySelector('.total-price');

  if (listItems.length === 0) {
    totalPrice.innerText = '0';
  } else {
    listItems.forEach((listItem) => {
      const valorString = listItem.innerText.split('$')[1];
      const valorFloat = parseFloat(valorString);
      valorTotal += valorFloat;
      totalPrice.innerText = (Math.round(valorTotal * 100) / 100);
    });
  }
}

// =======================================================================================
function clearCart() {
  const getButton = document.querySelector('.empty-cart');

  getButton.addEventListener('click', () => {
    const listItems = document.querySelectorAll('.cart__item');
    console.log('Lista', listItems);

    if (listItems.length > 0) {
      listItems.forEach((listItem) => listItem.remove());
      console.log('Clear', getButton);
      totalCart();
    }
  });
}

// =======================================================================================
function localStorageCart() {
  const listItems = document.querySelector('.cart__items');
  console.log('Local Storage:', listItems.innerHTML);
  localStorage.setItem('listItems', listItems.innerHTML);
}

// =======================================================================================
function loadStorageCart() {
  const listItems = document.querySelector('.cart__items');
  listItems.innerHTML = localStorage.getItem('listItems');
  totalCart();
  listItems.addEventListener('click', (event) => {
    event.target.remove();
    localStorageCart();
    totalCart();
  });
}

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
  console.log(itemRemove);
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/remove
  itemRemove.remove();
  totalCart();
  localStorageCart();
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
    // console.log(product);
    const productItem = createCartItemElement(product);
    cartItemOl[0].appendChild(productItem);
    totalCart();
    localStorageCart();
  });
  // https://developer.mozilla.org/pt-BR/docs/Web/API/Node/firstChild
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
function getMblPromise(item) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`) // retorna uma promise
    .then((response) => {
      response.json().then((jsonMbl) => {
        // console.log(jsonMbl.results);
        jsonMbl.results.forEach((result) => {
          const list = document.getElementsByClassName('items');
          // console.log(createProductItemElement(result));
          list[0].appendChild(createProductItemElement(result));
        });
      });
    });
}

const fetchMblPromise = async () => {
  try {
    await getMblPromise('computador');
    loading();
  } catch (error) {
    console.log(error);
  }
};

// =======================================================================================
window.onload = () => {
  fetchMblPromise();
  loadStorageCart();
  clearCart();
};

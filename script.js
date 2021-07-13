function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  event.target.remove(); // Requisito 3
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addCart = (event) => {
  const skuId = event.target.parentNode.firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${skuId}`)
    .then((response) => {
        response.json().then((data) => {
        // const { sku, name, salePrice } = data;
        console.log(data);
        const cartItem = createCartItemElement(data);
        const cartItems = document.querySelector('.cart__items');
        cartItems.appendChild(cartItem);
      });
    });
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', addCart);
  }
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
//   return item.querySelector('span.item__sku').innerText; // captura id do elemento
// }

// Susbtituido na função que cria o botão
// const clickAdd = () => {
//   const buttons = document.querySelectorAll('.item__add');
//   buttons.forEach((button) => {
//     button.addEventListener('click'const { sku, name, salePrice } = data;, addCart);
//   });
// };

const addItemsToSection = (items) => {
  items.forEach((item) => {
    const itemElement = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
  });
};

const fetchML = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => {
      response.json().then((data) => {
        addItemsToSection(data.results);
      });
    });
};

window.onload = () => {
fetchML('computador');
addCart();
};

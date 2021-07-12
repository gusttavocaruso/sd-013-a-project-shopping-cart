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

function createProductItemElement({ sku, title: name, thumbnail: image }) {
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

// function cartItemClickListener(event) {
//   const addToCartButtons = document.getElementsByClassName('item__add');
//   for (let i = 0; i < addToCartButtons.length; i + 1) {
//   const button = addToCartButtons[i];
//   button.addEventListener('click', createCartItemElement);
//   }
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const ol = document.querySelector('ol');
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   li.appendChild(ol);
//   return li;
// }

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

// const btnClear = document.querySelector('.empty-cart');
// function clear() {
// }

window.onload = () => {
    fetchML('computador');
};

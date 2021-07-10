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
  console.log(event);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const buttonEvent = () => {
  const addItemButton = document.querySelectorAll('.item__add');

  addItemButton.forEach((button) => {
    button.addEventListener('click', (event) => {
      const itemSku = event.target.parentNode.firstChild.innerText; //  PR @cassiorodp
      
      fetch(`https://api.mercadolibre.com/items/${itemSku}`)
        .then((resp) => resp.json())
        .then((dataJson) => {
          const itemInTheCartShop = createCartItemElement(dataJson);
          const cartShop = document.querySelector('.cart__items');
          cartShop.appendChild(itemInTheCartShop);
        });
    });
  });
};

const addItems = (items) => {
  items.forEach((item) => {
    const itemElement = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
  });
};

const getMLProductList = (product) => {
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
      .then((resp) => resp.json())
        .then((dataJson) => {
          addItems(dataJson.results);
          buttonEvent(); // PR @cassiorodp
        });
};

window.onload = () => {
  getMLProductList('computador');
};

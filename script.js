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

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

const addProduct = (items) => {
  items.forEach((item) => {
    const itemHTML = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(itemHTML);
  });
};

const getProduct = (product) => {
  const promise = new Promise((resolve, reject) => {
    if (product !== 'computador') {
      reject(new Error('Produto incorreto'));
    } else {
      fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
        .then((response) => {
          response.json().then((data) => {
            addProduct(data.results);
          });
        });
    }
  });
  return promise;
};

window.onload = () => {
  getProduct('computador');
 };

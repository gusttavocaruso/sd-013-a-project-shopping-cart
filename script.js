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

function createProductItemElement({ sku, name, image }) {
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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getProducts = (query) => fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  .then((response) => response.json()
  .then((data) => data.results.forEach((element) => {
    const { id, title, thumbnail } = element;
    const card = createProductItemElement({ sku: id, name: title, image: thumbnail });
    const items = document.querySelector('.items');
    items.appendChild(card);
  })));

const getProduct = (element) => {
  const idd = element.target.parentElement.querySelector('span.item__sku').innerText;
  fetch(`https://api.mercadolibre.com/items/${idd}`)
  .then((response) => response.json()
  .then(({ id, title, price }) => {
    const cart = document.querySelector('.cart__items');
    cart.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));
  }));
};

const itemAdd = async () => {
  try {
    await getProducts('computador');
    const product = document.querySelector('.items');
    console.log(product);
    product.addEventListener('click', (element) => {
      if (element.target.className === 'item__add') {
        getProduct(element);
      }
    });
  } catch (error) {
    alert(`Erro ao adicionar produto ao carrinho: ${error}`);
  }
};

window.onload = () => {
  itemAdd();
};

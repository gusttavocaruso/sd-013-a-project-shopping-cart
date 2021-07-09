const liElemnto = document.querySelector('.cart__items');

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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const salveCart = () => {
  localStorage.setItem('product', liElemnto.innerHTML);
};

const loadCart = () => {
  liElemnto.innerHTML = localStorage.getItem('product');
  document.querySelectorAll('.cart__item').forEach((el) => el.addEventListener('click', (event) => {
    event.target.remove();
    salveCart();
  }));
  };

function cartItemClickListener(event) {
  event.target.remove();
  salveCart();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemToCart = async (id) => {
  const productDate = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const product = await productDate.json();
  liElemnto.appendChild(createCartItemElement(product));
  salveCart();
};

const addItemCart = (elemnto) => {
  elemnto.querySelector('.item__add').addEventListener('click', (event) => {
    const idProduct = event.target.parentElement.querySelector('.item__sku').innerText;
      addItemToCart(idProduct);
  });
  return elemnto;
};

const getApi = async (query = 'computador') => {
  try {
    const request = await fetch(
      `https://api.mercadolibre.com/sites/MLB/search?q=${query}`,
    );
    const dateProduct = await request.json();
    const objectProducts = dateProduct.results;
    objectProducts.forEach((product) => {
      document
        .querySelector('.items')
        .appendChild(addItemCart(createProductItemElement(product)));
    });
  } catch (e) {
    const error = document.body;
    error.setAttribute('class', 'error');
    error.innerText = `Error!!! \n ${e}`;
  }
};

window.onload = () => {
  getApi();
  loadCart();
};

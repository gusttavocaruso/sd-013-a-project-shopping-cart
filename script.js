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

// // function getSkuFromProductItem(item) {
// //   return item.querySelector('span.item__sku').innerText;
// // }

// function cartItemClickListener(event) {
//   console.log(event.target);
// }

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

const createItens = (itens) => {
  itens.forEach((item) => {
    const create = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(create);
  });
};

const createItemToCart = (data) => {
  const test = createCartItemElement(data);
  console.log(test);
  const ol = document.querySelector('.cart__items');
  ol.appendChild(test);
};

const sendToCart = (id) => {
  const numberId = id.innerText;
  fetch(`https://api.mercadolibre.com/items/${numberId}`)
    .then((resolve) => {
      resolve.json().then((data) => {
        createItemToCart(data);
      });
  });
};

const getId = (e) => {
  const itemClicado = e.path[1];
  const idItemClicado = itemClicado.querySelector('.item__sku');
  sendToCart(idItemClicado);
};

const getItensML = (product) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
    .then((response) => {
      response.json().then((data) => {
        createItens(data.results);

        const buttons = document.querySelectorAll('.item__add');
        buttons.forEach((button) => {
          button.addEventListener('click', getId);
        });
      });
    });
};

window.onload = () => {
  getItensML('computador');
};

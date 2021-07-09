// const fetch = require('node-fetch');

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

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItensInSection = (items) => {
  items.forEach((item) => {
    const { id: sku, title: name, thumbnail: image } = item;
    const itemElement = createProductItemElement({ sku, name, image });
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
  });
};

const fetchMeli = (query) => fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  .then((response) => {
    response.json().then((data) => {
      addItensInSection(data.results);
  });
});

const getProduct = (query) => {
  const getClassItem = query.target.parentElement.querySelector('span.item__sku');
  const idItem = getClassItem.innerText;
  fetch(`https://api.mercadolibre.com/items/${idItem}`)
    .then((response) => response.json()
    .then((data) => {
      const itemSelectAdd = { sku: data.id, name: data.title, salePrice: data.price };
      const listItensCart = document.querySelector('.cart__items');
      listItensCart.appendChild(createCartItemElement(itemSelectAdd));
    }));
};

const itemAdd = async () => {
  try {
    await fetchMeli('computador');
    const containerItens = document.querySelector('.items');
    containerItens.addEventListener('click', (button) => {
      if (button.target.className === 'item__add') {
        getProduct(button);
      }
    });
    // product.forEach((button) => {
    //   button.addEventListener('click', (b) => getProduct(b));
    // });
  } catch (error) {
    alert(`Erro ao adicionar produto> ${error}`);
  }
};

// const itemAdd = async () => {
//   try {
//     await fetchMeli('computador');
//     await getProduct('MLB1607748387');
//     const product = document.querySelectorAll('.item__add');
//     console.log(product);
//     product.forEach((button) => {
//       button.addEventListener('click', (b) => console.log(b));
//     });
//   } catch (error) {
//     alert(`Erro ao adicionar produto> ${error}`);
//   }
// };

window.onload = () => {
  itemAdd();
};
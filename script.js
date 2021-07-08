const myFetch = async (url) => {
  if (url === 'https://api.mercadolibre.com/sites/MLB/search?q=computador') {
    const myObject = {
      method: 'GET',
      headers: { Accept: 'application/json' },
    };

    return fetch(url, myObject)
      .then((response) => response.json())
      .then((object) => object.results); // retorno disso é um array
  }
  throw new Error('Deu ruim');
};

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

 function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
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
const createItems = async (section) => {
  try {
    await myFetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then((arrayOfItems) => arrayOfItems
        .forEach((item) => section.appendChild(createProductItemElement(item))));
  } catch (error) {
    console.log(error);
  }
};

window.onload = () => { 
  const itemsSection = document.querySelector('.items');
  createItems(itemsSection);
};

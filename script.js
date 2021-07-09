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

function cartItemClickListener() {
  const list = document.querySelector('.cart__items');
  const item = document.querySelector('.cart__item');
  list.removeChild(item);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const appendItensSection = (itens) => {
  itens.forEach((item) => {
    const element = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(element);
  });
};

const fetchItemList = (product) =>
  new Promise((resolve) => {
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`).then(
      (response) => {
        response.json().then((data) => {
          appendItensSection(data.results);
          resolve();
        });
      },
    );
  });

const appendCartItens = (data) => {
  const li = createCartItemElement(data);
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
};

const fetchCartItens = (itemId) => {
  fetch(`https://api.mercadolibre.com/items/${itemId}`).then((response) => {
    response.json().then((data) => {
      appendCartItens(data);
      console.log(data);
    });
  });
};

window.onload = () => {
  fetchItemList('computador').then(() => {
    document.querySelectorAll('.item').forEach((value) => {
      const id = value.querySelector('.item__sku').innerText;
      value.querySelector('.item__add').addEventListener('click', () => {
        fetchCartItens(id);
      });
    });
  });
};

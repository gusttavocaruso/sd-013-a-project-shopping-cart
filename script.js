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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  console.log('Só pra passar o lint');
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addCartItem(event) {
  const idItem = getSkuFromProductItem(event.path[1]);
  console.log(idItem);
  fetch(`https://api.mercadolibre.com/items/${idItem}`)
    .then((item) => item.json()).then((produto) => {
      document.querySelector('.cart__items').appendChild(createCartItemElement(produto));
    });
}

const addEventButton = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    button.addEventListener('click', addCartItem);
  });
};

const fetchProduto = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((produtos) => produtos.json()).then((produto) => {
      const lista = produto.results;
      lista.forEach((element) => {
        document.querySelector('.items').appendChild(createProductItemElement(element));
      });
    }).then(() => { addEventButton(); });
};

window.onload = () => { 
  fetchProduto();
};

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

function cartItemClickListener() {
  /* const addLis = document.querySelector('.cart__item');
  addLis.classList.remove('remove');
  addLis.classList.add('remove'); */
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const pegarObj = (id) => 
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((result) => result.json())
    .then((data) => data);

const aPromiseML = (pesquisa) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${pesquisa}`)
    .then((data) => data.json())
    .then((subResults) => subResults.results
    .forEach((item) => {
      const itemList = document.querySelector('.items');
      itemList.appendChild(createProductItemElement(item));
    }));
};

const buttonAdd = () => {
  const section = document.querySelector('.items');
  section.addEventListener('click', async (event) => {
    if (event.target.className === 'item__add') {
      const elementPai = event.target.parentElement;
      const pegarId = getSkuFromProductItem(elementPai);
      const requisitarObj = await pegarObj(pegarId);
      const addLi = createCartItemElement(requisitarObj);
      document.querySelector('.cart__items').appendChild(addLi);
    }
  });
};

window.onload = () => {
  aPromiseML('computador');
  buttonAdd();
};

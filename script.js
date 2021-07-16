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
  // coloque seu código aqui
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItensToSection = (items) => {
  items.forEach((item) => {
    const itemElement = createProductItemElement(item); // item é igual ao produto
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
  });
};

const fetchML = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${query}`)
    .then((response) => { // response traz todas a informações porem de formato de bytes
      response.json().then((data) => {
        addItensToSection(data.results);
      });
    });
};

const addProduto = (idItems) => {
  fetch(`https://api.mercadolibre.com/items/${idItems}`)
    .then((response) => response.json())
    .then((data) => data);
};

const btnAdicionaProdut = () => {
  const allProducts = document.querySelector('.items');

  allProducts.addEventListener('click', async (addclick) => {
    if (addclick.target.className === 'item__add') {
      const paiElement = addclick.target.parentElement;
      const retornaId = getSkuFromProductItem(paiElement);
      const retornaFuncAddProduto = await addProduto(retornaId);
      const adicionaLi = createCartItemElement(retornaFuncAddProduto);
      document.querySelector('.cart__items').appendChild(adicionaLi);
    }
  });
};

window.onload = () => {
  fetchML('computador');
  // addProduto('MLB1341706310')
  btnAdicionaProdut();
};

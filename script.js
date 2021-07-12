const buttonClearList = document.querySelector('.empty-cart');
const ListCartItens = document.querySelector('.cart__items');

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

const SaveList = () => {
  const carList = ListCartItens.innerText;
  console.log(carList);
  localStorage.setItem('listitens', carList);
};

function cartItemClickListener(event) {
  console.log(event.target);
  ListCartItens.removeChild(event.target);
  SaveList();
}

const updateList = () => {
  if (localStorage.getItem('listitens')) {
    const text = localStorage.getItem('listitens');
    const itens = text.split('\n');
    console.log(itens);
    itens.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerText = item;
      li.addEventListener('click', cartItemClickListener);
      ListCartItens.appendChild(li);
    });
  }
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addCartItem(event) {
  const idItem = getSkuFromProductItem(event.path[1]);
  fetch(`https://api.mercadolibre.com/items/${idItem}`)
    .then((item) => item.json()).then((produto) => {
      ListCartItens.appendChild(createCartItemElement(produto));
    }).then(SaveList);
}

const addEventButton = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    button.addEventListener('click', addCartItem);
  });
};

const addItensInSection = (arrayItens) => {
  arrayItens.forEach((element) => {
    document.querySelector('.items').appendChild(createProductItemElement(element));
  });
};
const clearList = () => {
  let tamanho = ListCartItens.children.length;
  for (let i = 0; i < tamanho; i += 1) {
    ListCartItens.removeChild(ListCartItens.lastElementChild);
  }
  tamanho = 0;
  SaveList();
};

buttonClearList.addEventListener('click', clearList);

const fetchProduto = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((produtos) => produtos.json())
      .then((produto) => addItensInSection(produto.results))
        .then(() => { addEventButton(); });
};

window.onload = () => { 
  fetchProduto();
  updateList();
};

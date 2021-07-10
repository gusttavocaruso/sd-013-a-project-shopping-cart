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
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createSectionObject (items) {
items.forEach(item => {
  const createItemElement = createProductItemElement(item);
  const section = document.querySelector('.items');
  section.appendChild(createItemElement);
})
}

function fetchObject(query) {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  .then((response) => response.json()).then((data)=> {
   createSectionObject(data.results);
  })
}

  const pegarObj = (id) => {
    return fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((result) => result.json())
      .then((data) => data);
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
  fetchObject('computador')
  buttonAdd()
  
};

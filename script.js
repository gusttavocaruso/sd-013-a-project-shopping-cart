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

// function getSkuFromProductItem(item) {
  //   return item.querySelector('span.item__sku').innerText;
  // }
  
function cartItemClickListener(event) {
      // coloque seu código aqui
      const itemToRemove = event.target;
      itemToRemove.remove();
  }

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const achaID = (event) => {
  const idProduct = event.target.parentElement.firstChild.innerHTML;
  fetch(`https://api.mercadolibre.com/items/${idProduct}`)
  .then((response) => response.json())
  .then((data) => {
    const ol = document.querySelector('.cart__items');
    const itensCompraveis = createCartItemElement(data);
    ol.appendChild(itensCompraveis);
  });
};

const fetchAPI = () => new Promise(() => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json()
  .then((computer) => {
    // Recebi Ajuda do Luiz Furtado
    const itemList = document.querySelector('.items');
    const arr = computer.results;
    arr.forEach((obj) => {
      const objs = createProductItemElement(obj);
      itemList.appendChild(objs);
      objs.lastChild.addEventListener('click', achaID);
    });
  }));
});

  window.onload = () => { fetchAPI(); };
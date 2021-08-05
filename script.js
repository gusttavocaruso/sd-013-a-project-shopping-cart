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

function createProductItemElement(sku, name, image) {
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
  const { parentElement } = event.target;
  parentElement.removeChild(event.target);
}

function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function fetchMercadoLivre(produto) {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${produto}`)
  .then((response) => {
    response.json().then((dadosProduto) => {
      dadosProduto.results.forEach((result) => {
        const itemShowed = createProductItemElement(result.id, result.title, result.thumbnail);
        const sectionItems = document.querySelector('.items');  
        sectionItems.appendChild(itemShowed);
      });
    });
  });
}

function addToCart() {
  const itemToAdd = document.querySelector('.items');
  itemToAdd.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const itemToBeAdd = getSkuFromProductItem(event.target.parentElement);
      fetch(`https://api.mercadolibre.com/items/${itemToBeAdd}`)
      .then((response) => {
        response.json().then((dadosAdicionar) => {
          const itemAdicionar = createCartItemElement(
            dadosAdicionar.id, 
            dadosAdicionar.title, 
            dadosAdicionar.price,
            );
            const olCart = document.querySelector('.cart__items');
            olCart.appendChild(itemAdicionar);
        });
      });
    }
  });
}

window.onload = () => {
  fetchMercadoLivre('computador');
  addToCart();
};

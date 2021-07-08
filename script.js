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

const getJson = async () => {
  const linkProduct = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const fetchProductUrl = await fetch(linkProduct);
  const productJson = await fetchProductUrl.json();
  const productResults = productJson.results;
  
  productResults.forEach((product) => document.querySelector('.items')
    .appendChild(createProductItemElement(product)));   
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const getComputer = async (id) => {
  const linkComputer = `https://api.mercadolibre.com/items/${id}`;
  const fetchComputerUrl = await fetch(linkComputer);
  const computerJson = await fetchComputerUrl.json();    
  return computerJson;    
};

function cartItemClickListener(event) {
  event.target.remove();
} 

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const buttonEvent = () => {
  const computerList = document.querySelector('.items');
  computerList.addEventListener('click', async (event) => {
    if (event.target.className === 'item__add') {
      const btnParent = event.target.parentElement;
      const id = getSkuFromProductItem(btnParent);
      const computer = await getComputer(id);
      return document.querySelector('.cart__items')
        .appendChild(createCartItemElement(computer));        
    }
  });
};

window.onload = () => {
  getJson();
  buttonEvent();
};  
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

/*
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}
*/

/* function createCartItemElement({ sku: id, name: title, salePrice: base_price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
} */
// --------------------------------------------------------------
/* 
const addItemInCart = (ItemCart) => {
  const itemElementCart = createCartItemElement(ItemCart);
  const listCart = document.querySelector('cart_items');
  listCart.appendChild(itemElementCart);
};

const fetchCartApi = (event) => {
  
  fetch(`https://api.mercadolibre.com/items/${ItemID}`)
  .then((response) => {
    response.json().then((data) => addItemInCart(data)); 
  });
}; */
// ---------------------------------------------------------------
const addItensToSection = (items) => {
   items.forEach((item) => {
    const itemElement = createProductItemElement(item); // cada um dos produtos da lista JSON
    const section = document.querySelector('.items');
     section.appendChild(itemElement);
  });
};

const fetchSearchApi = (produto) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${produto}`)
  .then((response) => { 
    response.json().then((data) => {
      addItensToSection(data.results);
      });
  });
};

window.onload = () => { 
  fetchSearchApi('computador');
};

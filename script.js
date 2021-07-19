// Projeto completo com 80% com ajuda do Josue Lobo.
const cartItems = document.querySelector('.cart__items');
const load = document.querySelector('.loading');
const buttonClear = document.querySelector('.empty-cart');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  event.target.remove();
 }

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  cartItems.appendChild(li);
  return li;
}

const addStorage = () => {
  localStorage.setItem('carrinho', cartItems.innerHTML);
};

const addItemCart = async (id) => {
  try { 
  const respon = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const responApi = await respon.json();
  createCartItemElement(responApi);
  addStorage();
  } catch (error) {
    alert(error);
  }
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.lastElementChild.addEventListener('click', (evento) => {
    addItemCart(evento.target.parentElement.firstElementChild.innerText);
  });

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const updateStorage = () => {
  if (cartItems !== null) {
  cartItems.innerHTML = localStorage.getItem('carrinho');
  }
};

const addItems = (items) => {
  items.forEach((item) => {
    const itemElement = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
  });
};

const clearCart = () => {
  const listCart = document.querySelectorAll('.cart__item');
  listCart.forEach((element) => {
    element.parentNode.removeChild(element);
    addStorage();
  });
};

buttonClear.addEventListener('click', clearCart);

const fetchML = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => {
      response.json().then((data) => {
        addItems(data.results);
      });
      load.remove();  
    });
};

window.onload = () => {
  fetchML('computador');
  addItemCart();
  updateStorage();
 };

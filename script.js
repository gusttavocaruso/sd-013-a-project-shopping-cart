function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const sumTotalPrice = async () => {
  const spanPrice = document.querySelector('.total-price');
  const items = JSON.parse(localStorage.getItem('cart'));
  const sum = await items.map((item) => item.price)
  .reduce((acc, item) => acc + item, 0);
  spanPrice.innerText = sum;
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
  // remove itens

function cartItemClickListener(element, id) {
  element.remove();
  const items = JSON.parse(localStorage.getItem('cart'));
  const filteredItems = items.filter((item) => item.id !== id);
  localStorage.setItem('cart', JSON.stringify(filteredItems));
  console.log(filteredItems);
}

  // cria o carrinho de compras
const cartItems = '.cart__items';

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  const list = document.querySelector(cartItems);

  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  list.appendChild(li);
  li.addEventListener('click', (event) => {
    cartItemClickListener(event.target, sku);
    sumTotalPrice();
  });
  
  return li;
}
 // salva itens  no local storage quando eu clico

const saveItemKartElement = (items) => {
  localStorage.setItem('cart', items);
};

async function insertId(productId) {
  const apiId = `https://api.mercadolibre.com/items/${productId}`;
  const res = await fetch(apiId);
  const data = await res.json();
  return data;
}

const handleClick = async () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    button.addEventListener('click', async (event) => {
      const items = JSON.parse(localStorage.getItem('cart')) || [];
      const target = event.target.parentNode.firstChild;
      const SKU = await insertId(target.innerText);
      items.push(SKU);
      createCartItemElement(SKU);
      saveItemKartElement(JSON.stringify(items));
      await sumTotalPrice();
    });
  });
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const addItensToSection = (itens) => {
  const sectionItems = document.querySelector('.items');
  itens.forEach((item) => {
    const itemElement = createProductItemElement(item);
    sectionItems.appendChild(itemElement);
  });
};

const fetchApi = async () => {
  const api = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const res = await fetch(api);
  const data = await res.json();
  return data;
};

const itemList = async () => {
  const { results } = await fetchApi();
  addItensToSection(results);
  handleClick();
};

const loadLocalStorage = async () => {
  const cart = document.querySelector(cartItems);
  const items = JSON.parse(localStorage.getItem('cart'));
  if (!items) return false;

  items.forEach((item) => {
    const eachItem = createCartItemElement(item);
    cart.appendChild(eachItem);
});
};

const clearCart = () => {
  const clearCartButton = document.querySelector('.empty-cart');
  const elementCarItems = document.querySelector(cartItems);
  const totalPrice = document.querySelector('.total-price');

  clearCartButton.addEventListener('click', () => {
    const clearStorage = localStorage.clear();
    totalPrice.inneText = '';
    elementCarItems.innerText = '';
    return clearStorage;
  });
};

window.onload = () => {
  itemList();
  loadLocalStorage();
  clearCart();
  sumTotalPrice();
};

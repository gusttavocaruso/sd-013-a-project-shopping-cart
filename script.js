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
  // remove itens
function cartItemClickListener(event) {
  event.target.remove();
}

  // cria o carrinho de compras

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  const list = document.querySelector('.cart__items');

  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  list.appendChild(li);
  li.addEventListener('click', cartItemClickListener);
  
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

const handleClick = () => {
  const buttons = document.querySelectorAll('.item__add');
  const items = JSON.parse(localStorage.getItem('cart')) || [];
  buttons.forEach((button) => {
    button.addEventListener('click', async (event) => {
      const target = event.target.parentNode.firstChild;
      const SKU = await insertId(target.innerText);
      items.push(SKU);
      createCartItemElement(SKU);
      saveItemKartElement(JSON.stringify(items));
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
  const cart = document.querySelector('.cart__items');
  const items = JSON.parse(localStorage.getItem('cart'));
  if (!items) return false;

  items.forEach((item) => {
    const eachItem = createCartItemElement(item);
    cart.appendChild(eachItem);
});
};

window.onload = async () => {
  itemList();
  loadLocalStorage();
};

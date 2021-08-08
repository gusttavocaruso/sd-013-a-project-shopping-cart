// Projeto feito com a ajuda de Rogerio P. e Rafael J.
const cartItems = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
let total = 0;

const saveCart = () => {
  localStorage.setItem('key', cartItems.innerHTML);
  localStorage.setItem('total', total);
};

const addTotal = ({ price }) => {
  total += price;
  totalPrice.innerText = `${Number(total)}`;
};

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

const removeTotal = (target) => {
  const wholeText = target.innerHTML.split('PRICE: $');
  const price = Number(wholeText[1]);
  total -= price;
  totalPrice.innerText = `${total}`;
};

function cartItemClickListener(event) {
  event.target.remove();
  saveCart();
  removeTotal(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchItem = async (ItemID) => {
  try {
    const merliv = await fetch(`https://api.mercadolibre.com/items/${ItemID}`);
    const jsonFiltrado = await merliv.json();
    const result = createCartItemElement(jsonFiltrado);
    cartItems.appendChild(result);
    addTotal(jsonFiltrado);
    saveCart();
  } catch (error) {
    console.log(error);
  }
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.querySelector('.item__add').addEventListener('click', () => fetchItem(sku));
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const fetchProducts = async (QUERY = 'computador') => {
  try {
    const merliv = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`);
    const jsonFiltrado = (await merliv.json()).results;
    jsonFiltrado.forEach((item) => {
      const items = document.querySelector('.items');
      items.appendChild(createProductItemElement(item));
    });
    document.querySelector('.loading').remove();
  } catch (error) {
    alert(error);
  }
};

const loadCart = () => {
  const key = localStorage.getItem('key');
  const totalSaved = localStorage.getItem('total');
  cartItems.innerHTML = key;
  document.querySelectorAll('.cart__item')
    .forEach((item) => item.addEventListener('click', cartItemClickListener));
  totalPrice.innerText = `${totalSaved}`;
  console.log(typeof totalSaved);
  total = Number(totalSaved);
};

const cleanCart = () => {
  cartItems.innerHTML = '';
  total = 0;
  saveCart();
  totalPrice.innerText = `${total}`;
};

document.querySelector('.empty-cart').addEventListener('click', cleanCart);

window.onload = async () => {
  await fetchProducts();
  loadCart();
};

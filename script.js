// Projeto realizado com ajuda de alguns colegas, estive tendo muita dificuldade.
const carti = '.cart__items';
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
  // .addEventListener('click', addCar);
  
  return section;
}

const totalPrice = () => {
  const item = document.querySelector('.total-price');
  let total = 0;
  for (let i = 0; i < localStorage.length; i += 1) {
    const price = parseFloat(localStorage[`objeto${[i]}`].split('$')[1]);
     total += price;
  }
  item.innerText = `${total}`;
};

const save = () => {
    const carrin = document.querySelectorAll('.cart__item');
    localStorage.clear();
    for (let i = 0; i < carrin.length; i += 1) {
      localStorage.setItem(`objeto${[i]}`, carrin[i].textContent);
    }
    totalPrice();
  };

const pc = (func) => {
  const buttons = document.querySelectorAll('.item__add');
  const itemId = document.querySelectorAll('.item__sku');
  buttons.forEach((button, i) => {
    button.addEventListener('click', () => {
      func(itemId[i].innerText);
  });
  });
};

function cartItemClickListener(event) {
  event.target.remove();
  save();
  totalPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }, getLocal) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  if (sku) li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  if (!sku) li.innerText = getLocal;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const carrinhoCheio = () => {
  const retorna = document.querySelector(carti);
  for (let i = 0; i < localStorage.length; i += 1) {
    const getLocal = localStorage.getItem(`objeto${[i]}`);
    retorna.appendChild(createCartItemElement({ id: undefined }, getLocal));
}
totalPrice();
};

const lista = async (id) => {
  const objetos = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const objeto = await objetos.json();
  const item = document.querySelector(carti);
  item.appendChild(createCartItemElement(objeto));
  save();
};

const loadApi = () => {
  const item = document.querySelectorAll('.item');
  const items = document.querySelector('.items');
  const h1 = document.createElement('h1');
  h1.className = 'loading';
  h1.innerText = 'loading...';
  if (item.length === 0) items.appendChild(h1);
  if (item.length === 50) document.querySelector('.loading').remove();
};

const r1 = async (produto) => {
  const computers = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${produto}`);
  const computer = await computers.json();
  computer.results.forEach((element) => {
    const setcomputer = document.querySelector('.items');
    setcomputer.appendChild(createProductItemElement(element));
    loadApi();
  });
  pc(lista);
};

// const clearAll = () => {
//   const item = document.querySelector(carti);
//   const butt = document.querySelector('.empty-cart');

//   butt.addEventListener('click', () => {
//     localStorage.clear();
//     item.replaceChildren();
//     totalPrice();
//   });
// };

window.onload = () => {
  r1('computador');
  carrinhoCheio();
  totalPrice();
  // clearAll();
  loadApi();
};
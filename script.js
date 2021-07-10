const liElemnto = document.querySelector('.cart__items');
// dica Matheus Duarte, Matheus Camillo, Josue, Rafael.
const valotTotal = document.querySelector('#totalPreco');
const bntClear = document.querySelector('.empty-cart');

const soma = (valor) => {
  const total = Number(valotTotal.innerText) + valor;
  valotTotal.innerText = total;
  console.log(total);
};

const sub = (valor) => {
  const total = Number(valotTotal.innerText) - Number(valor.querySelector('#p').innerText);
  valotTotal.innerText = Math.round(total * 100) / 100;
   console.log(total);
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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// Salva os produtos no local Storage.
const salveCart = () => {
  localStorage.setItem('product', liElemnto.innerHTML);
};

// Add o evento de remove nos produtos da lista
function cartItemClickListener(eventt) {
  eventt.target.remove();
  sub(eventt.target);
  salveCart();
}

// Carrega os produtos salvos no local Storage e add evento de remove.
const loadCart = () => {
  liElemnto.innerHTML = localStorage.getItem('product');
  document.querySelectorAll('.cart__item').forEach((el) => el.addEventListener('click', (event) => {
    event.target.remove();
    sub(event.target);
    salveCart();
  }));
  };

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerHTML = `SKU: ${sku} | NAME: ${name} | PRICE: $<span id='p'>${salePrice}<span>`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemToCart = async (id) => {
  const productDate = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const product = await productDate.json();
  soma(product.price);
  liElemnto.appendChild(createCartItemElement(product));
  salveCart();
};

// Add o evento ao elemento e add o mesmo no carrinho.
const addItemCart = (elemnto) => {
  elemnto.querySelector('.item__add').addEventListener('click', (event) => {
    const idProduct = event.target.parentElement.querySelector('.item__sku').innerText;
      addItemToCart(idProduct);
  });
  return elemnto;
};

// Faz requisiçao no mercadolivre e add o elemento ao html.
const getApi = async (query = 'computador') => {
  try {
    const request = await fetch(
      `https://api.mercadolibre.com/sites/MLB/search?q=${query}`,
    );
    const dateProduct = await request.json();
    const objectProducts = dateProduct.results;
    objectProducts.forEach((product) => {
      document
        .querySelector('.items')
        .appendChild(addItemCart(createProductItemElement(product)));
    });
    document.querySelector('.loading').remove();
  } catch (e) {
    const error = document.body;
    error.setAttribute('class', 'error');
    error.innerText = `Error!!! \n ${e}`;
  }
};

bntClear.addEventListener('click', () => {
  liElemnto.innerText = '';
  valotTotal.innerText = 0;
});

window.onload = () => {
  getApi();
  loadCart();
};

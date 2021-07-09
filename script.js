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

const fetlivre = () => new Promise((resolve) => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=actionfigure')
  .then((response) => {
    response.json().then((products) => {
      resolve(products);
      console.log(products.results);
      products.results.forEach((element) => {
        const produto = createProductItemElement(element);
        const lista = document.querySelector('.items');
        lista.appendChild(produto);
      });
    });
  });
});

// console.log(fetlivre());

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const Soma = () => new Promise((resolve) => {
  const itens = document.querySelectorAll('.cart__item');
  const preçoTotal = document.querySelector('.total-price');
  let total = 0;
  itens.forEach((produto) => {
    const precoDoItem = parseFloat(produto.innerText.split('$')[1]);
    total += precoDoItem;
  });
  preçoTotal.innerText = Math.round(total * 100) / 100;
  resolve();
});

function cartItemClickListener(event) {
  event.target.remove();
  Soma();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const local = () => {
  const carrinho = document.getElementsByClassName('cart__items')[0];
  localStorage.setItem('items', carrinho.innerHTML);
};

  const carregar = () => new Promise((resolve) => {
    if (localStorage.getItem('items')) {
      const carrinho = document.getElementsByClassName('cart__items')[0];
      carrinho.innerHTML = localStorage.getItem('items');
      resolve();
    }
  });

const getIds = () => new Promise((resolve) => {
  const itemsSectionArray = document.getElementsByClassName('item');
  const produtos = Array.from(itemsSectionArray);

  produtos.forEach((item) => {
    item.addEventListener('click', () => {
      const itemUrl = `https://api.mercadolibre.com/items/${getSkuFromProductItem(item)}`;
      fetch(itemUrl)
        .then((response) => response.json()
        .then((produto) => {
          const produtoNoCarrinho = document.getElementsByClassName('cart__items')[0];
          produtoNoCarrinho.appendChild(createCartItemElement(produto));
          local();
          Soma();
        }));
    });
  });
  resolve();
});

const fetchPromise = async () => {
  try {
    await fetlivre();
    await getIds();
    await carregar();
    await Soma();
  } catch (error) {
    console.log(error);
  }
};

window.onload = () => {
  fetchPromise();
};

const string = '.cart__items';
// função para exercico 1: cria imagens
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// função: cria elemnetos html
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// ex.1: função cria a section, e adiciona os filhos.
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// cria uma linha com elemento, através do ID do elemento.
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// desafio5
// const sum = () => {
//   const ol = document.querySelector(string);
//   const divs = [...ol.children];
//   divs.reduce((acc, li) => {
//   let acc = acc;
//   acc += number(li.innerText.split('$')[1]
//   return acc
//   }, 0);
//   return divs;
// };
// const divdiv =() => {
//   const div = document.querySelector('')
// }

// desafio4
const local = () => {
  const ol = document.querySelector(string);
  const olol = ol.innerHTML;
  localStorage.setItem('lista', olol);
};

const salva = (() => {
  const ol = document.querySelector(string);
  ol.innerHTML = localStorage.getItem('lista');
  // console.log(ol.children);
  ol.addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') {
      event.target.remove();
    }
  });
});

// desafio3
function cartItemClickListener(event) {
  event.target.remove();
  local();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// desafio 2 ajuda de Gabriel
const funcFetch = (query) => {
  fetch(`https://api.mercadolibre.com/items/${query}`)
    .then((response) => response.json())
    .then((data) => {
      const li = createCartItemElement(data);
      const ol = document.querySelector(string);
      ol.appendChild(li);
      local();
    });
};

// faz parte do desafio 2. ficou aqui para passar no lint
const getId = (event) => {
  const idElement = getSkuFromProductItem(event.target.parentElement);
  funcFetch(idElement);
};

// resolve desafio 1 e parte do 2 - (com ajuda da Aline Hoshino)
const addProducts = (itens) => {
  itens.forEach((item) => {
    const product = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(product);
  });
  const butons = document.querySelectorAll('.item__add');
  butons.forEach((button) => {
    button.addEventListener('click', getId);
  });
};

// resolve desafio 1 - (com ajuda da Aline Hoshino)
const mercadoLivre = ((query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((resposta) => {
      resposta.json().then((data) => {
        addProducts(data.results);
      });
    });
});

window.onload = () => {
  mercadoLivre('computador');
  salva();
};
